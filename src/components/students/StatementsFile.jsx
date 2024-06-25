import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function StatementsFile({ studentId, onDataChange }) {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://77.221.152.210:5008/api/Users/GetByDepartmentId/3fa85f64-5717-4562-b3fc-2c963f66afa1");
            setStudents(response.data.items);
        } catch (error) {
            console.error('Ошибка при получении студентов:', error);
        }
    };

    const fetchGradesForStudent = async (studentId) => {
        try {
            const homeworkResponse = await axios.get(`http://77.221.152.210:5008/api/HomeWorks?studentId=${studentId}`);
            const attendanceResponse = await axios.get(`http://77.221.152.210:5008/api/StudentAttendances?studentId=${studentId}`);

            return {
                homeworkGrades: homeworkResponse.data.items,
                attendanceGrades: attendanceResponse.data.items,
            };
        } catch (error) {
            console.error('Ошибка при получении оценок:', error);
            return {
                homeworkGrades: [],
                attendanceGrades: [],
            };
        }
    };

    const updateExcelFile = async () => {
        try {
            const response = await fetch('/yakist.xlsx');
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            for (let index = 0; index < students.length; index++) {
                const student = students[index];
                const row = 9 + index;
                worksheet[`A${row}`] = { v: `${student.student}` };

                const { homeworkGrades, attendanceGrades } = await fetchGradesForStudent(student.id);

                homeworkGrades.forEach((grade, idx) => {
                    const cell = String.fromCharCode(69 + idx) + row; // 'E' = 69 in ASCII
                    worksheet[cell] = { v: grade.grade };
                });

                attendanceGrades.forEach((grade, idx) => {
                    const cell = `AE${row + idx}`;
                    worksheet[cell] = { v: grade.grade };
                });
            }

            const updatedData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([updatedData], { type: "application/octet-stream" });
            saveAs(blob, "Updated_Основи композиції та дизайну.xlsx");

        } catch (error) {
            console.error('Ошибка при обновлении файла Excel:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center bg-gray-500 bg-opacity-50 justify-center overflow-x-hidden overflow-y-auto w-full">
            <div className="max-w-4xl w-full">
                <Card className="my-6">
                    <CardBody>
                        <div className="flex flex-col gap-6">
                            <Typography variant="h5" className="text-center">
                                Обновление файла с оценками
                            </Typography>
                            <Button className="bg-emerald-500" onClick={updateExcelFile}>
                                Обновить файл
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default StatementsFile;
