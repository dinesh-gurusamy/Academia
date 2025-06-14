import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
      const { token, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      setMessage('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while logging in.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-20 flex items-center justify-center px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome Back!
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-user mr-2 text-orange-500"></i>User ID
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-lock mr-2 text-orange-500"></i>Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition duration-300"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>Login
          </button>

          {message && (
            <p className="text-center text-sm text-red-600 mt-2">{message}</p>
          )}
        </form>

        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-sm text-orange-500 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
