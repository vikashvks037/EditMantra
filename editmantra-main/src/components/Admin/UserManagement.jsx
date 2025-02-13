import React, { useState, useEffect } from 'react';
import Footer from '../Footer';
import AdminHeader from './AdminHeader';
import axios from 'axios';

// Set up Axios instance with base URL for the backend
const api = axios.create({
  baseURL: 'https://editmantra-backend.onrender.com/api', // Update if required for production
});

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/users'); // Adjust endpoint if necessary
        if (response && response.data) {
          setUsers(response.data); // Ensure structure of response data is correct
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setErrorMessage('Failed to load users. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  // Open modal for editing user
  const modifyUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Save changes to user
  const saveChanges = async () => {
    if (!editingUser.email || !editingUser.role) {
      setErrorMessage('Please fill in the required fields.');
      return;
    }

    try {
      const response = await api.put(`/users/${editingUser._id}`, editingUser);
      setUsers(users.map((user) => (user._id === response.data._id ? response.data : user)));
      setIsModalOpen(false);
      setEditingUser(null);
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setErrorMessage('');
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow container mx-auto p-6">
        <section>
          <h2 className="text-3xl font-bold text-center mb-4 text-blue-800">User Details</h2>

          {errorMessage && (
            <div className="text-red-600 text-center bg-red-100 border border-red-400 p-4 rounded mb-4">
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
            </div>
          ) : (
            <div className="mb-4 overflow-x-auto shadow-lg rounded-lg bg-white">
              <table className="min-w-full border-collapse border border-gray-200 text-center">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="border border-gray-300 p-3">Name</th>
                    <th className="border border-gray-300 p-3">Username</th>
                    <th className="border border-gray-300 p-3">Email</th>
                    <th className="border border-gray-300 p-3">Role</th>
                    <th className="border border-gray-300 p-3">Stars</th>
                    <th className="border border-gray-300 p-3">Points</th>
                    <th className="border border-gray-300 p-3">Feedback</th>
                    <th className="border border-gray-300 p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 p-3">{user.name}</td>
                        <td className="border border-gray-300 p-3">{user.username}</td>
                        <td className="border border-gray-300 p-3">{user.email}</td>
                        <td className="border border-gray-300 p-3">{user.role}</td>
                        <td className="border border-gray-300 p-3">{user.stars || 0}</td>
                        <td className="border border-gray-300 p-3">{user.points || 0}</td>
                        <td className="border border-gray-300 p-3">{user.feedback || 'No Feedback'}</td>
                        <td className="border border-gray-300 p-3 space-x-2">
                          <button
                            onClick={() => modifyUser(user)}
                            className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition duration-200 ease-in-out"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200 ease-in-out"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-gray-500 p-4">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-xl font-bold mb-2">Edit User</h3>
              <form>
                <div className="mb-1">
                  <label className="block text-gray-700 font-bold mb-2">Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 font-bold mb-2">Username</label>
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 font-bold mb-2">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 font-bold mb-2">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full p-1 border border-gray-300 rounded"
                  >
                    <option value="user">User</option>
                  </select>
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 font-bold mb-2">Stars</label>
                  <input
                    type="number"
                    value={editingUser.stars || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, stars: e.target.value })}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 font-bold mb-2">Points</label>
                  <input
                    type="text"
                    value={editingUser.points || 0 }
                    onChange={(e) => setEditingUser({ ...editingUser, points: e.target.value })}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 font-bold mb-2">Feedback</label>
                  <textarea
                    value={editingUser.feedback || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, feedback: e.target.value })}
                    className="w-full p-1 border border-gray-300 rounded"
                    rows="1"
                  />
                </div>

                {errorMessage && (
                  <div className="text-red-600 text-center bg-red-100 border border-red-400 p-4 rounded mb-4">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-400 text-white p-2 rounded-lg mr-2 hover:bg-gray-500"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={saveChanges}
                    className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default UserManagement;
