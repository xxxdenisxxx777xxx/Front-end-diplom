import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSearch, FaChevronLeft, FaChevronRight, FaTrash, FaPlus } from "react-icons/fa";
import StudentSelectionModal from "../students/StudentSelectionModal";


const Avatar = ({ src, alt = "avatar" }) => (
    <img src={src} alt={alt} className="w-8 h-8 rounded-full object-cover" />
);

const InputGroup = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    decoration,
    className = "",
    inputClassName = "",
    decorationClassName = "",
    disabled,
}) => (
    <div className={`flex flex-row-reverse items-stretch w-full rounded-xl overflow-hidden bg-white shadow-[0_4px_10px_rgba(0,0,0,0.03)] ${className}`}>
        <input
            id={name}
            name={name}
            value={value}
            type={type}
            placeholder={label}
            aria-label={label}
            onChange={onChange}
            className={`peer block w-full p-3 text-gray-600 focus:outline-none focus:ring-0 appearance-none ${disabled ? "bg-gray-200" : ""} ${inputClassName}`}
            disabled={disabled}
        />
        <div className={`flex items-center pl-3 py-3 text-gray-600 ${disabled ? "bg-gray-200" : ""} ${decorationClassName}`}>
            {decoration}
        </div>
    </div>
);

const GlobalSearchFilter = ({ globalFilter, setGlobalFilter, className = "ml-10" }) => (
    <InputGroup
        name="search"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        label="Search"
        decoration={<FaSearch size="1rem" className="text-gray-400" />}
        className={className}
    />
);

function GroupsStudentsModal({ isOpen, onClose, groupId }) {
    console.log(groupId);

    const [globalFilter, setGlobalFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState([]);
    const [isStudentSelectionOpen, setIsStudentSelectionOpen] = useState(false);
    const itemsPerPage = 7;

    useEffect(() => {
        axios.get(`http://localhost:5008/api/StudentsGroups/${groupId}`)
            .then(response => {
                setData(response.data.item.students);
                console.log(response.data.item.students);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [groupId]);

    const filteredData = useMemo(() => {
        if (!Array.isArray(data)) {
            return [];
        }

        return data.filter((item) =>
            (item.firstName && item.firstName.toLowerCase().includes(globalFilter.toLowerCase())) ||
            (item.lastName && item.lastName.toLowerCase().includes(globalFilter.toLowerCase())) ||
            (item.email && item.email.toLowerCase().includes(globalFilter.toLowerCase()))
        );
    }, [data, globalFilter]);

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const currentPageData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const changePage = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteStudent = async (studentId) => {
        try {
            await axios.delete(`http://localhost:5008/api/Users/${studentId}`);
            setData((prevData) => prevData.filter(student => student.id !== studentId));
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Помилка: Ви намагаєтесь видалити группу зі студентами!');
        }
    };

    const handleDeleteGroup = async () => {
        try {
            // Удалить всех студентов из группы
            await fetch(`http://localhost:5008/api/AspNetUsers/deleteByGroup/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Удалить саму группу
            const response = await fetch(`http://localhost:5008/api/StudentsGroups/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '');
            }

            setData((prevData) => prevData.filter(group => group.id !== groupId)); // Обновляем локальное состояние после успешного удаления
            onClose(); // Закрываем модальное окно после успешного удаления
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);

            // Показываем сообщение об ошибке пользователю
            alert(`Помилка: Ви намагаєтесь видалити группу зі студентами! ${error.message}`);
        }
    };

    const handleAddStudents = async (selectedStudents) => {
        try {
            await axios.post(`http://localhost:5008/api/StudentsGroups/addStudents`, {
                groupId,
                studentIds: selectedStudents.map(student => student.id),
            });
            // Обновляем список студентов
            const response = await axios.get(`http://localhost:5008/api/StudentsGroups/${groupId}`);
            setData(response.data.item.students);
        } catch (error) {
            console.error('Error adding students:', error);
            alert('Ошибка при добавлении студентов в группу');
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex w-full bg-opacity-40 bg-gray-500 items-center justify-center">
            <div className="relative max-w-5xl w-full my-6">
                <div className="border-0 rounded-lg shadow-lg p-5 pl-10 pr-10 flex flex-col w-full bg-white">
                    <div className="flex flex-col gap-4 mb-14">
                        <div className="flex flex-col sm:flex-row mt-3 justify-between gap-2">
                            <GlobalSearchFilter
                                className="w-full border mt-3 mb-3"
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />

                        </div>
                        <div className="w-full min-w-[30rem] border p-4 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="px-3 text-start text-xs font-light uppercase">ПІП</th>
                                        <th className="px-3 text-start text-xs font-light uppercase">Група</th>
                                        <th className="px-3 text-start text-xs font-light uppercase">Email</th>
                                        <th className="px-3 text-start text-xs font-light uppercase">Номер телефону</th>
                                        <th className="px-3 text-start text-xs font-light uppercase">Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageData.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-100">
                                            <td className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg">
                                                {`${item.firstName} ${item.lastName}`}
                                            </td>
                                            <td className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg">
                                                {item.departmentEmail}
                                            </td>
                                            <td className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg">
                                                {item.email}
                                            </td>
                                            <td className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg">
                                                {item.phoneNumber}
                                            </td>
                                            <td className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg">
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleDeleteStudent(item.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center pt-5">
                            <ul className="flex gap-2">
                                <li>
                                    <button
                                        onClick={() => changePage(0)}
                                        disabled={currentPage === 0}
                                        className={`px-3 py-1 rounded-lg ${currentPage === 0 ? "text-gray-300" : "text-sky-700 hover:bg-sky-700 hover:text-white"}`}
                                    >
                                        <FaChevronLeft className="mt-1" />
                                    </button>
                                </li>
                                {Array.from({ length: pageCount }, (_, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => changePage(index)}
                                            className={`px-3 py-1 rounded-lg ${index === currentPage ? "bg-sky-700 text-white" : "text-sky-700 hover:bg-sky-700 hover:text-white"}`}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        onClick={() => changePage(pageCount - 1)}
                                        disabled={currentPage === pageCount - 1}
                                        className={`px-3 py-1 rounded-lg ${currentPage === pageCount - 1 ? "text-gray-300" : "text-sky-700 hover:bg-sky-700 hover:text-white"}`}
                                    >
                                        <FaChevronRight className="mt-1" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                            className="bg-red-500 z-50 text-white px-4 py-2 rounded-md"
                            onClick={handleDeleteGroup}
                        >
                            Видалити
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            onClick={() => setIsStudentSelectionOpen(true)}
                        >
                            Додати студента
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
            <StudentSelectionModal
                isOpen={isStudentSelectionOpen}
                onClose={() => setIsStudentSelectionOpen(false)}
                onSelectStudents={(selectedStudents) => {
                    handleAddStudents(selectedStudents);
                    setIsStudentSelectionOpen(false);
                }}
            />
        </div>
    );
}
export default GroupsStudentsModal;
