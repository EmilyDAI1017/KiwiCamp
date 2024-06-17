import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentField, setCurrentField] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    username: '', first_name: '', last_name: '', email: '',
    phone_num: '', gender: '', password: '', emergency_contacts_name: '', emergency_contacts_phone: ''
  });

  const fetchStaff = () => {
    axios.get('http://localhost:3000/admin/manage_staff')
      .then(response => {
        setStaff(response.data);
      })
      .catch(error => console.error('Error fetching staff:', error));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = useCallback(
    debounce((id, name, value) => {
      setStaff(previousStaff =>
        previousStaff.map(staff =>
          staff.user_id === id ? { ...staff, [name]: value } : staff
        )
      );
    }, 300),
    []
  );

  const handleChange = (id, name, value) => {
    setStaff(previousStaff =>
      previousStaff.map(staff =>
        staff.user_id === id ? { ...staff, [name]: value } : staff
      )
    );
    handleInputChange(id, name, value);
  };

  const handleNewStaffChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prevState => ({ ...prevState, [name]: value }));
  };

  const validateStaff = (staff) => {
    if (!staff.first_name || !staff.last_name || !staff.email || !staff.phone_num ||
      !staff.gender || !staff.emergency_contacts_name || !staff.emergency_contacts_phone) {
      alert('Please fill in all fields');
      return false;
    }

    const phoneNumPattern = /^\d{10}$/;
    if (!phoneNumPattern.test(staff.phone_num) || !phoneNumPattern.test(staff.emergency_contacts_phone)) {
      alert('Please enter a valid phone number');
      return false;
    }


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(staff.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSave = (id) => {
    setIsLoading(true);
    const staffMember = staff.find(staff => staff.user_id === id);
    const updatedStaff = { ...staffMember };

    if (!validateStaff(updatedStaff)) {
      setIsLoading(false);
      return;
    }

    axios.put(`http://localhost:3000/admin/manage_staff/${id}`, updatedStaff)
      .then(response => {
        setIsEditing(null);
        alert('Staff profile updated successfully');
        fetchStaff();
      })
      .catch(error => {
        console.error('Error updating staff:', error);
        alert('Failed to update staff profile');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const handleAddStaff = () => {
    if (!validateStaff(newStaff)) {
      return;
    }

    axios.post('http://localhost:3000/admin/manage_staff', newStaff)
      .then(response => {
        alert("Staff added successfully");
        fetchStaff();
        setNewStaff({
          username: '', first_name: '', last_name: '', email: '',
          phone_num: '', gender: '', password: '', emergency_contacts_name: '', emergency_contacts_phone: ''
        });
        setShowAddForm(false);
      })
      .catch(error => {
        console.error('Error adding staff:', error);
        alert('Failed to add staff');
      });
  };

  const handleDeleteStaff = (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    axios.delete(`http://localhost:3000/admin/manage_staff/${id}`)
      .then(response => {
        alert("Staff deleted successfully");
        fetchStaff();
      })
      .catch(error => {
        console.error('Error deleting staff:', error);
        alert('Failed to delete staff');
      });
  };

  const filteredStaff = staff.filter(staff =>
    staff.first_name.toLowerCase().includes(searchTerm) ||
    staff.last_name.toLowerCase().includes(searchTerm) ||
    staff.username.toLowerCase().includes(searchTerm) ||
    staff.phone_num.includes(searchTerm)
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
      <h1 className="text-xl font-bold mb-4">Manage Staff</h1>
      <div className="search-container my-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input rounded-md shadow-sm mt-1 w-1/3"
          placeholder="Search staff by their username/name/phone number..."
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
        {showAddForm ? 'Hide Add Staff Form' : 'Show Add Staff Form'}
      </button>
      {showAddForm && (
        <div className="add_new_form my-4">
          <h2 className="text-lg font-bold mb-2">Add New Staff</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newStaff.username}
            onChange={handleNewStaffChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newStaff.password}
            onChange={handleNewStaffChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={newStaff.first_name}
            onChange={handleNewStaffChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={newStaff.last_name}
            onChange={handleNewStaffChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newStaff.email}
            onChange={handleNewStaffChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="phone_num"
            placeholder="Phone Number"
            value={newStaff.phone_num}
            onChange={handleNewStaffChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <select
            name="gender"
            value={newStaff.gender}
            onChange={handleNewStaffChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="emergency_contacts_name"
            placeholder="Emergency Contact Name"
            value={newStaff.emergency_contacts_name}
            onChange={handleNewStaffChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="emergency_contacts_phone"
            placeholder="Emergency Contact Phone"
            value={newStaff.emergency_contacts_phone}
            onChange={handleNewStaffChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
            onClick={handleAddStaff}
          >
            Add Staff
          </button>
        </div>
      )}
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
            <th className="px-4 py-3">Username</th>
            <th className="px-4 py-3">First Name</th>
            <th className="px-4 py-3">Last Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone Number</th>
            <th className="px-4 py-3">Gender</th>
            <th className="px-4 py-3">Emergency Contact Name</th>
            <th className="px-4 py-3">Emergency Contact Phone</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map(staff => (
            <tr key={staff.user_id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-3">{staff.username}</td>
              {isEditing === staff.user_id ? (
                <>
                  <EditableField type="text" name="first_name" value={staff.first_name} onChange={(e) => handleChange(staff.user_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="last_name" value={staff.last_name} onChange={(e) => handleChange(staff.user_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="email" name="email" value={staff.email} onChange={(e) => handleChange(staff.user_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="phone_num" value={staff.phone_num} onChange={(e) => handleChange(staff.user_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField
                    type="select"
                    name="gender"
                    value={staff.gender}
                    onChange={(e) => handleChange(staff.user_id, e.target.name, e.target.value)}
                    setCurrentField={setCurrentField}
                    currentField={currentField}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" }
                    ]}
                  />
                  <EditableField type="text" name="emergency_contacts_name" value={staff.emergency_contacts_name} onChange={(e) => handleChange(staff.user_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="emergency_contacts_phone" value={staff.emergency_contacts_phone} onChange={(e) => handleChange(staff.user_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                </>
              ) : (
                <>
                  <td>{staff.first_name}</td>
                  <td>{staff.last_name}</td>
                  <td>{staff.email}</td>
                  <td>{staff.phone_num}</td>
                  <td>{staff.gender}</td>
                  <td>{staff.emergency_contacts_name}</td>
                  <td>{staff.emergency_contacts_phone}</td>
                </>
              )}
              <td className="px-4 py-3">
                {isEditing === staff.user_id ? (
                  <div>
                    <button onClick={() => {
                      if (validateStaff(staff)) {
                        handleSave(staff.user_id);
                        setIsEditing(null);
                      }
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                    <button onClick={() => { setIsEditing(null); window.location.reload(); }}
                      className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => toggleEdit(staff.user_id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDeleteStaff(staff.user_id)}
                       className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
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
      onChange(e);
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
}

export default ManageStaff;
