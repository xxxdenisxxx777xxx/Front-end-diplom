import React, { useState, useEffect } from "react";
import axios from "axios";

function TeachersDisciplineModal({ teacherId, isOpen, onClose }) {
    const [currentDisciplines, setCurrentDisciplines] = useState([]);
    const [availableDisciplines, setAvailableDisciplines] = useState([]);
    const [selectedDiscipline, setSelectedDiscipline] = useState('');

    useEffect(() => {
        if (teacherId) {
            fetchCurrentDisciplines();
            fetchAvailableDisciplines();
        }
    }, [teacherId]);

    const fetchCurrentDisciplines = async () => {
        try {
            const response = await axios.get(`http://77.221.152.210:5008/api/Disciplines/GetByUserId/${teacherId}`);
            setCurrentDisciplines(response.data.items);
        } catch (error) {
            console.error('Ошибка при загрузке дисциплин учителя:', error);
        }
    };

    const fetchAvailableDisciplines = async () => {
        try {
            const response = await axios.get('http://77.221.152.210:5008/api/Disciplines');
            setAvailableDisciplines(response.data.items);
        } catch (error) {
            console.error('Ошибка при загрузке доступных дисциплин:', error);
        }
    };

    const handleAddDiscipline = async () => {
        try {
            await axios.post('http://77.221.152.210:5008/api/TeacherDisciplines/UpsertDisciplinesToTeacher', {
                teacherId,
                disciplineIds: [selectedDiscipline]
            });
            fetchCurrentDisciplines();
        } catch (error) {
            console.error('Ошибка при добавлении дисциплины учителю:', error);
        }
    };

    const handleRemoveDiscipline = async (disciplineId) => {
        try {
            await axios.delete(`http://77.221.152.210:5008/api/TeacherDisciplines/RemoveDisciplineFromTeacher`, {
                data: {
                    teacherId,
                    disciplineId
                }
            });
            fetchCurrentDisciplines();
        } catch (error) {
            console.error('Ошибка при удалении дисциплины у учителя:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center bg-gray-500 bg-opacity-50 justify-center overflow-x-hidden overflow-y-auto w-full">
            <div className="bg-white rounded-lg p-5 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Дісципліни</h2>
                <ul className="mb-4">
                    {currentDisciplines.map(discipline => (
                        <li key={discipline.id} className="flex justify-between items-center">
                            {discipline.name}
                            <button
                                className="text-inherit px-2 py-1 rounded ml-2"
                                onClick={() => handleRemoveDiscipline(discipline.id)}
                            >
                                x
                            </button>
                        </li>
                    ))}
                </ul>
                <select
                    value={selectedDiscipline}
                    onChange={(e) => setSelectedDiscipline(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                >
                    <option value="">Выберите дисциплину</option>
                    {availableDisciplines.map(discipline => (
                        <option key={discipline.id} value={discipline.id}>{discipline.name}</option>
                    ))}
                </select>
                <div className="flex justify-between pt-2 ">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                        onClick={handleAddDiscipline}
                    >
                        Добавить дисциплину
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                        onClick={onClose}
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TeachersDisciplineModal;
