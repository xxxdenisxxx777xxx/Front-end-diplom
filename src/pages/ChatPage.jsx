import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "http://77.221.152.210:5008/api";

const sendMessage = async (chatMessageDto) => {
    try {
        const response = await axios.post(`${baseUrl}/ChatMessage`, chatMessageDto);
        return response.data;
    } catch (error) {
        console.error("Ошибка отправки сообщения:", error);
        throw error;
    }
};



const getAllUsers = async () => {
    try {
        const response = await axios.get(`${baseUrl}/Users`);
        return response.data;
    } catch (error) {
        console.error("Ошибка получения всех пользователей:", error);
        throw error;
    }
};

const getChatHistory = async (currentUserId, otherUserId) => {
    try {
        const response = await axios.get(`${baseUrl}/Chat/history`, {
            params: {
                currentUserId: currentUserId,
                otherUserId: otherUserId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка получения истории чата:", error);
        throw error;
    }
};

const getUserChats = async (userId) => {
    try {
        const response = await axios.get(`${baseUrl}/Chat/userChats`, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка получения чатов пользователя:", error);
        throw error;
    }
};

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [currentUserId, setCurrentUserId] = useState(
        "e1dd1783-c53c-42ea-80c2-24103b1cefae"
    ); // Set your current user ID here
    const [userChats, setUserChats] = useState([]);
    const [selectedUserName, setSelectedUserName] = useState("");

    useEffect(() => {
        loadAllUsers();
        loadUserChats();
    }, []);

    useEffect(() => {
        let intervalId;
        if (selectedUserId) {
            intervalId = setInterval(() => {
                loadMessages(selectedUserId);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [selectedUserId]);

    const loadAllUsers = async () => {
        try {
            const response = await getAllUsers();
            setAllUsers(response.items);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const loadUserChats = async () => {
        try {
            const response = await getUserChats(currentUserId);
            const chats = response.items.map((chat) => {
                if (chat.receiverId === currentUserId) {
                    return {
                        ...chat,
                        receiverName: chat.senderName,
                        receiverId: chat.senderId,
                    };
                } else {
                    return {
                        ...chat,
                        senderName: chat.receiverName,
                        senderId: chat.receiverId,
                    };
                }
            });
            setUserChats(chats);
        } catch (error) {
            console.error("Error fetching user chats:", error);
        }
    };

    const searchUsers = () => {
        if (searchTerm.trim()) {
            const results = allUsers.filter((user) => {
                const name = user.firstName || user.student?.firstName || "";
                return name.toLowerCase().includes(searchTerm.toLowerCase());
            });
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const selectUser = (userId) => {
        setSelectedUserId(userId);
        const user = allUsers.find((user) => user.id === userId);
        setSelectedUserName(user ? user.firstName : "");
        setSearchTerm("");
        setSearchResults([]);
        loadMessages(userId);
    };

    const loadMessages = async (userId) => {
        try {
            const response = await getChatHistory(currentUserId, userId);
            const messages = response.items.map((message) => ({
                ...message,
                isSelf: message.senderId === currentUserId,
            }));
            setMessages(messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleMessageSend = async () => {
        if (newMessage.trim()) {
            const chatMessageDto = {
                message: newMessage,
                senderId: currentUserId,
                receiverId: selectedUserId,
                timeCreation: new Date(),
            };
            try {
                await sendMessage(chatMessageDto);
                setNewMessage("");
                loadMessages(selectedUserId);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    return (
        <>
            <div className="flex h-screen antialiased text-gray-800">
                <div className="flex flex-row h-full w-full overflow-x-hidden">
                    <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
                        <div className="flex flex-row items-center justify-center h-12 w-full">
                            <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    ></path>
                                </svg>
                            </div>
                            <div className="ml-2 font-bold text-2xl">ITSTEP чат</div>
                        </div>

                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row items-center justify-between text-xs">
                                <span className="font-bold">Активні повідомлення</span>
                                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full"></span>
                            </div>
                            <div className="relative mt-4">
                                <input
                                    type="text"
                                    placeholder="Поиск..."
                                    className="w-full h-10 pl-3 pr-10 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        searchUsers();
                                    }}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 6a4 4 0 100 8 4 4 0 000-8zM21 21l-6-6"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <ul className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                                {searchResults.map((user) => (
                                    <button
                                        key={user.id}
                                        className="flex flex-row items-center hover:bg-gray-100 rounded-xl bg-gray-100 p-2"
                                        onClick={() => selectUser(user.id)}
                                    >
                                        <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                                            {user.firstName[0]}
                                        </div>
                                        <div className="ml-2 text-sm font-semibold">
                                            {user.firstName}
                                        </div>
                                    </button>
                                ))}
                            </ul>
                            {userChats.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="font-bold">Ваші чати</h3>
                                    <ul>
                                        {userChats.map((chat) => (
                                            <li
                                                key={chat.receiverId}
                                                className="flex justify-between p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
                                                onClick={() => selectUser(chat.receiverId)}
                                            >
                                                <span>
                                                    {chat.receiverName} - {chat.message.slice(0, 20)}...
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(chat.timeCreation).toLocaleString()}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col flex-auto h-full p-6">
                        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                            <div className="flex flex-col h-full overflow-x-auto mb-4">
                                <div className="flex flex-col h-full">
                                    <div className="flex flex-col gap-y-2">
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'} mb-4`}
                                            >
                                                <div className={`flex items-center ${message.isSelf ? 'flex-row-reverse' : ''}`}>
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        {message.isSelf ? "А" : "В"}
                                                    </div>
                                                    <div className={`relative ${message.isSelf ? 'mr-3 bg-indigo-100' : 'ml-3 bg-white'} text-sm py-2 px-4 shadow rounded-xl`}>
                                                        <div>{message.message}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                                <div>
                                    <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-grow ml-4">
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button
                                            className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                                            onClick={handleMessageSend}
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <button
                                        className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                                        onClick={handleMessageSend}
                                    >
                                        <span>Send</span>
                                        <span className="ml-2">
                                            <svg
                                                className="w-4 h-4 transform rotate-45 -mt-px"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                ></path>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
