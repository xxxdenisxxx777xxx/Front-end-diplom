import React, { useState } from 'react';

function CreateTeacherModal({ isOpen, onClose }) {
    const [teacherData, setTeacherData] = useState({
        firstName: '',
        lastName: '',
        departmentEmail: '',
        departmentId: '',
        phoneNumber: '',
        email: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const cyrillicToTranslit = (text) => {
        const cyrillicChars = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shh', 'ъ': '',
            'ы': 'y', 'ь': "'", 'э': 'e', 'ю': 'yu', 'я': 'ya',
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'YO',
            'Ж': 'ZH', 'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M',
            'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
            'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SHH'
        };

        return text.split('').map(char => cyrillicChars[char] || char).join('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacherData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const generateCredentials = (fullName) => {
        if (!fullName) {
            console.error('ФИО не определено или пусто');
            return { userName: '', password: '', unHiddenPassword: '' };
        }
        const firstNameParts = fullName.split(' ');
        if (firstNameParts.length < 2) {
            console.error('Неверный формат ФИО');
            return { userName: '', password, unHiddenPassword: '' };
        }
        let userName = '';
        firstNameParts.forEach(part => {
            if (part.length >= 2) {
                userName += cyrillicToTranslit(part.substring(0, 2).toLowerCase());
            } else {
                userName += cyrillicToTranslit(part.toLowerCase());
            }
        });
        const password = Math.random().toString(36).substring(2, 10);
        return { userName, password, unHiddenPassword: password };
    };

    const handleSubmit = async () => {
        try {
            const { firstName, lastName, departmentEmail, phoneNumber, email } = teacherData;
            const departmentId = '3fa85f64-5717-4562-b3fc-2c963f66afa7';  // Если departmentId всегда одинаковый, используйте его. Иначе, получите его из других данных
            const { userName, password, unHiddenPassword } = generateCredentials(`${firstName} ${lastName}`);

            let photoBase64 = '';
            if (imageFile) {
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = () => {
                    photoBase64 = reader.result.split(',')[1];
                    sendData(firstName, lastName, departmentEmail, phoneNumber, email, departmentId, userName, password, unHiddenPassword, photoBase64);
                };
                reader.onerror = error => {
                    console.error('Ошибка при чтении файла:', error);
                };
            } else {
                sendData(firstName, lastName, departmentEmail, phoneNumber, email, departmentId, userName, password, unHiddenPassword, photoBase64);
            }
        } catch (error) {
            console.error('Проблема с отправкой данных:', error);
        }
    };

    const sendData = async (firstName, lastName, departmentEmail, phoneNumber, email, departmentId, userName, password, unHiddenPassword, photoBase64) => {
        const dataToSend = { firstName, lastName, departmentEmail, departmentId, phoneNumber, userName, password, email, unHiddenPassword, photo: photoBase64 };

        const response = await fetch('http://77.221.152.210:5008/api/Users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            throw new Error('Сетевая ошибка');
        }

        setTeacherData({
            firstName: '',
            lastName: '',
            departmentEmail: '',
            departmentId: '',
            phoneNumber: '',
            email: ''
        });
        setImageFile(null);
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md">
                        <h2 className="text-2xl font-bold mb-4">Створити вчителя</h2>
                        <div className='gap-10'>
                            <input
                                type="text"
                                placeholder="ім'я"
                                className="border border-gray-300 rounded-md px-4 py-2 mb-4"
                                name="firstName"
                                value={teacherData.firstName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                placeholder="Прізвище"
                                className="border border-gray-300 rounded-md px-4 py-2 mb-4"
                                name="lastName"
                                value={teacherData.lastName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                placeholder="Номер телефона"
                                className="border border-gray-300 rounded-md px-4 py-2 mb-4"
                                name="phoneNumber"
                                value={teacherData.phoneNumber}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                placeholder="email"
                                className="border border-gray-300 rounded-md px-4 py-2 mb-4"
                                name="email"
                                value={teacherData.email}
                                onChange={handleChange}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className="border border-gray-300 rounded-md px-4 py-2 mb-4"
                                onChange={handleImageChange}
                            />
                            <select
                                className="border border-gray-300 rounded-md px-4 py-2 mb-4"
                                name="departmentEmail"
                                value={teacherData.departmentEmail}
                                onChange={handleChange}
                            >
                                <option value="">Оберіть дисципліну</option>
                                <option value="C#">С#</option>
                                <option value="Node.js">Node.js</option>
                                <option value="C++">C++</option>
                                <option value="C">C</option>
                                <option value="React">React</option>
                                <option value="React Native">React Native</option>
                                <option value="Flutter">Flutter</option>
                                <option value="PHP">PHP</option>
                                <option value="HTML/CSS">HTML/CSS</option>
                                <option value="Python">Python</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={handleSubmit}
                            >
                                Створити
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                onClick={onClose}
                            >
                                Скасувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateTeacherModal;
