
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';



function AdminPanelStep({ children }) {
    const [isAuth, setIsAuth] = useState(localStorage.getItem('authAdmin'))
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState("/home");
    const navigate = useNavigate();

    const handleTabClick = (tab) => {
        if (activeTab === tab) {
            setActiveTab(null);
        } else {
            setActiveTab(tab);
        }
    };



    const handleLogin = async () => {

        console.log("im here")
        try {
            const response = await axios.post('http://77.221.152.210:5008/api/Identity/Login', { userName: username, password: password }, { headers: { 'Content-Type': 'application/json' } });
            if (response.status === 200) {
                localStorage.setItem('authAdmin', JSON.stringify(response.data));
                setIsAuth(true);
                navigate('/itstep/university/users/admin');
                console.log(response.status);
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }

    };

    const handleSignOut = () => {
        const isAuthData = localStorage.getItem('authAdmin');
        if (isAuthData) {
            localStorage.removeItem('authAdmin');
            setIsAuth(false)
        }
    }







    return (
        <>

            {isAuth ? <>

                <header>
                    <div className='flex justify-between p-5'>
                        <p className='font-semibold text-xl p-5 '>Адмін-система для змінення паролей</p>
                        <button onClick={handleSignOut}>Вийти</button>
                    </div>
                    <div className='flex gap-5'>
                        <div>
                            <div class="text-center w-96 mt-14">
                                <div class="flex items-center justify-center">
                                    <svg fill="none" viewBox="0 0 24 24" class="w-12 h-12 text-blue-500" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 class="text-4xl tracking-tight">
                                    Зміна паролю "Навчальної частини"
                                </h2>

                            </div>
                            <div class="flex justify-center w-96 my-2 mx-4 md:mx-0">
                                <form class="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
                                    <div class="flex flex-wrap -mx-3 mb-6">
                                        <div class="w-full md:w-full px-3 mb-6">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for='Password'>Новий UserName</label>
                                            <input class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='email' required />
                                        </div>
                                        <div class="w-full md:w-full px-3 mb-6">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for='Password'>Новий пароль</label>
                                            <input class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='password' required />
                                        </div>
                                        <div class="w-full flex items-center justify-between px-3 mb-3 ">

                                        </div>
                                        <div class="w-full md:w-full px-3 mb-6">
                                            <button class="appearance-none block w-full bg-blue-600 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none focus:bg-white focus:border-gray-500">Sign in</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div>
                            <div class="text-center w-96 mt-14">
                                <div class="flex items-center justify-center">
                                    <svg fill="none" viewBox="0 0 24 24" class="w-12 h-12 text-red-500" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 class="text-4xl tracking-tight">
                                    Зміна паролю "Кафедра"

                                </h2>

                            </div>
                            <div class="flex justify-center w-96 my-2 mx-4 md:mx-0">
                                <form class="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
                                    <div class="flex flex-wrap -mx-3 mb-6">
                                        <div class="w-full md:w-full px-3 mb-6">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for='Password'>Новий UserName</label>
                                            <input class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='email' required />
                                        </div>
                                        <div class="w-full md:w-full px-3 mb-6">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for='Password'>Новий пароль</label>
                                            <input class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='password' required />
                                        </div>
                                        <div class="w-full flex items-center justify-between px-3 mb-3 ">

                                        </div>
                                        <div class="w-full md:w-full px-3 mb-6">
                                            <button class="appearance-none block w-full bg-blue-600 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none focus:bg-white focus:border-gray-500">Sign in</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div>
                            <div class="text-center w-96 mt-14">
                                <div class="flex items-center justify-center">
                                    <svg fill="none" viewBox="0 0 24 24" class="w-12 h-12 text-green-500" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 class="text-4xl tracking-tight">
                                    Зміна паролю "Навчальної частини"
                                </h2>

                            </div>
                            <div class="flex justify-center w-96 my-2 mx-4 md:mx-0">
                                <form class="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
                                    <div class="flex flex-wrap -mx-3 mb-6">
                                        <div class="w-full md:w-full px-3 mb-6">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for='Password'>Новий UserName</label>
                                            <input class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='email' required />
                                        </div>
                                        <div class="w-full md:w-full px-3 mb-6">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for='Password'>Новий пароль</label>
                                            <input class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='password' required />
                                        </div>
                                        <div class="w-full flex items-center justify-between px-3 mb-3 ">

                                        </div>
                                        <div class="w-full md:w-full px-3 mb-6">
                                            <button class="appearance-none block w-full bg-blue-600 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none focus:bg-white focus:border-gray-500">Sign in</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </header>



            </> : <div className="relative z-50">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 " aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" ></div>
                </div>
                <form className='mt-[100px]'>
                    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="flex flex-1 items-center justify-center sm:items-stretch ">
                            <div className="flex flex-shrink-0 items-center z-50">
                                <h2 className='font-bold text-2xl'>ITStep Users Admin</h2>
                            </div>

                        </div>
                        <br />
                        <br />
                        <div class="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form class="space-y-6" action="#" method="POST">
                                <div>
                                    <div class="mt-2">
                                        <input required class="block w-full h-11 rounded-md border-0 py-1.5 pl-3 placeholder:pl-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-700 sm:text-sm sm:leading-6" type="text"
                                            placeholder="Введіть username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <div class="flex items-center justify-between">
                                    </div>
                                    <div class="mt-2">
                                        <input autocomplete="current-password" required class="block w-full h-11 pl-3 placeholder:pl-0 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6" type="password"
                                            placeholder="Введіть пароль"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" class="flex w-full justify-center h-9 rounded-md bg-sky-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-950" onClick={(e) => { e.preventDefault(), handleLogin() }}>Sign in</button>
                                </div>
                            </form>
                            <p class="mt-7 text-center text-sm text-gray-500">
                            </p>
                        </div>
                    </div>

                </form>
                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-50 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-33rem)] ml-14" aria-hidden="true">
                    <div className="relative left-[calc(70%+3rem)] aspect-[1155/678] w-[90.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+35rem)] sm:w-[72.1875rem]" ></div>
                </div>
            </div>}






            {children}
        </>

    );
}

export default AdminPanelStep;
