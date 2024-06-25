import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentsSuccessModal from "./StudentsSuccessModal";
import ReviewsStudentsModal from "./ReviewsStudentsModal";
import VisitingStudentModal from "./VisitingStudentModal";
import { FaEdit, FaSave } from "react-icons/fa";
import EncryptionStudents from "../encryption/EncryptionStudents";
import StatementsFile from "./StatementsFile";

function InfoStudentModal({ isOpen, onClose, studentData }) {
    const [data, setData] = useState({});
    const [isEditing, setIsEditing] = useState({});
    const [isOpenStudentSuccess, setIsOpenStudentSuccess] = useState(false);
    const [isOpenStudentReviews, setIsOpenStudentReviews] = useState(false);
    const [isOpenStudentVisiting, setIsOpenStudentVisiting] = useState(false);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        if (studentData) {
            setData(studentData);
            setStudentId(studentData.id);
        }
    }, [studentData]);

    const openModal = () => {
        setIsOpenStudentSuccess(true);
    };

    const closeModal = () => {
        setIsOpenStudentSuccess(false);
    };

    const openModalReviews = () => {
        setIsOpenStudentReviews(true);
    };

    const closeModalReviews = () => {
        setIsOpenStudentReviews(false);
    };

    const openModalVisiting = () => {
        setIsOpenStudentVisiting(true);
    };

    const closeModalVisiting = () => {
        setIsOpenStudentVisiting(false);
    };

    const handleEditClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
            // обновляем photoBase64, если изменено соответствующее поле
            photoBase64: name === "photoBase64" ? value : prev.photoBase64,
        }));
    };

    const handleSave = async (field) => {
        try {
            const response = await axios.put(`http://77.221.152.210:5008/api/Users/${data.id}`, {
                ...data,
                // можно обновить photoBase64 здесь, если необходимо
            });
            if (response.status === 200) {
                console.log("Данные успешно обновлены");
                setIsEditing((prev) => ({ ...prev, [field]: false }));
            }
        } catch (error) {
            console.error("Ошибка при обновлении данных:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://77.221.152.210:5008/api/Users/${data.id}`);
            if (response.status === 200) {
                console.log("Студент успешно удален");
                onClose();
            }
        } catch (error) {
            console.error("Ошибка при удалении студента:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center bg-gray-500 bg-opacity-35 justify-center overflow-x-hidden overflow-y-auto w-full">
            <div className="max-w-4xl w-full flex justify-center bg-white rounded-lg pt-10 my-6">
                <div className="justify-start">
                    <div className="flex flex-col items-start bg-white rounded-lg border md:flex-row">
                        <img className="object-cover max-w-96 w-auto rounded-lg h-96" src={`data:image/jpeg;base64,${data.photoBase64}`} alt="" />
                        <div className="flex flex-col justify-between text-start p-4 leading-normal">
                            <div className="mb-2 flex items-center">
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {isEditing.student ? (
                                        <input
                                            type="text"
                                            name="student"
                                            value={data.student}
                                            onChange={handleInputChange}
                                            className="border rounded-md p-1"
                                        />
                                    ) : (
                                        data.student
                                    )}{" "}
                                </h5>
                            </div>
                            <div className="mb-3 flex items-center">
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    Группа: {isEditing.group ? (
                                        <input
                                            type="text"
                                            name="group"
                                            value={data.group}
                                            onChange={handleInputChange}
                                            className="border rounded-md p-1"
                                        />
                                    ) : (
                                        data.group
                                    )}
                                </p>
                                {isEditing.group ? (
                                    <button onClick={() => handleSave("group")}>

                                    </button>
                                ) : (
                                    <button onClick={() => handleEditClick("group")}>

                                    </button>
                                )}
                            </div>
                            <div className="mb-3 flex items-center">
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    Номер телефону: {isEditing.phoneNumber ? (
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={data.phoneNumber}
                                            onChange={handleInputChange}
                                            className="border rounded-md p-1"
                                        />
                                    ) : (
                                        data.phoneNumber
                                    )}
                                </p>
                                {isEditing.phoneNumber ? (
                                    <button onClick={() => handleSave("phoneNumber")}>
                                        <FaSave className="ml-2 text-inherit" />
                                    </button>
                                ) : (
                                    <button onClick={() => handleEditClick("phoneNumber")}>
                                        <FaEdit className="ml-2 text-inherit" />
                                    </button>
                                )}
                            </div>
                            <div className="mb-3 flex items-center">
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    Email: {isEditing.email ? (
                                        <input
                                            type="text"
                                            name="email"
                                            value={data.email}
                                            onChange={handleInputChange}
                                            className="border rounded-md p-1"
                                        />
                                    ) : (
                                        data.email
                                    )}
                                </p>
                                {isEditing.email ? (
                                    <button onClick={() => handleSave("email")}>
                                        <FaSave className="ml-2 text-inherit" />
                                    </button>
                                ) : (
                                    <button onClick={() => handleEditClick("email")}>
                                        <FaEdit className="ml-2 text-inherit" />
                                    </button>
                                )}
                            </div>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                Логін: {data.userName}
                            </p>
                            <p className="mb-36 font-normal text-gray-700 dark:text-gray-400">
                                Пароль: {data.unHiddenPassword}
                            </p>
                            <div className="flex gap-5">
                                <button onClick={openModal} className="p-3 h-12 bg-sky-700 text-white rounded-lg">
                                    Успішність
                                </button>
                                <button onClick={openModalReviews} className="p-3 h-12 bg-sky-700 text-white rounded-lg">
                                    Відгуки
                                </button>
                                <button onClick={openModalVisiting} className="p-3 h-12 bg-sky-700 text-white rounded-lg">
                                    Відвідування
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                            className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleDelete}
                        >
                            Видалити студента
                        </button>
                        <EncryptionStudents studentId={data.id} />

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
            <StudentsSuccessModal isOpen={isOpenStudentSuccess} onClose={closeModal} studentId={studentId} />
            <ReviewsStudentsModal isOpen={isOpenStudentReviews} onClose={closeModalReviews} studentId={studentId} />
            <StatementsFile studentId={studentId} />
            <VisitingStudentModal isOpen={isOpenStudentVisiting} onClose={closeModalVisiting} studentId={studentId} />
        </div>
    );
}

export default InfoStudentModal;
