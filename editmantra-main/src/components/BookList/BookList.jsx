import React from 'react';
import { useGlobalContext } from '../../context.';
import Book from "../BookList/Book";
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import Footer from '../Footer';
import Header from '../Header';

//https://covers.openlibrary.org/b/id/240727-S.jpg

const BookList = () => {
  const { books, loading, resultTitle } = useGlobalContext();
  
  const booksWithCovers = books.map((singleBook) => {
    return {
      ...singleBook,
      id: (singleBook.id).replace("/works/", ""),
      cover_img: singleBook.cover_id ? `https://covers.openlibrary.org/b/id/${singleBook.cover_id}-L.jpg` : coverImg
    };
  });

  if (loading) return <Loading />;

  return (
    <section className="booklist bg-green-200">
      <div className="flex items-center">
        <Header />
      </div>
      <div className="container mx-auto mt-4 max-w-screen-xl">
        <div className="booklist-content grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {
            booksWithCovers.slice(0, 30).map((item, index) => {
              return (
                <Book key={index} {...item} />
              );
            })
          }
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default BookList;
