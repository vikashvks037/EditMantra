import React from 'react';
import LoaderImg from "../../images/loader.svg";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-16 flex-col">
      <img src={LoaderImg} alt="loader" className="w-32 h-32 mb-4" />
      <p className="text-xl text-gray-500 animate-pulse">Loading...</p>
    </div>
  );
}

export default Loader;
