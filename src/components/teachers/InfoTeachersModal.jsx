import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


function InfoTeachersModal({ isOpen, onClose, teacherData }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (teacherData) {
            setData(teacherData);
        }
    }, [teacherData]);

    const handleDeleteTeacher = async () => {
        try {
            const response = await axios.delete(`http://localhost:5008/api/Users/${data.id}`);
            if (response.status === 200) {
                console.log("Студент успешно удален");
                onClose();
            }
        } catch (error) {
            console.error("Ошибка при удалении студента:", error);
        }
    };

    const handleDownloadExcel = async () => {
        try {
            const response = await axios.get('http://localhost:5008/api/Schedules');
            console.log(response.data.items[0].file)
            // Раскодирование base64 в бинарные данные
            const decodedData = atob(response.data.items[0].file);


            // Преобразование бинарных данных в формат Excel
            const workbook = XLSX.read(decodedData, { type: 'binary' });
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            // Сохранение файла Excel
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'schedule.xlsx');
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center bg-gray-500 bg-opacity-35 justify-center overflow-x-hidden overflow-y-auto w-full">
            <div className=" max-w-4xl w-full flex justify-center bg-white rounded-lg pt-10 my-6">
                <div className="justify-start">
                    <p className="flex flex-col items-start bg-white rounded-lg border md:flex-row">
                        <img className="object-cover max-w-96 w-auto rounded-lg h-96" src={`data:image/jpeg;base64,${data.photoBase64}`} alt="" />
                        <div className="flex flex-col justify-between text-start p-4 leading-normal">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{data.firstName + " " + data.lastName}</h5>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Предмет: {data.departmentEmail}</p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Номер телефону: {data.phoneNumber}</p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Логін: {data.userName}</p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Пароль: {data.unHiddenPassword}</p>
                        </div>
                    </p>
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
                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={onClose}
                        >
                            Готово
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoTeachersModal;
