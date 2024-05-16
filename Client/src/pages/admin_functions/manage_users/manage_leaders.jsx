import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function ManageLeaders() {
  const [leaders, setLeaders] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/admin/manage_leaders')
      .then(response => {
        setLeaders(response.data);
      })
      .catch(error => console.error('Error fetching leaders:', error));
  }, []);

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setLeaders(previousLeaders => previousLeaders.map(leader =>
        leader.user_id === id ? { ...leader, [name]: value } : leader
    ));
  };

  const handleSave = (id) => {
    setIsLoading(true);
    const leader = leaders.find(leader => leader.user_id === id);
    const updatedLeader = {
        ...leader,
        dob: formatDateForBackend(leader.dob)
    };

    const validateLeader= (leader) => {
        if (!leader.first_name || !leader.last_name || !leader.email || !leader.phone_num ||
          !leader.gender || !leader.dob) {
          alert('Please fill in all fields');
          return false;
        }
      
        const phoneNumPattern = /^\d{10}$/;
        if (!phoneNumPattern.test(leader.phone_num)) {
          alert('Please enter a valid phone number');
          return false;
        }
      
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(leader.email) || !emailPattern.test(leader.parent_guardian_email)) {
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
    
    

    if (validateLeader(updatedLeader)) {
        setIsLoading(true);
      axios.put(`http://localhost:3000/admin/manage_leaders/${id}`, updatedLeader)
        .then(() => {
          console.log('leader updated successfully!');
          alert('leader profile updated successfully');
          setIsEditing(null); // Exit editing mode on successful save
        })
        .catch(error => {
          console.error('Error updating leader:', error);
          alert('Failed to update leader profile');
        })
        .finally(() => {
          setIsLoading(false);
        });
};
  }
  
 
  const toggleEdit = (id) => {
    if (isEditing === id) {
      setIsEditing(null);  // If the current editing ID is clicked again, stop editing
    } else {
      setIsEditing(id);  // Set editing to the current id
    }
  };

  function formatDateForBackend(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    // Provide a fallback or handle the case where the date is invalid
    return null; // Or any other appropriate default
}

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };


  const filteredLeaders = leaders.filter(leader =>
    leader.first_name.toLowerCase().includes(searchTerm) ||
    leader.last_name.toLowerCase().includes(searchTerm) ||
    leader.username.toLowerCase().includes(searchTerm) ||
    leader.phone_num.includes(searchTerm)
  );

  return (
    <div className="main-content">


    <h1 className="text-xl font-bold mb-4">Manage Youth leaders</h1>
    <div className="search-container my-4">
   <input
    type="text"
    placeholder="Search by name, username, or phone..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    className="form-input rounded-md shadow-sm mt-1 block w-full"
  />
  <button
     onClick={() => setSearchTerm(searchInput.toLowerCase())}
    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
  >
    Search
  </button>
   </div>
    <button class="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out" onClick={() => window.history.back()}>Back</button>
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
                <EditableField type="text" name="first_name" value={leader.first_name} onChange={(e) => handleInputChange(e, leader.user_id)} />
                <EditableField type="text" name="last_name" value={leader.last_name} onChange={(e) => handleInputChange(e, leader.user_id)} />
                <EditableField type="email" name="email" value={leader.email} onChange={(e) => handleInputChange(e, leader.user_id)} />
                <EditableField type="text" name="phone_num" value={leader.phone_num} onChange={(e) => handleInputChange(e, leader.user_id)} />
                <EditableField
                      type="select"
                      name="gender"
                      value={leader.gender}
                      onChange={(e) => handleInputChange(e, leader.user_id)}
                      options={[
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                          { value: "Other", label: "Other" }
                      ]}
                  />                    
                <EditableField EditableField type="date" name="dob" value={formatDateForInput(leader.dob)} onChange={(e) => handleInputChange(e, leader.user_id)} />
                <EditableField type="text" name="emergency_contacts_name" value={leader.emergency_contacts_name} onChange={(e) => handleInputChange(e, leader.user_id)} />
                <EditableField type="text" name="emergency_contacts_phone" value={leader.emergency_contacts_phone} onChange={(e) => handleInputChange(e, leader.user_id)} />
                <EditableField type="text" name="role" value={leader.role} onChange={(e) => handleInputChange(e, leader.user_id)} />
              </>
            ) : (
              <>
                <td>{leader.username}</td>
                <td>{leader.first_name}</td>
                <td>{leader.last_name}</td>
                <td>{leader.email}</td>
                <td>{leader.phone_num}</td>
                <td>{leader.gender}</td>
                <td>{formatDateDisplay(leader.dob)}</td>
                <td>{leader.emergency_contacts_name}</td>
                <td>{leader.emergency_contacts_name}</td>
                <td>{leader.role}</td>
              </>
            )}
            <td className="px-4 py-3">
              {isEditing === leader.user_id ? (
                <div>
                  <button onClick={() => { 
                    if (validateLeader(leader)) {  // Add a validation check before setting isEditing to null
                      handleSave(leader.user_id); 
                      setIsEditing(null); 
                    }
                  }}
                    className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Save</button>
                  <button onClick={() => { setIsEditing(null); window.location.reload(); }}
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                </div>
              ) : (
                <button onClick={() => toggleEdit(leader.user_id)}
                  className="text-sm bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Edit</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function EditableField({ type = "text", name, value, onChange, options = [] }) {
  const [inputValue, setInputValue] = useState(value);

      // Create a debounced change handler
const debouncedOnChange = useCallback(() => 
  debounce(onChange, 300)
, [onChange]);


  useEffect(() => {
      setInputValue(value);  // Ensure external changes update the local state
  }, [value]);

  const handleLocalChange = (e) => {
      setInputValue(e.target.value);  // Update local state immediately on change
      debouncedOnChange(e); // Propagate changes upwards if needed
  };

  // Check if the type is "select" to render a dropdown
  if (type === "select") {
      return (
          <td>
              <select
                  name={name}
                  value={inputValue}
                  onChange={handleLocalChange}
                  className="form-select rounded-md shadow-sm mt-1 block w-full"
              >
                  {options.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
              </select>
          </td>
      );
  }

  // Default return for text and other types of inputs
  return (
      <td>
          <input
              type={type}
              name={name}
              value={inputValue}
              onChange={handleLocalChange}
              className="form-input rounded-md shadow-sm mt-1 block w-full"
              autoComplete="off"
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
      // Ensures the date is displayed in day/month/year format
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }
  return "Invalid date"; // Fallback for invalid or undefined dates
}


}


export default ManageLeaders;