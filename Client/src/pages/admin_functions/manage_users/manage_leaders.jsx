import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function ManageLeaders() {
  const [leaders, setLeaders] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentField, setCurrentField] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // State to manage form visibility
  const [newLeader, setNewLeader] = useState({
    username: '', password: '', first_name: '', last_name: '', email: '',
    phone_num: '', gender: '', dob: '', emergency_contacts_name: '',
    emergency_contacts_phone: '', role: 'Adult Leader'
  });

  const fetchLeaders = () => {
    axios.get('http://localhost:3000/admin/manage_leaders')
      .then(response => {
        setLeaders(response.data);
      })
      .catch(error => console.error('Error fetching leaders:', error));
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleInputChange = useCallback(
    debounce((id, name, value) => {
      setLeaders(previousLeaders =>
        previousLeaders.map(leader =>
          leader.user_id === id ? { ...leader, [name]: value } : leader
        )
      );
    }, 300),
    []
  );

  const handleChange = (id, name, value) => {
    setLeaders(previousLeaders =>
      previousLeaders.map(leader =>
        leader.user_id === id ? { ...leader, [name]: value } : leader
      )
    );
    handleInputChange(id, name, value);
  };

  const handleNewLeaderChange = (e) => {
    const { name, value } = e.target;
    setNewLeader(prevState => ({ ...prevState, [name]: value }));
  };

  const validateLeader = (leader) => {
    if (!leader.first_name || !leader.last_name || !leader.email || !leader.phone_num ||
      !leader.gender || !leader.dob || !leader.role) {
      alert('Please fill in all fields');
      return false;
    }

    const phoneNumPattern = /^\d{10}$/;
    if (!phoneNumPattern.test(leader.phone_num)) {
      alert('Please enter a valid phone number');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(leader.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    const today = new Date();
    const dob = new Date(leader.dob);
    if (dob >= today) {
      alert('Date of birth cannot be in the future');
      return false;
    }

    return true;
  };

  const handleSave = (id) => {
    setIsLoading(true);
    const leader = leaders.find(leader => leader.user_id === id);
    const updatedLeader = {
      ...leader,
      dob: formatDateForBackend(leader.dob)
    };

    if (!validateLeader(updatedLeader)) {
      alert('Please check your inputs!');
      setIsLoading(false);
      return;
    }

    axios.put(`http://localhost:3000/admin/manage_leaders/${id}`, updatedLeader)
      .then(response => {
        setIsEditing(null);
        alert("Leader's profile updated successfully");
        fetchLeaders();  // Fetch updated leaders list
      })
      .catch(error => {
        console.error('Error updating leader:', error);
        alert('Failed to update leader profile');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const handleAddLeader = () => {
    if (!validateLeader(newLeader)) {
      alert('Please check your inputs!');
      return;
    }

    axios.post('http://localhost:3000/admin/manage_leaders', newLeader)
      .then(response => {
        alert("Leader added successfully");
        fetchLeaders();  // Fetch updated leaders list
        setNewLeader({
          username: '', password: '', first_name: '', last_name: '', email: '',
          phone_num: '', gender: '', dob: '', emergency_contacts_name: '',
          emergency_contacts_phone: '', role: 'Adult Leader'
        });
        setShowAddForm(false); // Hide the form after adding the leader
      })
      .catch(error => {
        console.error('Error adding leader:', error);
        alert('Failed to add leader');
      });
  };

  const handleDeleteLeader = (id) => {
    if (!window.confirm('Are you sure you want to delete this leader?')) {
      return;
    }

    axios.delete(`http://localhost:3000/admin/manage_leaders/${id}`)
      .then(response => {
        alert("Leader deleted successfully");
        fetchLeaders();  // Fetch updated leaders list
      })
      .catch(error => {
        console.error('Error deleting leader:', error);
        alert('Failed to delete leader');
      });
  };

  const filteredLeaders = leaders.filter(leader => 
    leader && 
    leader.first_name && leader.last_name && leader.username && leader.phone_num &&
    (leader.first_name.toLowerCase().includes(searchTerm) ||
     leader.last_name.toLowerCase().includes(searchTerm) ||
     leader.username.toLowerCase().includes(searchTerm) ||
     leader.phone_num.includes(searchTerm))
  );

  const toggleEdit = (id) => {
    if (isEditing === id) {
      setIsEditing(null);
    } else {
      setIsEditing(id);
    }
  };

  function formatDateForBackend(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    return null;
  }

  return (
    <div className="main-content">
      <h1 className="text-xl font-bold mb-4">Manage Youth Leaders</h1>
      <div className="search-container my-4">
        <input
          type="text"
          placeholder="Search by name, username, or phone..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='form-input rounded-md shadow-sm mt-1 w-1/3 '
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
        <button className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out" onClick={() => window.history.back()}>
                    Manage other accounts
                </button>
      </div>
      <button
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 focus:outline-none"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Add later' : 'Add a Leader'}
      </button>
      {showAddForm && (
        <div className="new-leader-form my-4">
          <h2 className="text-lg font-bold mb-2">Add New Leader</h2>
          <input
            type="text"
            // name="username"
            placeholder="Username"
            value={newLeader.username}
            onChange={handleNewLeaderChange}
            className="form-input rounded-md shadow-sm mt-1 block w-50"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newLeader.password}
            onChange={handleNewLeaderChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={newLeader.first_name}
            onChange={handleNewLeaderChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={newLeader.last_name}
            onChange={handleNewLeaderChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newLeader.email}
            onChange={handleNewLeaderChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="phone_num"
            placeholder="Phone Number"
            value={newLeader.phone_num}
            onChange={handleNewLeaderChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <select
            name="gender"
            value={newLeader.gender}
            onChange={handleNewLeaderChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            name="dob"
            value={newLeader.dob}
            onChange={handleNewLeaderChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="emergency_contacts_name"
            placeholder="Emergency Contact Name"
            value={newLeader.emergency_contacts_name}
            onChange={handleNewLeaderChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="emergency_contacts_phone"
            placeholder="Emergency Contact Phone"
            value={newLeader.emergency_contacts_phone}
            onChange={handleNewLeaderChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <select
            name="role"
            value={newLeader.role}
            onChange={handleNewLeaderChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="Adult Leader">Adult Leader</option>
            <option value="Group Leader">Group Leader</option>
          </select>
          <button
            onClick={handleAddLeader}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none"
          >
            Add Leader
          </button>
        </div>
      )}
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
            <th className="px-4 py-3">User Name</th>
            <th className="px-4 py-3">First Name</th>
            <th className="px-4 py-3">Last Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone Number</th>
            <th className="px-4 py-3">Gender</th>
            <th className="px-4 py-3">DOB</th>
            <th className="px-4 py-3">Emergency Contact Name</th>
            <th className="px-4 py-3">Emergency Contact Phone</th>
            <th className="px-4 py-3">Leader Type</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaders.map(leader => (
            <tr key={leader.user_id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-3">{leader.username}</td>
              {isEditing === leader.user_id ? (
                <>
                  <EditableField type="text" name="first_name" value={leader.first_name} onChange={(name, value) => handleChange(leader.user_id, name, value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="last_name" value={leader.last_name} onChange={(name, value) => handleChange(leader.user_id, name, value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="email" name="email" value={leader.email} onChange={(name, value) => handleChange(leader.user_id, name, value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="phone_num" value={leader.phone_num} onChange={(name, value) => handleChange(leader.user_id, name, value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField
                    type="select"
                    name="gender"
                    value={leader.gender}
                    onChange={(name, value) => handleChange(leader.user_id, name, value)}
                    setCurrentField={setCurrentField}
                    currentField={currentField}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" }
                    ]}
                  />
                  <EditableField type="date" name="dob" value={formatDateForInput(leader.dob)} onChange={(name, value) => handleChange(leader.user_id, name, value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="emergency_contacts_name" value={leader.emergency_contacts_name} onChange={(name, value) => handleChange(leader.user_id, name, value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="emergency_contacts_phone" value={leader.emergency_contacts_phone} onChange={(name, value) => handleChange(leader.user_id, name, value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField
                    type="select"
                    name="role"
                    value={leader.role}
                    onChange={(name, value) => handleChange(leader.user_id, name, value)}
                    setCurrentField={setCurrentField}
                    currentField={currentField}
                    options={[
                      { value: "Adult Leader", label: "Adult Leader" },
                      { value: "Group Leader", label: "Group Leader" }
                    ]}
                  />
                </>
              ) : (
                <>
                  <td>{leader.first_name}</td>
                  <td>{leader.last_name}</td>
                  <td>{leader.email}</td>
                  <td>{leader.phone_num}</td>
                  <td>{leader.gender}</td>
                  <td>{formatDateDisplay(leader.dob)}</td>
                  <td>{leader.emergency_contacts_name}</td>
                  <td>{leader.emergency_contacts_phone}</td>
                  <td>{leader.role}</td>
                </>
              )}
              <td className="px-4 py-3">
                {isEditing === leader.user_id ? (
                  <div>
                    <button onClick={() => {
                      if (validateLeader(leader)) {
                        handleSave(leader.user_id);
                        setIsEditing(null);
                      }
                    }}
                      className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Save</button>
                    <button onClick={() => { setIsEditing(null); window.location.reload(); }}
                      className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => toggleEdit(leader.user_id)}
                      className="text-sm bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Edit</button>
                    <button onClick={() => handleDeleteLeader(leader.user_id)}
                      className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function EditableField({ type = "text", name, value, onChange, setCurrentField, currentField, options = [] }) {
    const [inputValue, setInputValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleLocalChange = (e) => {
      setInputValue(e.target.value);
      onChange(e.target.name, e.target.value);
      setCurrentField(e.target.name);
    };

    useEffect(() => {
      if (inputRef.current && currentField === name) {
        inputRef.current.focus();
      }
    }, [currentField, name]);

    if (type === "select") {
      return (
        <td>
          <select
            name={name}
            value={inputValue}
            onChange={handleLocalChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
            ref={inputRef}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </td>
      );
    }

    return (
      <td>
        <input
          type={type}
          name={name}
          value={inputValue}
          onChange={handleLocalChange}
          className="form-input rounded-md shadow-sm mt-1 block w-full"
          autoComplete="off"
          ref={inputRef}
        />
      </td>
    );
  }

  function formatDateForInput(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    return '';
  }

  function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  }
}

export default ManageLeaders;
