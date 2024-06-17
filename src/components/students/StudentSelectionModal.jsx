import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const StudentSelectionModal = ({ isOpen, onClose, onSelectStudents, groupName }) => {
    console.log(groupName)
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:5008/api/Users/GetByDepartmentId/3fa85f64-5717-4562-b3fc-2c963f66afa1')
                .then(response => {
                    setStudents(response.data.items);
                })
                .catch(error => {
                    console.error('Error fetching students:', error);
                });
        }
    }, [isOpen]);

    const filteredStudents = useMemo(() => {
        return students.filter((student) =>
            student.firstName.toLowerCase().includes(globalFilter.toLowerCase()) ||
            student.lastName.toLowerCase().includes(globalFilter.toLowerCase()) ||
            student.email.toLowerCase().includes(globalFilter.toLowerCase())
        );
    }, [students, globalFilter]);

    const handleStudentSelection = (student) => {
        setSelectedStudents((prevSelected) => {
            if (prevSelected.includes(student)) {
                return prevSelected.filter(s => s !== student);
            } else {
                return [...prevSelected, student];
            }
        });
    };

    const updateStudentDepartmentEmail = async (student) => {
        console.log(groupName)
        const updatedStudent = { ...student, departmentEmail: groupName };

        try {
            await axios.put(`http://localhost:5008/api/Users`, updatedStudent, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleSubmit = async () => {
        const promises = selectedStudents.map(student => updateStudentDepartmentEmail(student));
        await Promise.all(promises);
        onSelectStudents(selectedStudents.map(student => ({
            ...student,
            departmentEmail: groupName,

        })));
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md w-3/4">
                        <h2 className="text-2xl font-bold mb-4">Виберіть учнів</h2>
                        <input
                            type="text"
                            placeholder="Пошук"
                            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                        <div className="max-h-96 overflow-y-auto">
                            {filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className={`p-2 cursor-pointer ${selectedStudents.includes(student) ? 'bg-blue-100' : 'bg-white'}`}
                                    onClick={() => handleStudentSelection(student)}
                                >
                                    {student.lastName} {student.firstName} ({student.email})
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-5 mt-4">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                onClick={onClose}
                            >
                                Скасувати
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md"
                                onClick={handleSubmit}
                            >
                                Вибрати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentSelectionModal;
