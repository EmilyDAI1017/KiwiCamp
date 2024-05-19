import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function ManageManagers() {
  const [managers, setManagers] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newManager, setNewManager] = useState({
    username: '', first_name: '', last_name: '', email: '',
    phone_num: '', gender: '', password: ''
  });

  const fetchManagers = () => {
    axios.get('http://localhost:3000/admin/manage_managers')
      .then(response => {
        setManagers(response.data);
      })
      .catch(error => console.error('Error fetching managers:', error));
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleInputChange = useCallback(
    debounce((id, name, value) => {
      setManagers(previousManagers =>
        previousManagers.map(manager =>
          manager.user_id === id ? { ...manager, [name]: value } : manager
        )
      );
    }, 300),
    []
  );

  const handleChange = (id, name, value) => {
    setManagers(previousManagers =>
      previousManagers.map(manager =>
        manager.user_id === id ? { ...manager, [name]: value } : manager
      )
    );
    handleInputChange(id, name, value);
  };

  const handleNewManagerChange = (e) => {
    const { name, value } = e.target;
    setNewManager(prevState => ({ ...prevState, [name]: value }));
  };

  const validateManager = (manager) => {
    console.log("Validating manager:", manager); // Log manager data for debugging
    if (!manager.username || !manager.first_name || !manager.last_name || !manager.email ||
      !manager.phone_num || !manager.gender) {
      alert('Please fill in all fields');
      return false;
    }

    const phoneNumPattern = /^\d{10}$/;
    if (!phoneNumPattern.test(manager.phone_num)) {
      alert('Please enter a valid phone number');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(manager.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSave = (id) => {
    setIsLoading(true);
    const manager = managers.find(manager => manager.user_id === id);
    const updatedManager = {
      ...manager,
    };

    if (!validateManager(updatedManager)) {
      setIsLoading(false);
      return;
    }

    axios.put(`http://localhost:3000/admin/manage_managers/${id}`, updatedManager)
      .then(response => {
        setIsEditing(null);
        alert('Manager profile updated successfully');
        fetchManagers();
      })
      .catch(error => {
        console.error('Error updating manager:', error);
        alert('Failed to update manager profile');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const handleAddManager = () => {
    if (!validateManager(newManager)) {
      return;
    }

    axios.post('http://localhost:3000/admin/manage_managers', newManager)
      .then(response => {
        alert("Manager added successfully");
        fetchManagers();
        setNewManager({
          username: '', first_name: '', last_name: '', email: '',
          phone_num: '', gender: '', password: ''
        });
        setShowAddForm(false);
      })
      .catch(error => {
        console.error('Error adding manager:', error);
        alert('Failed to add manager');
      });
  };

  const handleDeleteManager = (id) => {
    if (!window.confirm('Are you sure you want to delete this manager?')) {
      return;
    }

    axios.delete(`http://localhost:3000/admin/manage_managers/${id}`)
      .then(response => {
        alert("Manager deleted successfully");
        fetchManagers();
      })
      .catch(error => {
        console.error('Error deleting manager:', error);
        alert('Failed to delete manager');
      });
  };

  const filteredManagers = managers.filter(manager =>
    manager.first_name.toLowerCase().includes(searchTerm) ||
    manager.last_name.toLowerCase().includes(searchTerm) ||
    manager.username.toLowerCase().includes(searchTerm) ||
    manager.phone_num.includes(searchTerm)
  );

  const toggleEdit = (id) => {
    if (isEditing === id) {
      setIsEditing(null);
    } else {
      setIsEditing(id);
    }
  };

  return (
    <div className="main-content">
      <h1 className="text-xl font-bold mb-4">Manage Managers</h1>
      <div className="search-container my-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input rounded-md shadow-sm mt-1 w-1/3"
          placeholder="Search managers by their username/name/phone number..."
        />
        <button 
          className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={handleSearch}
        >
          Search
        </button>
        <br />
      
      <button
        className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
        onClick={() => window.history.back()}
      >
        Manage other accounts
      </button>
      </div>
      <button
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 focus:outline-none"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Hide Add Manager Form' : 'Show Add Manager Form'}
      </button>
      {showAddForm && (
        <div className="new-manager-form my-4">
          <h2 className="text-lg font-bold mb-2">Add New Manager</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newManager.username}
            onChange={handleNewManagerChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newManager.password}
            onChange={handleNewManagerChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={newManager.first_name}
            onChange={handleNewManagerChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={newManager.last_name}
            onChange={handleNewManagerChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newManager.email}
            onChange={handleNewManagerChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="phone_num"
            placeholder="Phone Number"
            value={newManager.phone_num}
            onChange={handleNewManagerChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <select
            name="gender"
            value={newManager.gender}
            onChange={handleNewManagerChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
            onClick={handleAddManager}
          >
            Add Manager
          </button>
        </div>
      )}
      <div className="manager-list mt-4">
        {filteredManagers.length === 0 ? (
          <p>No managers found</p>
        ) : (
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone Number</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredManagers.map(manager => (
                <tr key={manager.user_id}>
                  <td className="border px-4 py-2">{manager.username}</td>
                  <td className="border px-4 py-2">
                    {isEditing === manager.user_id ? (
                      <input
                        type="text"
                        value={manager.first_name}
                        onChange={(e) => handleChange(manager.user_id, 'first_name', e.target.value)}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                      />
                    ) : (
                      manager.first_name
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {isEditing === manager.user_id ? (
                      <input
                        type="text"
                        value={manager.last_name}
                        onChange={(e) => handleChange(manager.user_id, 'last_name', e.target.value)}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                      />
                    ) : (
                      manager.last_name
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {isEditing === manager.user_id ? (
                      <input
                        type="email"
                        value={manager.email}
                        onChange={(e) => handleChange(manager.user_id, 'email', e.target.value)}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                      />
                    ) : (
                      manager.email
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {isEditing === manager.user_id ? (
                      <input
                        type="text"
                        value={manager.phone_num}
                        onChange={(e) => handleChange(manager.user_id, 'phone_num', e.target.value)}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                      />
                    ) : (
                      manager.phone_num
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {isEditing === manager.user_id ? (
                      <select
                        value={manager.gender}
                        onChange={(e) => handleChange(manager.user_id, 'gender', e.target.value)}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      manager.gender
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {isEditing === manager.user_id ? (
                      <>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleSave(manager.user_id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 text-white px-2 py-1 rounded"
                          onClick={() => toggleEdit(manager.user_id)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => toggleEdit(manager.user_id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleDeleteManager(manager.user_id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageManagers;
