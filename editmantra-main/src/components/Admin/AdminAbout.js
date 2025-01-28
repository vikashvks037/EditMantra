import React from 'react';
import AdminHeader from './AdminHeader';
import Footer from '../Footer';

const AdminAbout = () => {
  return (
    <div className='holder min-h-screen flex flex-col bg-blue-200'>
      <AdminHeader />
          <div className="max-w-5xl mx-auto mt-11 bg-cyan-100 p-6 rounded-lg shadow-lg my-4">
            <h3 className="text-4xl font-bold text-blue-700 mb-4 text-center">Our Mission</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
              At the heart of our mission is a simple goal: to empower students with the tools and resources they need
              to master programming and computer science. We are building a vibrant community that thrives on collaboration,
              hands-on coding challenges, and gamified experiences. We believe learning should be as fun as it is effective.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-justify">
              Join us and be part of a growing network of passionate learners, educators, and innovators who are shaping
              the future of tech education. Together, we will push the boundaries of what’s possible, one line of code at a time.
            </p>
          </div>

          {/* Call to Action Section */}
          <div className="max-w-3xl mx-auto text-center my-4 mt-11 px-4">
            <p className="text-2xl font-semibold text-gray-900 mb-2">
              Ready to get started?
            </p>
            <p className="text-xl text-gray-700">
              Let’s code, collaborate, and create something amazing.
            </p>
          </div>
        {/* Footer at the bottom */}
        <Footer />
    </div>
  );
};

export default AdminAbout;
