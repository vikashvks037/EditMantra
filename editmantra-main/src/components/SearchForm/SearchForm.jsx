import React, { useRef, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context.';

const SearchForm = () => {
  const { setSearchTerm, setResultTitle } = useGlobalContext();
  const searchText = useRef('');
  const navigate = useNavigate();

  useEffect(() => searchText.current.focus(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let tempSearchTerm = searchText.current.value.trim();
    if ((tempSearchTerm.replace(/[^\w\s]/gi, "")).length === 0) {
      setSearchTerm("the lost world");
      setResultTitle("Please Enter Something ...");
    } else {
      setSearchTerm(searchText.current.value);
    }

    navigate("/LearningResources/book");
  };

  return (
    <div className="w-full">
      <div className="max-w-full mx-4"> {/* Added horizontal margin */}
        <div className="flex justify-center items-center">
          <form className="w-full max-w-[50%]" onSubmit={handleSubmit}> {/* Decreased width by 20% */}
            <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden ">
              {/* Input Field */}
              <input
                type="text"
                className="flex-1 py-2 px-6 text-lg text-gray-800 placeholder-gray-600 rounded-l-full focus:outline-none "
                placeholder="Search for a book..."
                ref={searchText}
              />
              {/* Search Button */}
              <button
                type="submit"
                className="bg-purple-500 text-white py-3 px-6 hover:bg-purple-600 transition duration-300 ease-in-out rounded-r-full flex items-center justify-center"
              >
                <FaSearch size={36} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
