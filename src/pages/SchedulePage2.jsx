import React, { useState, useEffect } from "react";
import axios from "axios";

const SchedulePage2 = () => {
    const [schedule, setSchedule] = useState([]); // Хранение расписания для всех учителей
    const [teachers, setTeachers] = useState([]); // Состояние для хранения учителей
    const [disciplines, setDisciplines] = useState([]); // Состояние для хранения дисциплин
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedDiscipline, setSelectedDiscipline] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    useEffect(() => {
        const fetchTeachersAndSchedules = async () => {
            try {
                const response = await axios.get(
                    "http://77.221.152.210:5008/api/Users/GetByDepartmentId/3fa85f64-5717-4562-b3fc-2c963f66afa7"
                );
                const teachers = response.data.items;
                setTeachers(teachers);

                const schedulesPromises = teachers.map((teacher) =>
                    axios.get(
                        `http://77.221.152.210:5008/api/schedules/teacher-schedule`,
                        {
                            params: {
                                fileName: "06.2024",
                                teacherId: teacher.id,
                            },
                        }
                    )
                );

                const schedulesResponses = await Promise.all(schedulesPromises);
                const schedulesData = schedulesResponses.flatMap((res, index) =>
                    res.data.map((lesson) => ({
                        ...lesson,
                        teacherName:
                            teachers[index].firstName + " " + teachers[index].lastName,
                    }))
                );

                schedulesData.sort((a, b) => new Date(a.date) - new Date(b.date));
                setSchedule(schedulesData);
                console.log("Fetched schedules data:", schedulesData);
            } catch (error) {
                console.error("Ошибка получения учителей и расписания:", error);
            }
        };

        fetchTeachersAndSchedules();
    }, []);

    const transformScheduleData = (data) => {
        const transformedData = {};

        data.forEach((item) => {
            const date = new Date(item.date).toISOString().split("T")[0];
            const time = new Date(item.date).toLocaleTimeString("uk-UA", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const group = item.groupName;

            if (!transformedData[date]) {
                transformedData[date] = {};
            }
            if (!transformedData[date][time]) {
                transformedData[date][time] = {};
            }
            if (!transformedData[date][time][group]) {
                transformedData[date][time][group] = [];
            }
            transformedData[date][time][group].push({
                teacher: item.teacher,
                discipline: item.description,
            });
        });

        const result = Object.keys(transformedData)
            .map((date) => ({
                date,
                classes: Object.keys(transformedData[date])
                    .map((time) => ({
                        time,
                        groups: transformedData[date][time],
                    }))
                    .sort((a, b) => a.time.localeCompare(b.time)), // сортируем по времени
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Сортировка дней по дате

        return result;
    };

    const combinedSchedule = transformScheduleData(schedule);

    const handleEmptyCellClick = async (date, time, groupName) => {
        setSelectedCell({ date, time, groupName });
        if (selectedTeacher) {
            try {
                const response = await axios.get(
                    `http://77.221.152.210:5008/api/Disciplines/GetByUserId/${selectedTeacher}`
                );
                setDisciplines(response.data.items || []);
                setModalOpen(true);
            } catch (error) {
                console.error("Ошибка получения дисциплин:", error);
            }
        } else {
            setModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedCell(null);
        setSelectedTeacher("");
        setSelectedDiscipline("");
        setSelectedDate("");
        setSelectedTime("");
    };

    const handleSubmit = async () => {
        if (
            (selectedCell || (selectedDate && selectedTime)) &&
            selectedTeacher &&
            selectedDiscipline
        ) {
            const date = selectedCell ? selectedCell.date : selectedDate;
            const time = selectedCell ? selectedCell.time : selectedTime;
            const groupName = selectedCell ? selectedCell.groupName : "";

            const teacher = teachers.find((t) => t.id === selectedTeacher);
            const discipline = disciplines.find((d) => d.id === selectedDiscipline);

            const requestBody = {
                teacherId: selectedTeacher,
                date: new Date(`${date}T${time}:00.000Z`),
                lesson: "lesson 6",
                teacher: teacher ? teacher.firstName + " " + teacher.lastName : "",
                description: discipline ? discipline.name : "",
                groupName,
                lessonId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                studentGroupId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                disciplineId: selectedDiscipline,
            };

            try {
                await axios.post(
                    "http://77.221.152.210:5008/api/Schedules/add-lesson?fileName=06.2024",
                    requestBody
                );
                handleModalClose();
                // Перезагрузка расписания
                const response = await axios.get(
                    "http://77.221.152.210:5008/api/Users/GetByDepartmentId/3fa85f64-5717-4562-b3fc-2c963f66afa7"
                );
                const teachers = response.data.items;
                setTeachers(teachers);

                const schedulesPromises = teachers.map((teacher) =>
                    axios.get(
                        `http://77.221.152.210:5008/api/schedules/teacher-schedule`,
                        {
                            params: {
                                fileName: "06.2024",
                                teacherId: teacher.id,
                            },
                        }
                    )
                );

                const schedulesResponses = await Promise.all(schedulesPromises);
                const schedulesData = schedulesResponses.flatMap((res, index) =>
                    res.data.map((lesson) => ({
                        ...lesson,
                        teacherName:
                            teachers[index].firstName + " " + teachers[index].lastName,
                    }))
                );

                schedulesData.sort((a, b) => new Date(a.date) - new Date(b.date));
                setSchedule(schedulesData);
                console.log("Fetched schedules data:", schedulesData);
            } catch (error) {
                console.error("Ошибка отправки данных:", error);
            }
        }
    };

    const handleTeacherChange = async (e) => {
        const teacherId = e.target.value;
        setSelectedTeacher(teacherId);

        if (teacherId) {
            try {
                const response = await axios.get(
                    `http://77.221.152.210:5008/api/Disciplines/GetByUserId/${teacherId}`
                );
                setDisciplines(response.data.items || []);
            } catch (error) {
                console.error("Ошибка получения дисциплин:", error);
            }
        } else {
            setDisciplines([]);
        }
    };

    const handleAddLessonClick = () => {
        setSelectedCell(null);
        setModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">
                            Дата
                        </th>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">
                            Время
                        </th>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">
                            КН20-1
                        </th>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">
                            КН20-2
                        </th>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">
                            КН21-1
                        </th>
                        <th className="py-2 px-4 border border-gray-200 bg-gray-50">
                            КН21-2
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {combinedSchedule.map((day, dayIndex) => (
                        <React.Fragment key={dayIndex}>
                            {day.classes.map((timeSlot, classIndex) => (
                                <tr key={`${dayIndex}-${classIndex}`}>
                                    {classIndex === 0 && (
                                        <td
                                            rowSpan={day.classes.length}
                                            className="py-2 px-4 border border-gray-200"
                                        >
                                            {day.date}
                                        </td>
                                    )}
                                    <td className="py-2 px-4 border border-gray-200">
                                        {timeSlot.time}
                                    </td>
                                    {["КН20-1", "КН20-2", "КН21-1", "КН21-2"].map(
                                        (groupName, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="py-2 px-4 border border-gray-200"
                                                onClick={() =>
                                                    !timeSlot.groups[groupName] &&
                                                    handleEmptyCellClick(
                                                        day.date,
                                                        timeSlot.time,
                                                        groupName
                                                    )
                                                }
                                            >
                                                {timeSlot.groups[groupName] ? (
                                                    timeSlot.groups[groupName].map(
                                                        (lesson, lessonIndex) => (
                                                            <div
                                                                key={lessonIndex}
                                                                className="p-2 mb-2 border border-gray-300 rounded"
                                                            >
                                                                <div>Учитель: {lesson.teacher}</div>
                                                                <div>Дисциплина: {lesson.discipline}</div>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div className="p-2 mb-2 border border-gray-300 rounded">
                                                        <div>Пусто</div>
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    )}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                onClick={handleAddLessonClick}
            >
                Додати дату
            </button>
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-lg font-bold mb-4">
                            {selectedCell ? "Добавить пару" : "Добавить урок"}
                        </h2>
                        <div className="mb-4">
                            <label className="block mb-2">Учитель</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded"
                                value={selectedTeacher}
                                onChange={handleTeacherChange}
                            >
                                <option value="">Выберите учителя</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.firstName} {teacher.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {!selectedCell && (
                            <>
                                <div className="mb-4">
                                    <label className="block mb-2">Дата</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Время</label>
                                    <input
                                        type="time"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        <div className="mb-4">
                            <label className="block mb-2">Дисциплина</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded"
                                value={selectedDiscipline}
                                onChange={(e) => setSelectedDiscipline(e.target.value)}
                            >
                                <option value="">Выберите дисциплину</option>
                                {Array.isArray(disciplines) &&
                                    disciplines.map((discipline) => (
                                        <option key={discipline.id} value={discipline.id}>
                                            {discipline.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                onClick={handleModalClose}
                            >
                                Отмена
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleSubmit}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchedulePage2;

