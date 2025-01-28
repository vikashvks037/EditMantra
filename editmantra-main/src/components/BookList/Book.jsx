import React from 'react';
import { Link } from 'react-router-dom';

const Book = ({ id, cover_img, title, author, edition_count, first_publish_year }) => {
  return (
    <div className="book-item p-3 m-3 bg-green-400 rounded-lg shadow-lg transition-all hover:shadow-xl">
      <div className="book-item-img mb-2" style={{ height: '230px' }}>
        <img 
          src={cover_img || "default-image-url.jpg"} 
          alt="cover" 
          className="max-w-[150px] mx-auto rounded-lg object-cover h-full w-full" 
        />
      </div>
      <div className="book-item-info text-center">
        <Link to={`/book/${id}`}>
          <div className="book-item-info-item title font-bold text-xl mb-4">
            <span className="block text-center text-gray-800">{title || "Unknown Title"}</span>
          </div>
        </Link>

        <div className="book-item-info-item author text-base mb-3">
          <span className="font-bold capitalize text-gray-600">Author: </span>
          <span className="text-gray-800">
            {Array.isArray(author) && author.length > 0 
              ? author.join(", ") 
              : "Unknown Author"}
          </span>
        </div>

        <div className="book-item-info-item edition-count text-base mb-3">
          <span className="font-bold capitalize text-gray-600">Total Editions: </span>
          <span className="text-gray-800">{edition_count || "N/A"}</span>
        </div>

        <div className="book-item-info-item publish-year opacity-80 italic text-sm">
          <span className="font-bold capitalize text-gray-600">First Publish Year: </span>
          <span className="text-gray-800">{first_publish_year || "Unknown Year"}</span>
        </div>
      </div>
    </div>
  );
};

export default Book;
