import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { generateDate, months } from "./util/calendar";
import cn from "./util/cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import DropGroups from "../students/dropdownGroups/DropGroups";
import DropCourse from "../groups/dropdownGroups/DropCourse";


export default function ScheduleComponents() {
    const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const currentDate = dayjs();
    const [today, setToday] = useState(currentDate);
    const [selectDate, setSelectDate] = useState(currentDate);
    const [scheduleData, setScheduleData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5008/api/Disciplines");
                const data = await response.json();
                setScheduleData(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        fetchData();
    }, []);

    // Определите selectedDateDisciplines вне функции renderScheduleInfo
    let selectedDateDisciplines = [];
    if (scheduleData) {
        selectedDateDisciplines = scheduleData.items.filter(item =>
            item.id === selectDate.toDate().toDateString()
        );
    }

    // Функция для отображения информации о дисциплинах на выбранную дату
    const renderScheduleInfo = () => {
        // Если нет данных о рассписании, возвращаем null
        if (!scheduleData) return null;

        // Если нет дисциплин на выбранную дату, показываем сообщение
        if (selectedDateDisciplines.length === 0) {
            return (
                <div className="w-full h-96 p-10 ">
                    <h1 className="font-semibold">
                        Розклад на {selectDate.toDate().toDateString()}
                    </h1>
                    <p className="text-gray-400">Немає розкладу на сьогодні.</p>
                </div>
            );
        }
    }
    return (
        <>
            <div className="flex justify-center divide-x sm:flex-row flex-col">

                <div className="w-full p-10">
                    <div className="flex justify-between">
                        <p className="block text-2xl pt-1 font-bold leading-6 mb-7 text-gray-900">Розклад</p>
                        <button className="p-3 h-12 bg-sky-700 text-white rounded-lg">Запланувати</button>
                    </div>
                    <DropGroups />
                    <div className="flex pt-10 justify-between items-center">
                        <h1 className="select-none font-semibold">
                            {months[today.month()]}, {today.year()}
                        </h1>
                        <div className="flex gap-10 items-center">
                            <GrFormPrevious
                                className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                                onClick={() => {
                                    setToday(today.month(today.month() - 1));
                                }}
                            />
                            <h1
                                className="cursor-pointer hover:scale-105 transition-all"
                                onClick={() => {
                                    setToday(currentDate);
                                }}
                            >
                                {months[today.month()]}
                            </h1>
                            <GrFormNext
                                className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                                onClick={() => {
                                    setToday(today.month(today.month() + 1));
                                }}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-7 pt-5">
                        {days.map((day, index) => {
                            return (
                                <h1
                                    key={index}
                                    className="text-sm text-center h-14 w-18 grid place-content-center text-gray-500 select-none"
                                >
                                    {day}
                                </h1>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-7">
                        {generateDate(today.month(), today.year()).map(
                            ({ date, currentMonth, today }, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="p-2 text-center h-14 grid place-content-center text-sm border-t"
                                    >
                                        <h1
                                            className={cn(
                                                currentMonth ? "" : "text-gray-400",
                                                today ? "bg-red-600 text-white" : "",
                                                selectDate
                                                    .toDate()
                                                    .toDateString() ===
                                                    date.toDate().toDateString()
                                                    ? "bg-black text-white"
                                                    : "",
                                                "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                                            )}
                                            onClick={() => {
                                                setSelectDate(date);
                                            }}
                                        >
                                            {date.date()}
                                        </h1>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
                <div className="w-full h-96 p-10 ">
                    <h1 className="font-semibold">
                        Розклад на {selectDate.toDate().toDateString()}
                    </h1>
                    <p className="text-gray-400"> {selectedDateDisciplines.map(discipline => (
                        <li key={discipline.id}>

                            <p>{discipline.name}</p>
                            <p>{discipline.fieldOfStudy}</p>
                            <p>{discipline.description}</p>
                            {/* Вывод других данных о дисциплине */}
                        </li>

                    ))}</p>

                </div>
            </div>
        </>
    );
}
