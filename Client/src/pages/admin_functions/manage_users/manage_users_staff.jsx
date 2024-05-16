import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageStaff() {
  const [users, setUsers] = useState([]);
  const [edit, setEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ user_id: null, username: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (user) => {
    setEdit(true);
    setSelectedUser({ ...user });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3000/api/users/${selectedUser.user_id}`, selectedUser);
      setEdit(false);
      fetchUsers(); // Refresh the list after update
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {edit ? (
        <div>
          <input name="username" value={selectedUser.username} onChange={handleChange} />
          <select name="role" value={selectedUser.role} onChange={handleChange}>
            <option value="Youth">Youth</option>
            <option value="Adult Leader">Adult Leader</option>
            <option value="Group Leader">Group Leader</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEdit(false)}>Cancel</button>
        </div>
      ) : (
        users.map(user => (
          <div key={user.user_id}>
            {user.username} - {user.role}
            <button onClick={() => handleEdit(user)}>Edit</button>
          </div>
        ))
      )}
      <button class="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out" onClick={() => window.history.back()}>Back</button>
    </div>
  );
}

export default ManageStaff;
