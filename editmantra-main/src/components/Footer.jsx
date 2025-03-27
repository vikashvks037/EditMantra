import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white w-full shadow-md mt-auto">
      <div className="flex flex-col items-center text-center">
        <div className="flex space-x-6 mt-3 mb-3">
          <a 
            href="https://www.instagram.com/vikash_vks037" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-300 hover:text-pink-400 transition duration-300 text-sm flex items-center"
          >
            📸 Instagram
          </a>
          <a 
            href="https://www.linkedin.com/in/vikash-kumar-848734343?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-300 hover:text-blue-400 transition duration-300 text-sm flex items-center"
          >
            🔗 LinkedIn
          </a>
          <a 
            href="https://github.com/vikashvks037" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-300 hover:text-gray-500 transition duration-300 text-sm flex items-center"
          >
            🐙 GitHub
          </a>
        </div>
{/*         <p className="text-sm mb-2 flex font-semibold items-center text-gray-400 space-x-1">Developed by ❤️ <span className="font-bold "> Vikash Kumar</span> ✨</p> */}
      </div>
    </footer>
  );
}

export default Footer;
