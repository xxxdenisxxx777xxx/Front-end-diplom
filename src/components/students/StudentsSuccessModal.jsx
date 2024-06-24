import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

function StudentsSuccessModal({ isOpen, onClose, studentId, onDataChange }) {
    const [grades, setGrades] = useState([]);
    const [averageGrade, setAverageGrade] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [editableGrade, setEditableGrade] = useState(null);

    useEffect(() => {
        if (studentId) {
            fetchGrades(studentId);
        }
        fetchSubjects();
    }, [studentId]);

    useEffect(() => {
        calculateAverageGrade();
    }, [grades]);

    const fetchGrades = async (studentId) => {
        try {
            const homeworkResponse = await axios.get("http://77.221.152.210:5008/api/HomeWorks");
            const attendanceResponse = await axios.get("http://77.221.152.210:5008/api/StudentAttendances");

            const combinedGrades = [...homeworkResponse.data.items, ...attendanceResponse.data.items];
            const filteredGrades = combinedGrades.filter(grade => grade.studentId === studentId);

            setGrades(filteredGrades);
            onDataChange({ grades: filteredGrades, subjects });
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get("http://77.221.152.210:5008/api/Lessons");
            setSubjects(response.data.items);
            onDataChange({ grades, subjects: response.data.items });
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const calculateAverageGrade = () => {
        if (grades.length === 0) {
            setAverageGrade(0);
            return;
        }
        const sum = grades.reduce((acc, grade) => acc + grade.grade, 0);
        setAverageGrade(sum / grades.length);
    };

    const getSubjectName = (lessonId) => {
        const subject = subjects.find(sub => sub.id === lessonId);
        return subject ? subject.subjectName : 'Неизвестный предмет';
    };

    const handleGradeClick = (grade) => {
        setEditableGrade(grade);
    };

    const handleGradeChange = (event) => {
        setEditableGrade({ ...editableGrade, grade: Number(event.target.value) });
    };

    const handleGradeBlur = async () => {
        const updatedGrade = editableGrade;
        setEditableGrade(null);

        try {
            if (updatedGrade.type === 'homework') {
                await axios.put(`http://77.221.152.210:5008/api/HomeWorks/${updatedGrade.id}`, updatedGrade);
            } else {
                await axios.put(`http://77.221.152.210:5008/api/StudentAttendances/${updatedGrade.id}`, updatedGrade);
            }

            const updatedGrades = grades.map(grade =>
                grade.id === updatedGrade.id ? updatedGrade : grade
            );
            setGrades(updatedGrades);
            onDataChange({ grades: updatedGrades, subjects });
        } catch (error) {
            console.error('Error updating grade:', error);
        }
    };

    if (!isOpen) return null;

    const TABLE_HEAD = ["Предмет", "Оценки"];

    const groupedGrades = grades.reduce((acc, grade) => {
        const subjectName = getSubjectName(grade.lessonId);
        if (!acc[subjectName]) {
            acc[subjectName] = [];
        }
        acc[subjectName].push(grade);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 z-50 flex items-center bg-gray-500 bg-opacity-50 justify-center overflow-x-hidden overflow-y-auto w-full">
            <div className="max-w-4xl w-full">
                <Card className="my-6">
                    <CardBody>
                        <div className="flex flex-col gap-6">
                            <Typography variant="h5" className="text-center">
                                Оценка за домашние задания и работу на уроке
                            </Typography>
                            <Card className="h-full w-full overflow-scroll">
                                <table className="w-full min-w-max table-auto text-left">
                                    <thead>
                                        <tr>
                                            {TABLE_HEAD.map((head) => (
                                                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal leading-none opacity-70"
                                                    >
                                                        {head}
                                                    </Typography>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(groupedGrades).map((subjectName, index) => (
                                            <tr key={index} className="even:bg-blue-gray-50/50">
                                                <td className="p-4">
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {subjectName}
                                                    </Typography>
                                                </td>
                                                <td className="p-4">
                                                    {groupedGrades[subjectName].map((grade, i) => (
                                                        <div key={i} className="inline-block mr-4">
                                                            {editableGrade && editableGrade.id === grade.id ? (
                                                                <input
                                                                    type="number"
                                                                    value={editableGrade.grade}
                                                                    onChange={handleGradeChange}
                                                                    onBlur={handleGradeBlur}
                                                                    autoFocus
                                                                    className="border rounded p-1"
                                                                />
                                                            ) : (
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="font-normal"
                                                                    onClick={() => handleGradeClick(grade)}
                                                                >
                                                                    {grade.grade}
                                                                </Typography>
                                                            )}
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                            <Typography className="font-bold">
                                Средняя оценка: {averageGrade.toFixed(2)}
                            </Typography>
                        </div>
                    </CardBody>
                    <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <Button className="bg-emerald-500" onClick={onClose}>
                            Готово
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default StudentsSuccessModal;
