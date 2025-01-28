import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-3 w-full shadow-md mt-auto">
      <div className="flex flex-col items-center">
        <p className="text-sm">© {new Date().getFullYear()} EditMantra. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
