import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/config';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const Dashboard = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [showYearSuggestions, setShowYearSuggestions] = useState(false);
  const [showSubjectCodeSuggestions, setShowSubjectCodeSuggestions] = useState(false);

  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const yearSuggestions = [currentYear, currentYear - 1, currentYear - 2];
  const examTypes = ['CAT-1', 'CAT-2', 'CAT-3', 'Model'];
  const subjectCodeSuggestions = ['SUB001', 'SUB002', 'SUB003'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchResources();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/resources`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedResources = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const latest16 = sortedResources.slice(0, 16);

      setResources(latest16);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred while fetching resources.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_URL}/resources/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchResources();
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert('Error deleting resource');
      }
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesYear = selectedYear ? resource.year === selectedYear : true;
    const matchesSubjectCode = selectedSubjectCode ? resource.subjectCode === selectedSubjectCode : true;
    const matchesExamType = selectedExamType ? resource.examType === selectedExamType : true;
    return matchesYear && matchesSubjectCode && matchesExamType;
  });

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setShowYearSuggestions(true);
  };

  const handleSubjectCodeChange = (e) => {
    setSelectedSubjectCode(e.target.value);
    setShowSubjectCodeSuggestions(true);
  };

  const selectYear = (year) => {
    setSelectedYear(year);
    setShowYearSuggestions(false);
  };

  const selectSubjectCode = (code) => {
    setSelectedSubjectCode(code);
    setShowSubjectCodeSuggestions(false);
  };

  // Clear Filters Function
  const handleClearFilters = () => {
    setSelectedYear('');
    setSelectedSubjectCode('');
    setSelectedExamType('');
  };

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
    <div className="min-h-screen text-gray-800 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">Welcome to Academia Dashboard</h1>
          <p className="text-lg md:text-xl text-gray-700">Access and manage educational resources efficiently.</p>
        </div>

        {/* Filters - sticky and horizontal */}
        <div className="sticky top-0 z-10  py-4 px-2">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            {/* Year Input */}
            <div className="relative w-full md:w-1/4">
              <input
                type="text"
                placeholder="Enter Year"
                value={selectedYear}
                onChange={handleYearChange}
                onFocus={() => setShowYearSuggestions(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-orange-300"
              />
              {showYearSuggestions && (
                <ul className="absolute z-10 w-full bg-white shadow-md rounded mt-1 max-h-40 overflow-y-auto">
                  {yearSuggestions.map((year) => (
                    <li
                      key={year}
                      onClick={() => selectYear(year)}
                      className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                    >
                      {year}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Subject Code Input */}
            <div className="relative w-full md:w-1/4">
              <input
                type="text"
                placeholder="Enter Subject Code"
                value={selectedSubjectCode}
                onChange={handleSubjectCodeChange}
                onFocus={() => setShowSubjectCodeSuggestions(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-orange-300"
              />
              {showSubjectCodeSuggestions && (
                <ul className="absolute z-10 w-full bg-white shadow-md rounded mt-1 max-h-40 overflow-y-auto">
                  {subjectCodeSuggestions.map((code) => (
                    <li
                      key={code}
                      onClick={() => selectSubjectCode(code)}
                      className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                    >
                      {code}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Exam Type Dropdown */}
            <div className="w-full md:w-1/4">
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-orange-300"
              >
                <option value="">Select Exam Type</option>
                {examTypes.map((examType) => (
                  <option key={examType} value={examType}>
                    {examType}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="w-full md:w-auto flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 ml-20 bg-orange-500 text-white rounded hover:bg-orange-600 transition w-full md:w-auto"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* "Available Resources" and list will always be below the filter bar */}
        <h2 className="text-center text-2xl font-semibold text-orange-500 mb-6 mt-8">
          Available Resources
        </h2>

        {filteredResources.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {filteredResources.map((resource) => {
              return (
                <li
                  key={resource._id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <h5 className="text-lg font-semibold text-orange-600 mb-1 flex items-center">
                      <FaFileAlt className="mr-2" />
                      {resource.title}
                    </h5>
                    <p className="text-sm text-gray-600">
                      Year: {resource.year}, Subject: {resource.subjectCode}, Exam Type: {resource.examType}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-start gap-2">
                    <a
                    href={resource.filePath}

                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-1 text-sm border border-orange-600 text-orange-600 rounded hover:bg-orange-600 hover:text-white transition"
                    >
                      <FaEye className="mr-1" /> View
                    </a>

                    {['admin', 'faculty'].includes(localStorage.getItem('role')) && (
                      <button
                        onClick={() => navigate(`/edit-resource/${resource._id}`)}
                        className="flex items-center px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                    )}

                    {localStorage.getItem('role') === 'admin' && (
                      <button
                        onClick={() => handleDelete(resource._id)}
                        className="flex items-center px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center text-lg text-gray-500 mt-10">
            <i className="fas fa-exclamation-circle mr-2"></i>No resources available.
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;