import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function ManageYouth() {
  const [campers, setCampers] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/admin/manage_youth')
      .then(response => {
        setCampers(response.data);
      })
      .catch(error => console.error('Error fetching campers:', error));
  }, []);

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setCampers(previousCampers => previousCampers.map(camper =>
        camper.camper_id === id ? { ...camper, [name]: value } : camper
    ));
};

const validateCamper = (camper) => {
  if (!camper.first_name || !camper.last_name || !camper.email || !camper.phone_num ||
    !camper.gender || !camper.dob || !camper.parent_guardian_name ||
    !camper.parent_guardian_phone || !camper.parent_guardian_email ||
    !camper.relationship_to_camper || !camper.activity_preferences) {
    alert('Please fill in all fields');
    return false;
  }

  const phoneNumPattern = /^\d{10}$/;
  if (!phoneNumPattern.test(camper.phone_num)) {
    alert('Please enter a valid phone number');
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(camper.email) || !emailPattern.test(camper.parent_guardian_email)) {
    alert('Please enter a valid email address');
    return false;
  }

  const today = new Date();
  const dob = new Date(camper.dob);
  if (dob >= today) {
    alert('Date of birth cannot be in the future');
    return false;
  }

  return true;
};

const handleSave = (id) => {
  setIsLoading(true);
  const camper = campers.find(camper => camper.camper_id === id);
  const updatedCamper = {
      ...camper,
      dob: formatDateForBackend(camper.dob)
  };

  // Perform validation or any other synchronous operations before sending request
  if (!validateCamper(updatedCamper)) {
      alert('Please check your inputs!');
      setIsLoading(false);
      return; // Stop the saving process if validation fails
  }

  axios.put(`http://localhost:3000/admin/manage_youth/${id}`, updatedCamper)
      .then(response => {
          setIsEditing(null);  // This will switch off the editing mode
          alert('Camper profile updated successfully');
      })
      .catch(error => {
          console.error('Error updating camper:', error);
          alert('Failed to update camper profile');
      })
      .finally(() => {
          setIsLoading(false);
      });
};

  const handleSearch = () => {
        setSearchTerm(searchInput.toLowerCase());
      }; 

  const filteredCampers = campers.filter(camper =>
        camper.first_name.toLowerCase().includes(searchTerm) ||
        camper.last_name.toLowerCase().includes(searchTerm) ||
        camper.username.toLowerCase().includes(searchTerm) ||
        camper.phone_num.includes(searchTerm)
      );
  

// Helper function to validate camper data

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



      return (
        <div className="main-content">
        <h1 className="text-xl font-bold mb-4">Manage Youth Campers</h1>
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
              <th className="px-4 py-3">Parent/Guardian Name</th>
              <th className="px-4 py-3">Parent/Guardian Phone</th>
              <th className="px-4 py-3">Parent/Guardian Email</th>
              <th className="px-4 py-3">Relationship</th>
              <th className="px-4 py-3">Activities</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campers.map(camper => (
              <tr key={camper.camper_id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-3">{camper.username}</td>
                {isEditing === camper.camper_id ? (
                  <>
                    <EditableField type="text" name="first_name" value={camper.first_name} onChange={(e) => handleInputChange(e, camper.camper_id)} />
                    <EditableField type="text" name="last_name" value={camper.last_name} onChange={(e) => handleInputChange(e, camper.camper_id)} />
                    <EditableField type="email" name="email" value={camper.email} onChange={(e) => handleInputChange(e, camper.camper_id)} />
                    <EditableField type="text" name="phone_num" value={camper.phone_num} onChange={(e) => handleInputChange(e, camper.camper_id)} />
                    <EditableField
                          type="select"
                          name="gender"
                          value={camper.gender}
                          onChange={(e) => handleInputChange(e, camper.camper_id)}
                          options={[
                              { value: "Male", label: "Male" },
                              { value: "Female", label: "Female" },
                              { value: "Other", label: "Other" }
                          ]}
                      />                    
                    <EditableField EditableField type="date" name="dob" value={formatDateForInput(camper.dob)} onChange={(e) => handleInputChange(e, camper.camper_id)} />
                    <EditableField type="text" name="parent_guardian_name" value={camper.parent_guardian_name} onChange={(e) => handleInputChange(e, camper.camper_id)} />
                    <EditableField type="text" name="parent_guardian_phone" value={camper.parent_guardian_phone} onChange={(e) => handleInputChange(e, camper.camper_id)} />
                    <EditableField type="email" name="parent_guardian_email" value={camper.parent_guardian_email} onChange={(e) => handleInputChange(e, camper.camper_id)} />
                    <EditableField type="text" name="relationship_to_camper" value={camper.relationship_to_camper} onChange={(e) => handleInputChange(e, camper.camper_id)} />
                    <EditableField type="text" name="activity_preferences" value={camper.activity_preferences} onChange={(e) => handleInputChange(e, camper.camper_id)} />
                  </>
                ) : (
                  <>
                    <td>{camper.first_name}</td>
                    <td>{camper.last_name}</td>
                    <td>{camper.email}</td>
                    <td>{camper.phone_num}</td>
                    <td>{camper.gender}</td>
                    <td>{formatDateDisplay(camper.dob)}</td>
                    <td>{camper.parent_guardian_name}</td>
                    <td>{camper.parent_guardian_phone}</td>
                    <td>{camper.parent_guardian_email}</td>
                    <td>{camper.relationship_to_camper}</td>
                    <td>{camper.activity_preferences}</td>
                  </>
                )}
                <td className="px-4 py-3">
                  {isEditing === camper.camper_id ? (
                    <div>
                      <button onClick={() => { 
                        if (validateCamper(camper)) {  // Add a validation check before setting isEditing to null
                          handleSave(camper.camper_id); 
                          setIsEditing(null); 
                        }
                      }}
                        className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Save</button>
                      <button onClick={() => { setIsEditing(null); window.location.reload(); }}
                        className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => toggleEdit(camper.camper_id)}
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

      const debouncedOnChange = useCallback(() => 
        debounce(onChange, 300)
    , [onChange]);
    
      useEffect(() => {
          setInputValue(value);  // Ensure external changes update the local state
      }, [value]);
    

      const handleLocalChange = (e) => {
          setInputValue(e.target.value);  // Update local state immediately on change
          onChange(e);  // Propagate changes upwards if needed
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

export default ManageYouth;

