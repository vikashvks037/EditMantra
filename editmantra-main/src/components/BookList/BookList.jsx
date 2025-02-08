import React from 'react';
import { useGlobalContext } from '../../context.';
import Book from "../BookList/Book";
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import Footer from '../Footer';
import Header from '../Header';

const BookList = () => {
  const { books, loading, resultTitle } = useGlobalContext();

  if (loading) return <Loading />;

  const booksWithCovers = books.map((book) => ({
    ...book,
    id: book.id?.replace("/works/", ""),
    cover_img: book.cover_id
      ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
      : coverImg
  }));

  return (
    <main className="booklist bg-green-200 min-h-screen">
      <Header />
      <div className="container mx-auto mt-4 max-w-screen-xl">
        <h2 className="text-2xl font-semibold text-center my-4">{resultTitle}</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {booksWithCovers.slice(0, 30).map((book) => (
            <Book key={book.id} {...book} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default BookList;
