import React from 'react';
import Nav from "../Header";
import SearchForm from "../SearchForm/SearchForm";
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const Header = () => {
  return (
    <div className='holder min-h-screen flex flex-col'>
        <header className='header flex-grow'>
            <Nav />
            <div className='header-content flex flex-col justify-center items-center text-center text-white min-h-[82vh] bg-gradient-to-b from-[#8d27ae] via-[#8d27ae] to-transparent bg-cover bg-center' style={{ backgroundImage: "url('/library-img.jpg')" }}>
                <h2 className='header-title text-4xl mb-3 md:text-5xl font-bold text-white text-shadow-lg leading-snug md:leading-normal'>
                    Find Your Book of Choice
                </h2><br />
                <p className='header-text text-lg font-normal opacity-80 mt-[-1.8rem] mb-7 max-w-[900px] mx-[5%]'>
                    Whether you're a beginner or an advanced learner, explore a wide variety of books that cover
                    essential programming languages. Unlock the secrets to building beautiful,interactive websites.
                </p>
                <SearchForm />
                <Link 
                  to="book" 
                  className="nav-link text-uppercase text-lg font-semibold tracking-widest relative mt-10 flex items-center hover:underline text-white"
                >
                    Click for More Books
                    <span className="ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-1"> →</span>
                </Link>
            </div>
        </header>
        <Footer />
    </div>
  );
}

export default Header;
