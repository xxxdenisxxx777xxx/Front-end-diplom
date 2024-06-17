import DropCourse from '../components/groups/dropdownGroups/DropCourse';
import { PlusIcon } from '@heroicons/react/20/solid'
import GroupsCreateModal from "../components/groups/GroupsCreateModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import GroupsStudentsModal from "../components/groups/GroupsStudentsModal";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function GroupsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const { id } = useParams();
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [isOpenInfoStudent, setIsOpenInfoStudent] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [groupName, setGroupName] = useState('');

    const toggleModal = (groupId, groupName) => {
        setSelectedGroupId(groupId);
        setGroupName(groupName);
        setIsOpenInfoStudent(!isOpenInfoStudent);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateGroup = (groupName) => {
        const newGroup = { id: groups.length + 1, name: groupName };
        setGroups([...groups, newGroup]);
        closeModal();
    };

    const handleDeleteGroup = (id) => {
        const updatedGroups = groups.filter(group => group.id !== id);
        setGroups(updatedGroups);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5008/api/StudentsGroups`);
                if (Array.isArray(response.data.items)) {
                    const groupsData = response.data.items.map(item => ({ id: item.id, name: item.name }));
                    setGroups(groupsData);
                } else {
                    console.error('Response data is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <div className="p-10">
                <p className="block text-2xl pt-1 font-bold leading-6 text-gray-900">Групи</p>
                <div className="flex items-center pt-5 justify-between gap-5">
                    <div className={`flex flex-row-reverse items-stretch w-full rounded-xl overflow-hidden bg-white shadow-[0_4px_10px_rgba(0,0,0,0.03)] border border-gray-300 `}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Поиск по названию группы"
                            aria-label="Поиск по названию группы"
                            className={`peer block w-full p-3 text-gray-600 focus:outline-none focus:ring-0 appearance-none`}
                        />
                        <div className={`flex items-center pl-3 py-3 text-gray-600`}>
                            {<FaSearch size="1rem" className="text-gray-400" />}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 pt-10 lg:grid-cols-3 lg:gap-8 text-center">
                    <div className="h-64 rounded-lg bg-gray-200 flex justify-center items-center">
                        <button
                            type="button"
                            className="relative block w-full h-64 rounded-lg border-2 border-dashed bg-white p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={openModal}
                        >
                            <svg
                                className="mx-auto h-12 w-12 cursor-pointer z-50 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                                />
                            </svg>
                            <span className="mt-7 block text-sm font-semibold">Створити нову группу</span>
                        </button>
                    </div>
                    {filteredGroups.map((group) => (
                        <button onClick={() => toggleModal(group.id, group.name)} key={group.id}>
                            <div className="h-64 rounded-lg border-2 hover:border-sky-600 bg-gray-50 relative">
                                <div className="absolute inset-0 flex justify-center items-center">
                                    <div className="text-2xl text-slate-600">{group.name}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <GroupsCreateModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleCreateGroup} groupName={groupName} />
            <GroupsStudentsModal isOpen={isOpenInfoStudent} onClose={toggleModal} groupId={selectedGroupId} />
        </>
    );
}
