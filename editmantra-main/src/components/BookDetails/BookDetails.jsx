import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import { FaArrowLeft } from "react-icons/fa";

// Use backend API for secure OpenLibrary proxy
const BACKEND_URL = "https://editmantra-backend.onrender.com/api/book/";

const BookDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getBookDetails = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch book details: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("Fetched book data:", data);

                if (data) {
                    const { description, title, covers, subject_places, subject_times, subjects } = data;

                    const newBook = {
                        title: title || "No Title Available",
                        description: typeof description === "string" ? description : description?.value || "No description found",
                        cover_img: covers ? `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg` : coverImg,
                        subject_places: subject_places?.join(", ") || "No subject places found",
                        subject_times: subject_times?.join(", ") || "No subject times found",
                        subjects: subjects?.join(", ") || "No subjects found"
                    };

                    setBook(newBook);
                    setError(null);
                } else {
                    setBook(null);
                    setError("No book details found.");
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
                setBook(null);
                setError(error.message);
            }
            setLoading(false);
        };

        getBookDetails();
    }, [id]);

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500 text-center py-5">{error}</div>;

    return (
        <section className="py-5 bg-white">
            <div className="container mx-auto">
                <button
                    type="button"
                    className="flex items-center mb-4 text-lg font-semibold transition duration-300 hover:text-purple-600"
                    onClick={() => navigate("/LearningResources/book")}
                >
                    <FaArrowLeft size={22} />
                    <span className="ml-4">Go Back</span>
                </button>

                <div className="grid gap-16 md:grid-cols-2">
                    <div className="max-h-[550px] rounded-lg overflow-hidden">
                        <img
                            src={book?.cover_img}
                            alt="Cover"
                            className="w-full h-full object-cover mx-auto"
                        />
                    </div>

                    <div className="overflow-y-scroll max-h-[600px] p-6">
                        <div className="mb-4 text-3xl font-semibold">{book?.title}</div>
                        <div className="mb-4 opacity-80">{book?.description}</div>
                        <div className="mb-4">
                            <span className="font-semibold">Subject Places: </span>
                            <span className="italic">{book?.subject_places}</span>
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Subject Times: </span>
                            <span className="italic">{book?.subject_times}</span>
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Subjects: </span>
                            <span>{book?.subjects}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookDetails;
