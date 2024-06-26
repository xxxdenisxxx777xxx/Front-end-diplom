import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import TeachersDisciplineModal from "./TeachersDisciplineModal";

function InfoTeachersModal({ isOpen, onClose, teacherData }) {
    const [data, setData] = useState([]);
    const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);

    useEffect(() => {
        if (teacherData) {
            setData(teacherData);
        }
    }, [teacherData]);

    const handleDeleteTeacher = async () => {
        try {
            const response = await axios.delete(`http://77.221.152.210:5008/api/Users/${data.id}`);
            if (response.status === 200) {
                console.log("Учитель успешно удален");
                onClose();
            }
        } catch (error) {
            console.error("Ошибка при удалении учителя:", error);
        }
    };

    const handleDownloadExcel = async () => {
        try {
            const response = await axios.get('http://77.221.152.210:5008/api/Schedules');
            const decodedData = atob(response.data.items[0].file);

            const workbook = XLSX.read(decodedData, { type: 'binary' });
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'schedule.xlsx');
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    const openDisciplineModal = () => {
        setIsDisciplineModalOpen(true);
    };

    const closeDisciplineModal = () => {
        setIsDisciplineModalOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center bg-gray-500 bg-opacity-35 justify-center overflow-x-hidden overflow-y-auto w-full">
            <div className="max-w-4xl w-full flex justify-center bg-white rounded-lg pt-10 my-6">
                <div className="justify-start">
                    <div className="flex flex-col items-start bg-white rounded-lg border md:flex-row">
                        {data.photoBase64 && (
                            <img className="object-cover max-w-96 w-auto rounded-lg h-96" src={`data:image/jpeg;base64,${data.photoBase64}`} alt="" />
                        )}
                        <div className="flex flex-col justify-between text-start p-4 leading-normal">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {data.firstName + " " + data.lastName}
                            </h5>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Предмет: {data.departmentEmail}</p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Номер телефону: {data.phoneNumber}</p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Логін: {data.userName}</p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Пароль: {data.unHiddenPassword}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                            className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleDeleteTeacher}
                        >
                            Видалити вчителя
                        </button>
                        <button
                            className="bg-sky-500 text-white active:bg-sky-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleDownloadExcel}
                        >
                            Розклад .excel
                        </button>
                        <button
                            className="bg-yellow-500 text-white active:bg-yellow-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={openDisciplineModal}
                        >
                            Дісципліни
                        </button>
                        <button
                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={onClose}
                        >
                            Готово
                        </button>
                    </div>
                </div>
            </div>
            <TeachersDisciplineModal isOpen={isDisciplineModalOpen} onClose={closeDisciplineModal} teacherId={data.id} />
        </div>
    );
}

export default InfoTeachersModal;
