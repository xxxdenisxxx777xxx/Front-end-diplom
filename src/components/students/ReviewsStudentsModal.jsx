import { useEffect, useState } from "react";
import axios from "axios";
import DropDisciplines from "../disciplines/DropDisciplines";
import { ReviewsCard } from "./ReviewsCard";

function ReviewsStudentsModal({ isOpen, onClose, studentId }) {
    console.log(studentId)

    const [studentIdReview, setStudentIdReview] = useState(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center bg-gray-500 bg-opacity-35 justify-center overflow-x-hidden overflow-y-auto w-full">
            <div className=" max-w-4xl w-full flex justify-center bg-white rounded-lg my-6">
                <div className="justify-start w-full">
                    <p className=" p-10 h-96 items-start w-full bg-white rounded-lg md:flex-row">
                        <div className="mb-5">
                            <p className="font-semibold text-2xl">Відгуки від вчителів</p>
                        </div>
                        <div className="w-full">
                            <ReviewsCard studentIdReview={studentId} />
                        </div>
                    </p>
                    <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <p></p>
                        <button
                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={onClose}
                        >
                            Готово
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewsStudentsModal;
