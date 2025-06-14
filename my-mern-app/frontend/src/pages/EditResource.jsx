import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../api/config';
import { FaEdit, FaFileUpload } from 'react-icons/fa';

const EditResource = () => {
  const { id } = useParams();
  const [resource, setResource] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/resources/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResource(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch resource.');
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', resource.title);
    formData.append('year', resource.year);
    formData.append('subjectCode', resource.subjectCode);
    formData.append('examType', resource.examType);
    if (file) formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/resources/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Resource updated successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error while updating the resource.');
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col justify-between text-gray-800">
      {/* Header */}
      <section className="text-center py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-orange-500">
            <FaEdit className="inline-block mr-2" />
            Edit Resource
          </h2>
          <p className="text-md text-gray-600 mb-6">
            Update your uploaded academic content with ease.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="flex justify-center px-4">
        <div className="max-w-2xl w-full bg-gray-50 shadow-lg rounded-xl p-8 mb-10">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={resource.title}
                onChange={(e) => setResource({ ...resource, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="block font-semibold text-gray-700 mb-1">
                Year
              </label>
              <input
                type="text"
                id="year"
                value={resource.year}
                onChange={(e) => setResource({ ...resource, year: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Subject Code */}
            <div>
              <label htmlFor="subjectCode" className="block font-semibold text-gray-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                id="subjectCode"
                value={resource.subjectCode}
                onChange={(e) => setResource({ ...resource, subjectCode: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Exam Type */}
            <div>
              <label htmlFor="examType" className="block font-semibold text-gray-700 mb-1">
                Exam Type
              </label>
              <input
                type="text"
                id="examType"
                value={resource.examType}
                onChange={(e) => setResource({ ...resource, examType: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file" className="block font-semibold text-gray-700 mb-1">
                Upload File <FaFileUpload className="inline-block ml-1 text-orange-500" />
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full py-2 border border-dashed border-gray-400 rounded-md text-sm"
              />
              {file && <p className="text-sm text-gray-500 mt-1">{file.name}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md transition duration-300"
            >
              Update Resource
            </button>

            {/* Success Message */}
            {message && <p className="text-center text-green-600 font-medium">{message}</p>}
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

export default EditResource;
