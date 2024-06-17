import React, { useEffect, useState } from "react";
import axios from "axios";
import DropDisciplines from "../disciplines/DropDisciplines";
import {
    Card,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";

function StudentsSuccessModal({ isOpen, onClose, studentId }) {
    const [homeworkGrades, setHomeworkGrades] = useState([]);
    const [attendanceGrades, setAttendanceGrades] = useState([]);
    const [selectedDisciplineId, setSelectedDisciplineId] = useState(null);
    const [averageGrade, setAverageGrade] = useState(0);

    useEffect(() => {
        fetchGrades(selectedDisciplineId, studentId);
    }, [selectedDisciplineId, studentId]);

    useEffect(() => {
        calculateAverageGrade();
    }, [homeworkGrades, attendanceGrades]);

    const fetchGrades = (disciplineId, studentId) => {
        if (disciplineId && studentId) {
            axios.get(`http://localhost:5008/api/HomeWorks?disciplineId=${disciplineId}&studentId=${studentId}`)
                .then(response => {
                    setHomeworkGrades(response.data.items);
                })
                .catch(error => {
                    console.error('Error fetching homework grades:', error);
                });
            axios.get(`http://localhost:5008/api/StudentAttendances?disciplineId=${disciplineId}&studentId=${studentId}`)
                .then(response => {
                    setAttendanceGrades(response.data.items);
                })
                .catch(error => {
                    console.error('Error fetching attendance grades:', error);
                });
        } else {
            setHomeworkGrades([]);
            setAttendanceGrades([]);
        }
    };

    const calculateAverageGrade = () => {
        const combinedGrades = homeworkGrades.concat(attendanceGrades);
        if (combinedGrades.length === 0) {
            setAverageGrade(0);
            return;
        }
        const sum = combinedGrades.reduce((acc, grade) => acc + grade.grade, 0);
        setAverageGrade(sum / combinedGrades.length);
    };

    const lessonId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    const handleEditGrade = (gradeId, newGrade, type) => {
        const url = type === 'homework'
            ? `http://localhost:5008/api/HomeWorks/${gradeId}`
            : `http://localhost:5008/api/StudentAttendances/${gradeId}`;

        axios.put(url, { grade: newGrade, studentId: studentId, lessonId: lessonId })
            .then(response => {
                if (response.status === 200) {
                    if (type === 'homework') {
                        const updatedGrades = homeworkGrades.map(grade => {
                            if (grade.id === gradeId) {
                                return { ...grade, grade: newGrade };
                            } else {
                                return grade;
                            }
                        });
                        setHomeworkGrades(updatedGrades);
                    } else {
                        const updatedGrades = attendanceGrades.map(grade => {
                            if (grade.id === gradeId) {
                                return { ...grade, grade: newGrade };
                            } else {
                                return grade;
                            }
                        });
                        setAttendanceGrades(updatedGrades);
                    }
                }
            })
            .catch(error => {
                console.error('Error updating grade:', error);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center bg-gray-500 bg-opacity-50 justify-center overflow-x-hidden overflow-y-auto w-full">
            <div className="max-w-4xl w-full">
                <Card className="my-6">
                    <CardBody>
                        <div className="flex flex-col gap-6">
                            <DropDisciplines onChange={setSelectedDisciplineId} />
                            <Typography variant="h5" className="text-center">
                                Оценка за домашние задания и работу на уроке
                            </Typography>
                            <div className="space-y-4">
                                <div>
                                    <Typography variant="h6">
                                        Домашние задания:
                                    </Typography>
                                    <ul className="list-disc list-inside">
                                        {homeworkGrades.map((grade, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    const newGrade = prompt('Введите новую оценку:', grade.grade);
                                                    const newAnswer = prompt('Введите новый ответ:', grade.comment || '');
                                                    const date = prompt('Введите новый ответ:', grade.date || '');
                                                    if (newGrade !== null && newGrade !== '' && newAnswer !== null) {
                                                        handleEditGrade(grade.id, { grade: newGrade, comment: newAnswer }, 'homework');
                                                    }
                                                }}
                                                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                                            >
                                                ДЗ: {grade.grade}, Коментарий: {grade.comment || 'Нет ответа'}, {grade.date}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <Typography variant="h6">
                                        Классная работа:
                                    </Typography>
                                    <ul className="list-disc list-inside">
                                        {attendanceGrades.map((grade, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    const newGrade = prompt('Введите новую оценку:', grade.grade);
                                                    if (newGrade !== null && newGrade !== '') {
                                                        handleEditGrade(grade.id, newGrade, 'attendance');
                                                    }
                                                }}
                                                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                                            >
                                                Классная работа: {grade.grade}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Typography className="font-bold">
                                    Средняя оценка: {averageGrade.toFixed(2)}
                                </Typography>
                            </div>
                        </div>
                    </CardBody>
                    <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <Button
                            className="bg-emerald-500"
                            onClick={onClose}
                        >
                            Готово
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default StudentsSuccessModal;
