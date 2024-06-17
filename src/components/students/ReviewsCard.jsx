import { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

export function ReviewsCard({ studentIdReview }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (studentIdReview) {
                    const response = await axios.get(`http://localhost:5008/api/Reviews/ByStudent/${studentIdReview}`);
                    setReviews(response.data);
                    console.log(response.data);
                }
            } catch (error) {
                console.error("Ошибка при получении отзывов:", error);
            }
        };

        if (studentIdReview) {
            fetchReviews();
        }
    }, [studentIdReview]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy, HH:mm', { locale: uk });
    };

    return (
        <>
            {reviews.map((review, index) => (
                <Card key={index} className="mt-6 mb-5 w-full">
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            {review.discipline}
                        </Typography>
                        <Typography>
                            {review.comment}
                        </Typography>
                        <Typography>
                            {formatDate(review.date)}
                        </Typography>
                    </CardBody>
                </Card>
            ))}
        </>
    );
}
