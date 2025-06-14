import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/config';

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(query)
      )
    );
  };

  const updateRole = async (userId, role) => {
    try {
      await axios.put(
        `${BASE_URL}/auth/update-role/${userId}`,
        { role },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Role updated successfully');
      setUsers(users.map(user => (user._id === userId ? { ...user, role } : user)));
      setFilteredUsers(filteredUsers.map(user => (user._id === userId ? { ...user, role } : user)));
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Failed to update role');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Role Management</h1>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

        <input
          type="text"
          className="w-full px-4 py-2 mb-6 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Search by username"
          value={searchQuery}
          onChange={handleSearch}
        />

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left">User ID</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4">
                    <select
                      className="px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)}
                    >
                      <option value="user">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;

