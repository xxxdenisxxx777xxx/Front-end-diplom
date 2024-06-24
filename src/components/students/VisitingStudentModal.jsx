import React, { useState, useEffect } from "react";
import axios from "axios";
import DropDisciplines from "../disciplines/DropDisciplines";

function VisitingStudentModal({ attendanceData, studentsId, isOpen, onClose, selected }) {
    const [attendanceList, setAttendanceList] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchAttendanceData();
            fetchLessonsData();
        }
    }, [isOpen]);

    const fetchAttendanceData = () => {
        axios.get('http://77.221.152.210:5008/api/StudentAttendances')
            .then(response => {
                setAttendanceList(response.data.items);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching attendance data:', error);
                setLoading(false);
            });
    };

    const fetchLessonsData = () => {
        axios.get('http://77.221.152.210:5008/api/Lessons')
            .then(response => {
                setLessons(response.data.items);
            })
            .catch(error => {
                console.error('Error fetching lessons data:', error);
            });
    };

    const handleTogglePresence = (attendance) => {
        const newIsPresent = !attendance.isPresent;
        axios.put(`http://77.221.152.210:5008/api/StudentAttendances/${attendance.id}`, {
            ...attendance,
            isPresent: newIsPresent
        })
            .then(response => {
                if (response.status === 200) {
                    setAttendanceList(prevList => prevList.map(item =>
                        item.id === attendance.id ? { ...item, isPresent: newIsPresent } : item
                    ));
                }
            })
            .catch(error => {
                console.error('Error updating presence:', error);
            });
    };

    const getRandomDate = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toLocaleDateString();
    };

    const getLessonName = (lessonId) => {
        const lesson = lessons.find(lesson => lesson.id === lessonId);
        return lesson ? lesson.subjectName : 'Неизвестный предмет';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center bg-gray-500 bg-opacity-50 justify-center overflow-x-hidden overflow-y-auto w-full">
            <div className="max-w-4xl w-full p-6 flex justify-center bg-white rounded-lg my-6 shadow-lg">
                <div className="justify-start w-full">
                    <h3 className="text-xl mt-4 font-semibold mb-4">Посещение студента</h3>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : (
                        <div className="overflow-y-auto max-h-96">
                            {attendanceList.map((attendance) => (
                                <div key={attendance.id} className="flex items-center justify-between p-4 border-b border-gray-200">
                                    <div>
                                        <p>{getLessonName(attendance.lessonId)}</p>
                                        <p>Присутствие на паре: {attendance.isPresent ? 'Да' : 'Нет'}</p>
                                        <p>Дата: {getRandomDate()}</p>
                                    </div>
                                    <button
                                        className={`px-4 py-2 rounded-md text-white ${attendance.isPresent ? 'bg-red-500' : 'bg-green-500'}`}
                                        onClick={() => handleTogglePresence(attendance)}
                                    >
                                        {attendance.isPresent ? 'Отметить как отсутствующего' : 'Отметить как присутствующего'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                            className="bg-emerald-500 mt-3 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={onClose}
                        >
                            Готово
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VisitingStudentModal;
