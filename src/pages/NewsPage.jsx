import React, { useState, useEffect } from 'react';
import { NewsCard } from '../components/news/NewsCard';

function NewsPage({ id }) {
    const [news, setNews] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
    });

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await fetch(`http://localhost:5008/api/News`);
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
            await fetch(`http://localhost:5008/api/News/${newsId}`, {
                method: 'DELETE',
            });
            setNews(news.filter(item => item.id !== newsId));
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    };

    const addNews = async () => {
        try {
            console.log(formData)
            const response = await fetch(`http://localhost:5008/api/News`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item: {
                        id: null,
                        date: "0001-01-01T00:00:00",
                        description: "string",
                    }
                }),
            });
            const data = await response.json();
            setNews([...news, data]);
            setFormData({
                description: '',
            });
        } catch (error) {
            console.error('Error adding news:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <>
            <div className="p-10">
                <div className='flex justify-between'>
                    <h2 className="text-3xl font-semibold">Новини</h2>
                    <h2 className="text-2xl font-semibold">Додання новин</h2>
                </div>
                <div className='mt-10'>
                    <NewsCard />
                </div>
            </div>
        </>
    );
}

export default NewsPage;