import React, { useState } from 'react';
import DropTeachers from '../components/schedules/DropTeachers';

const SchedulePage2 = () => {
    const initialSchedule = [
        {
            date: "Пн",
            classes: [
                { period: "1", week: "1", groups: ["Архітектура комп'ютерних систем, Ужеловський А.В. (з) (ауд. 8)", "", "", ""] },
                { period: "2", week: "1", groups: ["Основи економіки та бізнесу, Ситник О.Ю. (з) (конференц-зала)", "", "", "Чисельні методи, Панік Л.О. (з) (ауд. 8)"] },
                { period: "3", week: "1", groups: ["", "", "", ""] },
                { period: "4", week: "1", groups: ["", "", "", ""] },
            ],
        },
        {
            date: "Вт",
            classes: [
                { period: "1", week: "1", groups: ["", "Чисельні методи, Панік Л.О. (з) (ауд. 8)", "", ""] },
                { period: "2", week: "1", groups: ["", "Проектування та моделювання програмних систем, Панік Л.О. (з) (ауд. 4)", "Архітектура комп'ютерних систем, Ужеловський А.В. (з) (ауд. 8)", ""] },
                { period: "3", week: "1", groups: ["", "", "", ""] },
                { period: "4", week: "1", groups: ["", "", "", ""] },
            ],
        },
        {
            date: "Ср",
            classes: [
                { period: "1", week: "1", groups: ["Архітектура комп'ютерних систем, Ужеловський А.В. (з) (ауд. 8)", "", "", ""] },
                { period: "2", week: "1", groups: ["Основи економіки та бізнесу, Ситник О.Ю. (з) (конференц-зала)", "", "", ""] },
                { period: "3", week: "1", groups: ["", "", "", ""] },
                { period: "4", week: "1", groups: ["", "", "", ""] },
            ],
        },
        {
            date: "Чт",
            classes: [
                { period: "1", week: "1", groups: ["", "Чисельні методи, Панік Л.О. (з) (ауд. 8)", "", ""] },
                { period: "2", week: "1", groups: ["", "Проектування та моделювання програмних систем, Панік Л.О. (з) (ауд. 4)", "", ""] },
                { period: "3", week: "1", groups: ["", "", "", ""] },
                { period: "4", week: "1", groups: ["", "", "", ""] },
            ],
        }, {
            date: "Пт",
            classes: [
                { period: "1", week: "1", groups: ["Архітектура комп'ютерних систем, Ужеловський А.В. (з) (ауд. 8)", "", "", ""] },
                { period: "2", week: "1", groups: ["Основи економіки та бізнесу, Ситник О.Ю. (з) (конференц-зала)", "", "", ""] },
                { period: "3", week: "1", groups: ["", "", "", ""] },
                { period: "4", week: "1", groups: ["", "", "", ""] },
            ],
        },
        {
            date: "Сб",
            classes: [
                { period: "1", week: "1", groups: ["", "Чисельні методи, Панік Л.О. (з) (ауд. 8)", "", ""] },
                { period: "2", week: "1", groups: ["", "Проектування та моделювання програмних систем, Панік Л.О. (з) (ауд. 4)", "", ""] },
                { period: "3", week: "1", groups: ["", "", "", ""] },
                { period: "4", week: "1", groups: ["", "", "", ""] },
            ],
        },
    ];

    const [editingCell, setEditingCell] = useState({ dayIndex: null, classIndex: null, groupIndex: null, value: "" });
    const [schedule, setSchedule] = useState(initialSchedule);
    const [selectedDay, setSelectedDay] = useState(null); // Состояние для хранения выбранного дня недели
    const [confirmAddRow, setConfirmAddRow] = useState(false); // 
    const [hoveredPeriod, setHoveredPeriod] = useState({ dayIndex: null, classIndex: null });

    const handleCellClick = (dayIndex, classIndex, groupIndex, value) => {
        setEditingCell({ dayIndex, classIndex, groupIndex, value });
    };

    const handleModalChange = (e) => {
        setEditingCell({ ...editingCell, value: e.target.value });
    };

    const handleModalSave = () => {
        const newSchedule = [...schedule];
        newSchedule[editingCell.dayIndex].classes[editingCell.classIndex].groups[editingCell.groupIndex] = editingCell.value;
        setSchedule(newSchedule);
        setEditingCell({ dayIndex: null, classIndex: null, groupIndex: null, value: "" });
    };

    const handleModalClose = () => {
        setEditingCell({ dayIndex: null, classIndex: null, groupIndex: null, value: "" });
    };

    const handleDayClick = (dayIndex) => {
        setSelectedDay(dayIndex);
        setConfirmAddRow(true); // Показать диалоговое окно для подтверждения добавления строки
    };

    const handleAddRow = () => {
        const newSchedule = [...schedule];
        newSchedule[selectedDay].classes.push({ period: "5", week: "1", groups: ["", "", "", ""] });
        setSchedule(newSchedule);
        setConfirmAddRow(false); // Сбросить состояние подтверждения
    };

    const handlePeriodClick = (dayIndex, classIndex) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].classes.splice(classIndex, 1);
        setSchedule(newSchedule);
    };

    const handlePeriodMouseEnter = (dayIndex, classIndex) => {
        setHoveredPeriod({ dayIndex, classIndex });
    };

    const handlePeriodMouseLeave = () => {
        setHoveredPeriod({ dayIndex: null, classIndex: null });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">Дата</th>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">Пара</th>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">КН20-1</th>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">КН20-2</th>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">КН21-1</th>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">КН21-2</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((day, dayIndex) => (
                        <React.Fragment key={dayIndex}>
                            {day.classes.map((item, classIndex) => (
                                <tr key={classIndex}>
                                    {classIndex === 0 && (
                                        <td onClick={() => handleDayClick(dayIndex)} rowSpan={day.classes.length} className="py-2 px-4 border border-gray-200 cursor-pointer">
                                            {day.date}
                                        </td>
                                    )}
                                    <td
                                        className="py-2 px-4 border border-gray-200 cursor-pointer"
                                        onClick={() => handlePeriodClick(dayIndex, classIndex)}
                                        onMouseEnter={() => handlePeriodMouseEnter(dayIndex, classIndex)}
                                        onMouseLeave={handlePeriodMouseLeave}
                                    >
                                        {hoveredPeriod.dayIndex === dayIndex && hoveredPeriod.classIndex === classIndex ? '✖' : item.period}
                                    </td>
                                    {item.groups.map((group, groupIndex) => (
                                        <td
                                            key={groupIndex}
                                            className="py-2 px-4 border border-gray-200 cursor-default"
                                            onClick={() => handleCellClick(dayIndex, classIndex, groupIndex, group)}
                                        >
                                            {group}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>

            </table>

            {/* Диалоговое окно для подтверждения добавления строки */}
            {confirmAddRow && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-xl mb-4">Додати строку?</h2>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded mr-2"
                                onClick={() => setConfirmAddRow(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={handleAddRow}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно для редактирования */}
            {editingCell.dayIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 w-96 rounded shadow-lg">
                        <h2 className="text-xl mb-4">Додання / Зміна розкладу</h2>
                        <div className='pb-5'>
                            <DropTeachers />
                        </div>
                        <textarea
                            className="w-full h-32 p-2 border border-gray-300"
                            value={editingCell.value}
                            onChange={handleModalChange}
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded mr-2"
                                onClick={handleModalClose}
                            >
                                Отмена
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={handleModalSave}
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchedulePage2;
