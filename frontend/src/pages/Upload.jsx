import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/config';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    subjectCode: '',
    examType: '',
    file: null,
  });

  const [message, setMessage] = useState('');
  const [showExamTypeSuggestions, setShowExamTypeSuggestions] = useState(false);
  const [showYearSuggestions, setShowYearSuggestions] = useState(false);

  const examTypeSuggestions = ['CAT-1', 'CAT-2', 'CAT-3', 'Model'];
  const currentYear = new Date().getFullYear();
  const yearSuggestions = [currentYear, currentYear - 1, currentYear - 2];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === 'examType') setShowExamTypeSuggestions(true);
    else if (name === 'year') setShowYearSuggestions(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to upload resources.');
      return;
    }

    const { title, year, subjectCode, examType, file } = formData;
    if (!title || !year || !subjectCode || !examType || !file) {
      setMessage('All fields are required.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('year', year);
    formDataToSend.append('subjectCode', subjectCode);
    formDataToSend.append('examType', examType);
    formDataToSend.append('file', file);

    try {
      const response = await axios.post(`${BASE_URL}/resources/upload`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setFormData({ title: '', year: '', subjectCode: '', examType: '', file: null });
      setShowExamTypeSuggestions(false);
      setShowYearSuggestions(false);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while uploading the resource.');
    }
  };

  const selectSuggestion = (field, value) => {
    setFormData({ ...formData, [field]: value });
    field === 'examType' ? setShowExamTypeSuggestions(false) : setShowYearSuggestions(false);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-12">
      <div className="w-full max-w 0  -inset-02xl bg-white shadow-lg rounded-xl p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-500 mb-6">
          <i className="fas fa-cloud-upload-alt mr-2" /> Upload a Resource
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Year with Suggestions */}
          <div className="relative">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              onFocus={() => setShowYearSuggestions(true)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            {showYearSuggestions && (
              <ul className="absolute bg-white border border-gray-200 rounded-md mt-1 w-full z-10">
                {yearSuggestions.map((year) => (
                  <li
                    key={year}
                    className="px-4 py-2 cursor-pointer hover:bg-orange-100 text-sm"
                    onClick={() => selectSuggestion('year', year)}
                  >
                    {year}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Subject Code */}
          <div>
            <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-700 mb-1">
              Subject Code
            </label>
            <input
              type="text"
              name="subjectCode"
              value={formData.subjectCode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Exam Type with Suggestions */}
          <div className="relative">
            <label htmlFor="examType" className="block text-sm font-medium text-gray-700 mb-1">
              Exam Type
            </label>
            <input
              type="text"
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              onFocus={() => setShowExamTypeSuggestions(true)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            {showExamTypeSuggestions && (
              <ul className="absolute bg-white border border-gray-200 rounded-md mt-1 w-full z-10">
                {examTypeSuggestions.map((type) => (
                  <li
                    key={type}
                    className="px-4 py-2 cursor-pointer hover:bg-orange-100 text-sm"
                    onClick={() => selectSuggestion('examType', type)}
                  >
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Upload File
            </label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm file:bg-orange-500 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition"
          >
            <i className="fas fa-upload mr-2" /> Upload
          </button>

          {/* Message */}
          {message && (
            <p
              className={`text-center text-sm mt-3 ${
                message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Upload;
