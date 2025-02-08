import React, { useState, useContext, useEffect, useCallback } from 'react';

// Use your backend API instead of directly calling OpenLibrary
const URL = "https://editmantra-backend.onrender.com/api/books?title=";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("the lost world");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resultTitle, setResultTitle] = useState("");

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}${searchTerm}`);
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            const data = await response.json();
            const { docs } = data;

            if (docs) {
                const newBooks = docs.slice(0, 20).map((bookSingle) => {
                    const { key, author_name, cover_i, edition_count, first_publish_year, title } = bookSingle;
                    return {
                        id: key,
                        author: author_name || "Unknown Author",
                        cover_id: cover_i || null,
                        edition_count: edition_count || 0,
                        first_publish_year: first_publish_year || "N/A",
                        title: title || "No Title Available",
                    };
                });

                setBooks(newBooks);
                setResultTitle(newBooks.length > 0 ? "Your Search Result" : "No Search Result Found!");
            } else {
                setBooks([]);
                setResultTitle("No Search Result Found!");
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            setBooks([]);
            setResultTitle("Failed to Fetch Data");
        }
        setLoading(false);
    }, [searchTerm]);

    useEffect(() => {
        fetchBooks();
    }, [searchTerm, fetchBooks]);

    return (
        <AppContext.Provider value={{
            loading, books, setSearchTerm, resultTitle, setResultTitle,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppContext, AppProvider };
