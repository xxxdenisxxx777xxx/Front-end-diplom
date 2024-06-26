import React, { useMemo, useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import CreateTeacherModal from "./CreateTeacherModal";
import InfoTeachersModal from "./InfoTeachersModal";

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

const TeachersTable = () => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenInfoTeacher, setIsModalOpenInfoTeacher] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get(`http://77.221.152.210:5008/api/Users/GetByDepartmentId/3fa85f64-5717-4562-b3fc-2c963f66afa7`)
            .then(response => {
                // Проверяем каждый элемент в полученных данных
                const newData = response.data.items.map(item => {
                    // Если departmentId равен "3fa85f64-5717-4562-b3fc-2c963f66a200", изменяем его на "NodeJS"
                    if (item.departmentId === "3fa85f64-5717-4562-b3fc-2c963f66a200") {
                        item.departmentId = "NodeJS";
                    } else if (item.departmentId === "3fa85f64-5717-4562-b3fc-2c963f66a202") {
                        item.departmentId = "КН20-2";
                    }
                    return item;
                });
                setData(newData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const filteredData = useMemo(() => {
        if (!Array.isArray(data)) {
            return []; // возвращаем пустой массив, если data не является массивом
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

    const handleCreateStudent = (studentsName) => {
        const newStudent = { id: students.length + 1, name: studentsName };
        setGroups([...students, newStudent]);
        closeModal();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModalInfoTeacher = (id) => {
        const selectedTeacher = filteredData.find(teacher => teacher.id === id);
        setSelectedTeacher(selectedTeacher);
        setIsModalOpenInfoTeacher(true)

    };

    const closeModalInfoTeacher = () => {
        setIsModalOpenInfoTeacher(false);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row mt-3  justify-between gap-2">
                <GlobalSearchFilter
                    className="w-full border mt-3 mb-3"
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                <button className="bg-sky-700 h-12 mt-3 w-14 text-2xl rounded-lg text-white" onClick={openModal}>+</button>
            </div>
            <div className="w-full min-w-[30rem] border p-4 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-3 text-start text-xs font-light uppercase">Прізвище та Ім'я</th>
                            <th className="px-3 text-start text-xs font-light uppercase">Предмет</th>
                            <th className="px-3 text-start text-xs font-light uppercase">Email</th>
                            <th className="px-3 text-start text-xs font-light uppercase">Номер</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.map((item, i) => (
                            <tr key={i} onClick={() => openModalInfoTeacher(item.id)} className="hover:bg-gray-100">
                                <td className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg">
                                    {`${item.lastName} ${item.firstName}`}
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
                                    {item.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center">
                <ul className="flex gap-2">
                    <li>
                        <button
                            onClick={() => changePage(0)}
                            disabled={currentPage === 0}
                            className={`px-3 py-1 rounded-lg ${currentPage === 0 ? "text-gray-300" : "text-sky-700 hover:bg-sky-700 hover:text-white"
                                }`}
                        >
                            <FaChevronLeft className="mt-1" />
                        </button>
                    </li>
                    {Array.from({ length: pageCount }, (_, index) => (
                        <li key={index}>
                            <button
                                onClick={() => changePage(index)}
                                className={`px-3 py-1 rounded-lg ${index === currentPage ? "bg-sky-700 text-white" : "text-sky-700 hover:bg-sky-700 hover:text-white"
                                    }`}
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
            <CreateTeacherModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleCreateStudent} />
            <InfoTeachersModal isOpen={isModalOpenInfoTeacher} onClose={closeModalInfoTeacher} teacherData={selectedTeacher} />
        </div>
    );
};

export default TeachersTable;


