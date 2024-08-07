import React, { useState, useEffect } from "react";

function ExcelReportModal({ isOpen, onClose, selectedDiscipline, students }) {
    const [disciplineId, setDisciplineId] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [homeworks, setHomeworks] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchDisciplineId();
        }
    }, [isOpen, selectedDiscipline]);

    useEffect(() => {
        if (disciplineId) {
            fetchHomeworkData();
        }
    }, [disciplineId]);

    const fetchDisciplineId = async () => {
        try {
            const response = await fetch(
                `http://77.221.152.210:5008/api/Disciplines`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch disciplines");
            }
            const data = await response.json();
            const discipline = data.items.find(
                (item) => item.name === selectedDiscipline
            );
            if (discipline) {
                setDisciplineId(discipline.id);
                fetchLessonData(selectedDiscipline);
            } else {
                setError("Discipline not found");
            }
        } catch (error) {
            console.error("Error fetching disciplines:", error);
            setError("Error fetching disciplines");
        }
    };

    const fetchLessonData = async (selectedDiscipline) => {
        try {
            const lessonsResponse = await fetch(
                `http://77.221.152.210:5008/api/Lessons/GetBySubjectName?subjectName=${encodeURIComponent(
                    selectedDiscipline
                )}`
            );
            if (!lessonsResponse.ok) {
                throw new Error("Failed to fetch lessons");
            }
            const lessonsData = await lessonsResponse.json();
            setLessons(lessonsData.items);
            setError(null);
        } catch (error) {
            console.error("Error fetching lessons data:", error);
            setError("Error fetching lessons data");
        }
    };

    const fetchHomeworkData = async () => {
        try {
            const homeworkData = {};
            for (const student of students) {
                const response = await fetch(
                    `http://77.221.152.210:5008/api/HomeWorks/GetByStudentId/${student.id}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch homework for student ${student.id}`);
                }
                const data = await response.json();
                homeworkData[student.id] = data.items.filter(item => item.grade !== 0); // Filter out homework grades that are 0
            }
            setHomeworks(homeworkData);
        } catch (error) {
            console.error("Error fetching homework data:", error);
            setError("Error fetching homework data");
        }
    };

    const calculateAverageGrade = (grades) => {
        const validGrades = grades.filter((grade) => grade !== "");
        const totalGrades = validGrades.reduce((sum, grade) => sum + grade, 0);
        return validGrades.length > 0
            ? (totalGrades / validGrades.length).toFixed(2)
            : "";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex w-full bg-opacity-40 bg-gray-500  items-center justify-center">
            <div className="relative p-14 w-full my-6">
                <div className="border-0 rounded-lg h-auto shadow-lg p-5 pl-10 pr-10 flex flex-col w-full bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{selectedDiscipline}</h2>
                        <button className="text-red-500" onClick={onClose}>
                            Закрыть
                        </button>
                    </div>
                    <div className="overflow-auto max-h-96 flex">
                        <div className="w-3/4 overflow-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border" rowSpan="2">Студент</th>
                                        <th className="px-4 py-2 border" rowSpan="2">Модуль 1</th>
                                        <th className="px-4 py-2 border" rowSpan="2">Модуль 2</th>
                                        <th className="px-4 py-2 border" colSpan={lessons.length}>Робота у класі</th>
                                        <th className="px-4 py-2 border" colSpan={Math.max(...students.map(student => homeworks[student.id]?.length || 0))}>Домашня робота</th>
                                        <th className="px-4 py-2 border" rowSpan="2">Ср.Оц</th>
                                    </tr>
                                    <tr>
                                        {lessons.map((lesson, index) => (
                                            <th key={lesson.id} className="px-4 py-2 border">{`Lesson ${index + 1}`}</th>
                                        ))}
                                        {students.length > 0 && homeworks[students[0].id]?.map((_, index) => (
                                            <th key={index} className="px-4 py-2 border">{`HW ${index + 1}`}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id}>
                                            <td className="px-4 py-2 border">{student.firstName}</td>
                                            <td className="px-4 py-2 border"></td>
                                            <td className="px-4 py-2 border"></td>
                                            {lessons.map((lesson) => {
                                                const attendance = lesson.studentAttendances.find(
                                                    (a) => a.studentId === student.id
                                                );
                                                const grade = attendance ? attendance.grade : "";
                                                return (
                                                    <td key={lesson.id} className="px-4 py-2 border">
                                                        {grade}
                                                    </td>
                                                );
                                            })}
                                            {homeworks[student.id]?.length > 0 ? (
                                                homeworks[student.id].map((homework, index) => (
                                                    <td key={index} className="px-4 py-2 border">
                                                        {homework.grade}
                                                    </td>
                                                ))
                                            ) : (
                                                <td className="px-4 py-2 border" colSpan={Math.max(...students.map(student => homeworks[student.id]?.length || 0))}>
                                                    нет дз!
                                                </td>
                                            )}
                                            <td className="px-4 py-2 border">
                                                {calculateAverageGrade(
                                                    lessons.map((lesson) => {
                                                        const attendance = lesson.studentAttendances.find(
                                                            (a) => a.studentId === student.id
                                                        );
                                                        return attendance ? attendance.grade : "";
                                                    }).concat(
                                                        homeworks[student.id] ? homeworks[student.id].map(homework => homework.grade) : []
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {error && <div className="text-red-500 mt-4">{error}</div>}
                </div>
            </div>
        </div>
    );
}

export default ExcelReportModal;
