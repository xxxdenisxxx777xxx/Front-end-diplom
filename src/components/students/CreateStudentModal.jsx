import React, { useState } from 'react';
import axios from 'axios';
import * as Papa from 'papaparse';

function CreateStudentModal({ isOpen, onClose }) {
    const [file, setFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
        setImageFileName(e.target.files[0].name);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

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

    const generateCredentials = (fullName) => {
        if (!fullName) {
            console.error('ФИО не определено или пусто');
            return { userName: '', password: '', unHiddenPassword: '' };
        }
        const firstNameParts = fullName.split(' ');
        if (firstNameParts.length < 2) {
            console.error('Неверный формат ФИО');
            return { userName: '', password: '', unHiddenPassword: '' };
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

    const handleUpload = () => {
        if (!file) {
            setMessage('Please select a file to upload');
            return;
        }

        Papa.parse(file, {
            header: true,
            delimiter: ';',
            encoding: 'cp1251',
            complete: (results) => {
                const data = results.data;
                if (data.length > 0) {
                    const id_card = data[0]['ID картки'];
                    const status_since = data[0]['Статус з'];
                    const study_status = data[0]['Статус навчання'];
                    const fo_id = data[0]['ID ФО'];
                    const student = data[0]['Здобувач'];
                    const birth_date = data[0]['Дата народження'];
                    const dpo_type = data[0]['Тип ДПО'];
                    const document_series = data[0]['Серія документа'];
                    const document_number = data[0]['Номер документа'];
                    const issue_date = data[0]['Дата видачі'];
                    const valid_until = data[0]['Дійсний до'];
                    const gender = data[0]['Стать'];
                    const citizenship = data[0]['Громадянство'];
                    const name_in_english = data[0]['ПІБ англійською'];
                    const tax_number = data[0]['РНОКПП'];
                    const study_start = data[0]['Початок навчання'];
                    const study_end = data[0]['Завершення навчання'];
                    const education_level = data[0]['Освітній ступінь (рівень)'];
                    const entry_basis = data[0]['Вступ на основі'];
                    const study_form = data[0]['Форма навчання'];
                    const funding_source = data[0]['Джерело фінансування'];
                    const previous_specialty = data[0]['Чи здобувався ступень за іншою спеціальністю'];
                    const shortened_study_period = data[0]['Чи скорочений термін навчання'];
                    const specialty = data[0]['Спеціальність'];
                    const specialization = data[0]['Спеціалізація'];
                    const op_id = data[0]['ID ОП'];
                    const educational_program = data[0]['Освітня програма'];
                    const course = data[0]['Курс'];
                    const group = data[0]['Група'];
                    const category_code = data[0]['Код категорії'];
                    const expulsion_reason = data[0]['Причина відрахування'];
                    const academic_leave_reasons = data[0]['Підстави надання академічної відпустки'];
                    const enrollment_order = data[0]['Наказ про зарахування'];
                    const education_document = data[0]['Документ про освіту'];
                    const previous_education_info = data[0]['Інформація про попереднє навчання'];
                    const academic_certificate = data[0]['Академічна довідка (освітня декларація)'];
                    const withdrawal_certificate = data[0]['Академічна довідка при відрахуванні'];
                    const student_card = data[0]['Студентський (учнівський) квиток'];
                    const issued_diploma = data[0]['Виданий диплом'];
                    const enrollment_info = data[0]['Інформація про зарахування'];
                    const entry_score = data[0]['КБ при вступі'];
                    const last_modified_time = data[0]['Час останньої зміни'];

                    const { userName, password, unHiddenPassword } = generateCredentials(student);
                    const departmentId = '3fa85f64-5717-4562-b3fc-2c963f66afa1'; // Статическое свойство

                    let photoBase64 = '';
                    if (imageFile) {
                        const reader = new FileReader();
                        reader.readAsDataURL(imageFile);
                        reader.onload = () => {
                            photoBase64 = reader.result.split(',')[1];
                            sendFormData(photoBase64, userName, password, unHiddenPassword, departmentId);
                        };
                        reader.onerror = (error) => {
                            setMessage(`Error reading image file: ${error.message}`);
                        };
                    } else {
                        sendFormData(photoBase64, userName, password, unHiddenPassword, departmentId);
                    }

                    const sendFormData = (photoBase64, userName, password, unHiddenPassword, departmentId) => {
                        const dataToSend = {
                            id_card,
                            status_since,
                            study_status,
                            fo_id,
                            student,
                            birth_date,
                            dpo_type,
                            document_series,
                            document_number,
                            issue_date,
                            valid_until,
                            gender,
                            citizenship,
                            name_in_english,
                            tax_number,
                            study_start,
                            study_end,
                            education_level,
                            entry_basis,
                            study_form,
                            funding_source,
                            previous_specialty,
                            shortened_study_period,
                            specialty,
                            specialization,
                            op_id,
                            educational_program,
                            course,
                            group,
                            category_code,
                            expulsion_reason,
                            academic_leave_reasons,
                            enrollment_order,
                            education_document,
                            previous_education_info,
                            academic_certificate,
                            withdrawal_certificate,
                            student_card,
                            issued_diploma,
                            enrollment_info,
                            entry_score,
                            last_modified_time,
                            photo: photoBase64,
                            userName,
                            password,
                            unHiddenPassword,
                            departmentId,
                            email,
                            phoneNumber
                        };
                        console.log(dataToSend)

                        axios.post('http://77.221.152.210:5008/api/Users', dataToSend, {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    setMessage('Data successfully sent to the server');
                                } else {
                                    setMessage(`Error sending data: ${response.status}`);
                                }
                            })
                            .catch(error => {
                                setMessage(`Error: ${error.message}`);
                            });
                    };
                } else {
                    setMessage('No data found in the file');
                }
            },
            error: (error) => {
                setMessage(`Error parsing file: ${error.message}`);
            }
        });
        onclose();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md relative">
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className='flex justify-between'>
                            <p className="text-2xl font-bold mb-4">Створити нового студента</p>
                        </div>
                        <div className='flex flex-col w-96'>
                            <div className='flex flex-col gap-5 p-10'>
                                <div className="relative">
                                    <label title="Click to upload" htmlFor="fileInput" className="cursor-pointer flex items-center gap-4 px-6 py-4 before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-3xl before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                                        <div className="w-max relative">
                                            <img className="w-12" src="https://www.svgrepo.com/show/485545/upload-cicle.svg" alt="file upload icon" width="512" height="512" />
                                        </div>
                                        <div className="relative">
                                            <span className="block text-base font-semibold relative text-blue-900 group-hover:text-blue-500">
                                                Студент .CSV
                                            </span>
                                            <span className="mt-0.5 block text-sm text-gray-500">Max 2 MB</span>
                                        </div>
                                    </label>
                                    <input id="fileInput" type="file" accept=".csv" hidden onChange={handleFileChange} />
                                </div>

                                <div className="relative">
                                    <label title="Click to upload" htmlFor="imageFileInput" className="cursor-pointer flex items-center gap-4 px-6 py-4 before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-3xl before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                                        <div className="w-max relative">
                                            <img className="w-12" src="https://www.svgrepo.com/show/485545/upload-cicle.svg" alt="file upload icon" width="512" height="512" />
                                        </div>
                                        <div className="relative">
                                            <span className="block text-base font-semibold relative text-blue-900 group-hover:text-blue-500">
                                                Фото студента
                                            </span>
                                            <span className="mt-0.5 block text-sm text-gray-500">Max 2 MB</span>
                                        </div>
                                    </label>
                                    <input id="imageFileInput" type="file" accept="image/*" hidden onChange={handleImageChange} />
                                </div>

                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="border border-gray-300 rounded-md px-4 py-2 mb-4"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="border border-gray-300 rounded-md px-4 py-2 mb-4"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                />
                                <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded-md ">Upload and Send</button>
                                {message && <p>{message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateStudentModal;
