import React, { useState } from 'react';
import StudentSelectionModal from '../students/StudentSelectionModal';


function GroupsCreateModal({ isOpen, onClose, groupName }) {
    console.log(groupName)
    const [name, setName] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('1 курс');
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5008/api/StudentsGroups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, description: name, studentsIds: selectedStudentIds }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setName('');
            setSelectedCourse('1 курс');
            setSelectedStudentIds([]);
            onClose();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleOpenStudentModal = () => {
        setIsStudentModalOpen(true);
    };

    const handleCloseStudentModal = () => {
        setIsStudentModalOpen(false);
    };

    const handleSelectStudents = (students) => {
        const studentIds = students.map(student => student.id);
        setSelectedStudentIds(studentIds);
        handleCloseStudentModal();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md">
                        <h2 className="text-2xl font-bold mb-4">Створити нову групу</h2>
                        <input
                            type="text"
                            placeholder="Назва групи"
                            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="mb-4">
                            <label htmlFor="course" className="block text-sm font-medium text-gray-700">Оберіть курс:</label>
                            <select
                                id="course"
                                className="mt-1 block h-10 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option>1 курс</option>
                                <option>2 курс</option>
                                <option>3 курс</option>
                                <option>4 курс</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-5">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                onClick={onClose}
                            >
                                Скасувати
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md"
                                onClick={handleOpenStudentModal}
                            >
                                Додати учнів
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={handleSubmit}
                            >
                                Створити
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <StudentSelectionModal
                isOpen={isStudentModalOpen}
                onClose={handleCloseStudentModal}
                onSelectStudents={handleSelectStudents}
            />
        </>
    );
}

export default GroupsCreateModal;
