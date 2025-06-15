import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../backend/public/dist/config';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, credentials);
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while registering.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      {/* Left Side - Image/Info Section */}
      <div className="hidden md:flex w-1/2 bg-orange-500 text-white items-center justify-center p-10">
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold mb-4">Join Academia</h2>
          <p className="text-lg">
            Unlock access to a world of educational resources. Start your journey today!
          </p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white shadow-lg p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                value={credentials.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition"
            >
              Register
            </button>

            {message && (
              <p className={`text-center text-sm mt-3 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-orange-500 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
