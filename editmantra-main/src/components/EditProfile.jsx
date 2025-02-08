import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const EditProfile = () => {
  const [formData, setFormData] = useState({name: '',email: '',username: ''});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {Axios.get('https://editmantra-backend.onrender.com/api/profile', {headers: { Authorization: `Bearer ${token}` },})
        .then((response) => {
          setFormData({name: response.data.name,email: response.data.email,username: response.data.username,});
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          if (error.response?.status === 401) {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            setError('Failed to load profile data.');
          }
        });
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {e.preventDefault();setError(null);setSuccess(null);
    Axios.put('https://editmantra-backend.onrender.com/api/profile',{ ...formData },{headers: { Authorization: `Bearer ${token}` },})
      .then((response) => {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/profile'); 
        }, 2000); // Delay redirect to show success message
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          setError('Invalid data. Please check your input.');
        } else if (error.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Failed to update profile. Please try again later.');
        }
      });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-8 text-center">Edit Profile</h1>
        {error && (<div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-6">{error}</div>)}
        {success && (<div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mb-6">{success}</div>)}

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-12">
          <div className="mb-6"><label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
            <input type="text"id="name"name="name"value={formData.name}onChange={handleInputChange}className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"required/>
          </div>
          <div className="mb-6"><label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input type="email"id="email"name="email"value={formData.email}onChange={handleInputChange}className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"required/>
          </div>
          <div className="mb-6"><label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username</label>
            <input type="text"id="username"name="username"value={formData.username}onChange={handleInputChange}className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"required/>
          </div>
          <div className="text-center"><button type="submit"className="bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-indigo-600">Save Changes</button>
          </div>
        </form>

        <div className="text-center mt-10">
          <button className="text-purple-600 font-bold hover:underline"onClick={() => navigate('/profile')}>Back to Profile</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;