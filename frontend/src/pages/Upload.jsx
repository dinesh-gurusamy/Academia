import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/config';
import { FaCloudUploadAlt } from 'react-icons/fa';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    subjectCode: '',
    examType: '',
    file: null,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to upload resources.');
      setLoading(false);
      return;
    }

    const { title, year, subjectCode, examType, file } = formData;
    if (!title || !year || !subjectCode || !examType || !file) {
      setError('All fields are required.');
      setLoading(false);
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

      setMessage(response.data.message || 'Resource uploaded successfully!');
      setFormData({ title: '', year: '', subjectCode: '', examType: '', file: null });
      setShowExamTypeSuggestions(false);
      setShowYearSuggestions(false);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while uploading the resource.');
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = (field, value) => {
    setFormData({ ...formData, [field]: value });
    field === 'examType' ? setShowExamTypeSuggestions(false) : setShowYearSuggestions(false);
  };

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-orange-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600 font-medium">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between text-gray-800">
      {/* Header */}
      <section className="text-center py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-orange-500">
            <FaCloudUploadAlt className="inline-block mr-2" />
            Upload a Resource
          </h2>
          <p className="text-md text-gray-600 mb-6">
            Share your academic materials with the community.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="flex justify-center px-4">
        <div className="max-w-2xl w-full bg-gray-50 shadow-lg rounded-xl p-8 mb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Year with Suggestions */}
            <div className="relative">
              <label htmlFor="year" className="block font-semibold text-gray-700 mb-1">
                Year
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                onFocus={() => setShowYearSuggestions(true)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
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
              <label htmlFor="subjectCode" className="block font-semibold text-gray-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Exam Type with Suggestions */}
            <div className="relative">
              <label htmlFor="examType" className="block font-semibold text-gray-700 mb-1">
                Exam Type
              </label>
              <input
                type="text"
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                onFocus={() => setShowExamTypeSuggestions(true)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
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
              <label htmlFor="file" className="block font-semibold text-gray-700 mb-1">
                Upload File <FaCloudUploadAlt className="inline-block ml-1 text-orange-500" />
              </label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                required
                className="w-full py-2 border border-dashed border-gray-400 rounded-md text-sm"
              />
              {formData.file && <p className="text-sm text-gray-500 mt-1">{formData.file.name}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md transition duration-300"
            >
              <FaCloudUploadAlt className="inline-block mr-2" />
              Upload
            </button>

            {/* Message */}
            {message && (
              <p
                className={`text-center text-sm mt-3 font-medium ${
                  message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t text-center">
        <div className="text-sm text-gray-600">
          © 2025 <span className="text-orange-500 font-medium">Academia Platform</span>. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Upload;
