import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";

import { useState, useEffect } from "react";
import OpenAI from "openai";


const openai = new OpenAI({ apiKey: 'sk-proj-WI4bKCap3fb9dqEj6K6KT3BlbkFJLNaLp3nY4sobAPT0Mguq', dangerouslyAllowBrowser: true });


export function NewsCard() {

    const [news, setNews] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [rephrasedText, setRephrasedText] = useState('');

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await fetch(`http://77.221.152.210:5008/api/News`);
                const data = await response.json();
                setNews(data.items);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        }

        fetchNews();
    }, []);

    const deleteNews = async (newsId) => {
        try {
            await fetch(`http://77.221.152.210:5008/api/News/${newsId}`, {
                method: 'DELETE',
            });
            setNews(news.filter(item => item.id !== newsId));
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    };

    const addNews = async () => {
        try {
            console.log(formData.description);
            const currentDate = new Date();
            const utcDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds()));
            const response = await fetch(`http://77.221.152.210:5008/api/News`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: utcDate.toISOString(),
                    description: formData.description,
                }),
            });
        } catch (error) {
            console.error('Ошибка при добавлении новости:', error);
        }
    };

    const editNews = async (newsId) => {
        try {
            await fetch(`http://77.221.152.210:5008/api/News/${newsId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: new Date().toISOString(),
                    description: formData.description,
                }),
            });
            const updatedNews = news.map(item =>
                item.id === newsId ? { ...item, date: new Date().toISOString(), description: formData.description } : item
            );
            setNews(updatedNews);
            setEditMode(false);
            setFormData({
                description: '',
            });
        } catch (error) {
            console.error('Error editing news:', error);
        }
    };

    const formatDateTime = (isoDateTime) => {
        const date = new Date(isoDateTime);
        const options = { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' };
        const formattedDate = date.toLocaleDateString('uk-UA', options);
        return formattedDate.replace(',', ' в');
    };

    const handleEdit = (newsId, description) => {
        setEditingId(newsId);
        setFormData({
            description: description,
        });
        setEditMode(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const rephraseText = async () => {
        try {
            const completion = await openai.completions.create({
                engine: "text-davinci-003",
                prompt: formData.description,
                max_tokens: 100,
                model: "gpt-3.5-turbo",
                temperature: 0.7,
            });
            setRephrasedText(completion.choices[0].text.trim());
        } catch (error) {
            console.error('Error rephrasing text:', error);
        }
    };

    return (
        <>
            <div className="">
                {news ? (
                    <div className="mt-6 w-full flex justify-between">
                        <div>
                            {news.map((item, index) => (

                                <div className="border rounded-lg mb-5 shadow-md " key={index}>
                                    <CardBody className="max-h-32">
                                        {editMode && editingId === item.id ? (
                                            <>
                                                <Input
                                                    type="text"
                                                    className="rounded-md"
                                                    name="description"
                                                    placeholder="Введите текст новости"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                />
                                                <Button className="bg-sky-600 mt-10" onClick={() => editNews(item.id)}>Сохранить</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Typography variant="h5" color="blue-gray" className="mb-2">
                                                    {item.description}
                                                </Typography>
                                                <Typography>
                                                    Створено: {formatDateTime(item.date)}
                                                </Typography>
                                            </>
                                        )}
                                    </CardBody>
                                    <CardFooter className="flex gap-10 justify-between">
                                        {!editMode ? (
                                            <>
                                                <Button className="bg-sky-600 w-auto" onClick={() => handleEdit(item.id, item.description)}>Редактировать</Button>
                                                <Button className="bg-red-600 w-auto" onClick={() => deleteNews(item.id)}>Видалити</Button>
                                            </>
                                        ) : null}
                                    </CardFooter>
                                </div>
                            ))}
                        </div>
                        <div className="w-96 border rounded-lg shadow p-5 h-36">
                            {!editMode && (
                                <div>
                                    <Input
                                        type="text"
                                        className="rounded-md"
                                        name="description"
                                        placeholder="Введите текст новости"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                    <div className="pt-5 flex justify-between">
                                        <button className="pl-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" className="w-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                            </svg>
                                        </button>
                                        <Button className="bg-sky-600" onClick={addNews}>Добавить новость</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                {rephrasedText && (
                    <div className="mt-6">
                        <Card>
                            <CardBody>
                                <Typography>
                                    Перефразированный текст: {rephrasedText}
                                </Typography>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}
