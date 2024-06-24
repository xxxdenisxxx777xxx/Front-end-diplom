import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GenerateInfoStudentsModal({ isOpen, onClose }) {

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`http://77.221.152.210:5008/api/Users/GetByDepartmentId/3fa85f64-5717-4562-b3fc-2c963f66afa1`)
            .then(response => {
                setData(response.data[0]);
                console.log(response.data[0].login);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);



    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md">
                        <h2 className="text-2xl font-bold mb-4">Додати нового студента</h2>
                        <div className='gap-10 flex'>
                            <h2>ПІП: {data.name}</h2>
                            <h2>Группа: {data.accountNumber}</h2>
                            <h2>Номер телефону: {data.accountName}</h2>
                            <h2>Термін навчання: {data.amount}</h2>

                        </div>
                        <div className='pt-5'>
                            <h2>Login:{data.login}</h2>
                            <h2>Password:{data.password}</h2>
                        </div>
                        <div className="flex justify-end pt-10">

                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                onClick={onClose}
                            >
                                Готово
                            </button>
                        </div>

                    </div>

                </div>
            )}
        </>
    );
};

export default GenerateInfoStudentsModal;