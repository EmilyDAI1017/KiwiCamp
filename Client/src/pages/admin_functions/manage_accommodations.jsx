import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import '../../App.css';

function ManageAccommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [grounds, setGrounds] = useState([]); // New state for grounds
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentField, setCurrentField] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccommodation, setNewAccommodation] = useState({
    ground_id: '', type: '', capacity: '', location_description: '',
    status: '', picture: ''
  });

  const fetchAccommodations = () => {
    axios.get('http://localhost:3000/admin/manage_accommodations')
      .then(response => {
        setAccommodations(response.data);
      })
      .catch(error => console.error('Error fetching accommodations:', error));
  };

  const fetchGrounds = () => {
    axios.get('http://localhost:3000/admin/camp_grounds')
      .then(response => {
        setGrounds(response.data);
      })
      .catch(error => console.error('Error fetching grounds:', error));
  };

  useEffect(() => {
    fetchAccommodations();
    fetchGrounds();
  }, []);

  const handleInputChange = useCallback(
    debounce((id, name, value) => {
      setAccommodations(previousAccommodations =>
        previousAccommodations.map(accommodation =>
          accommodation.accommodation_id === id ? { ...accommodation, [name]: value } : accommodation
        )
      );
    }, 300),
    []
  );

  const handleChange = (id, name, value) => {
    setAccommodations(previousAccommodations =>
      previousAccommodations.map(accommodation =>
        accommodation.accommodation_id === id ? { ...accommodation, [name]: value } : accommodation
      )
    );
    handleInputChange(id, name, value);
  };

  const handleNewAccommodationChange = (e) => {
    const { name, value } = e.target;
    setNewAccommodation(prevState => ({ ...prevState, [name]: value }));
  };

  const validateAccommodation = (accommodation) => {
    if (!accommodation.ground_id || !accommodation.type || !accommodation.capacity || !accommodation.status) {
      alert('Please fill in all required fields');
      return false;
    }

    const capacityPattern = /^\d+$/;
    if (!capacityPattern.test(accommodation.capacity)) {
      alert('Please enter a valid capacity');
      return false;
    }

    return true;
  };

  const handleSave = (id) => {
    setIsLoading(true);
    const accommodation = accommodations.find(accommodation => accommodation.accommodation_id === id);
    const updatedAccommodation = { ...accommodation };

    if (!validateAccommodation(updatedAccommodation)) {
      setIsLoading(false);
      return;
    }

    axios.put(`http://localhost:3000/admin/manage_accommodations/${id}`, updatedAccommodation)
      .then(response => {
        setIsEditing(null);
        alert('Accommodation profile updated successfully');
        fetchAccommodations();
      })
      .catch(error => {
        console.error('Error updating accommodation:', error);
        alert('Failed to update accommodation profile');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const handleAddAccommodation = () => {
    if (!validateAccommodation(newAccommodation)) {
      return;
    }

    axios.post('http://localhost:3000/admin/manage_accommodations', newAccommodation)
      .then(response => {
        alert("Accommodation added successfully");
        fetchAccommodations();
        setNewAccommodation({
          ground_id: '', type: '', capacity: '', location_description: '',
          status: '', picture: ''
        });
        setShowAddForm(false);
      })
      .catch(error => {
        console.error('Error adding accommodation:', error);
        alert('Failed to add accommodation');
      });
  };

  const handleDeleteAccommodation = (id) => {
    if (!window.confirm('Are you sure you want to delete this accommodation?')) {
      return;
    }

    axios.delete(`http://localhost:3000/admin/manage_accommodations/${id}`)
      .then(response => {
        alert("Accommodation deleted successfully");
        fetchAccommodations();
      })
      .catch(error => {
        console.error('Error deleting accommodation:', error);
        alert('Failed to delete accommodation');
      });
  };

  const filteredAccommodations = accommodations.filter(accommodation =>
    accommodation.type.toLowerCase().includes(searchTerm) ||
    accommodation.location_description.toLowerCase().includes(searchTerm)
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
      <h1 className="text-xl font-bold mb-4">Manage Accommodations</h1>
      <div className="search-container my-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input rounded-md shadow-sm mt-1 w-1/3"
          placeholder="Search accommodations by type/location description..."
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
          Back to dashboard
        </button>
      </div>
      <button
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Hide Add Accommodation Form' : 'Show Add Accommodation Form'}
      </button>
      {showAddForm && (
        <div className="add_new_form my-4">
          <h2 className="text-lg font-bold mb-2">Add New Accommodation</h2>
          <select
            name="ground_id"
            value={newAccommodation.ground_id}
            onChange={handleNewAccommodationChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="">Select Ground</option>
            {grounds.map(ground => (
              <option key={ground.ground_id} value={ground.ground_id}>{ground.name}</option>
            ))}
          </select>
          <select
            name="type"
            value={newAccommodation.type}
            onChange={handleNewAccommodationChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="">Select Type</option>
            <option value="Tent">Tent</option>
            <option value="Cabin">Cabin</option>
          </select>
          <input
            type="text"
            name="capacity"
            placeholder="Capacity"
            value={newAccommodation.capacity}
            onChange={handleNewAccommodationChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="location_description"
            placeholder="Location Description"
            value={newAccommodation.location_description}
            onChange={handleNewAccommodationChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <select
            name="status"
            value={newAccommodation.status}
            onChange={handleNewAccommodationChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <input
            type="text"
            name="picture"
            placeholder="Picture URL"
            value={newAccommodation.picture}
            onChange={handleNewAccommodationChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
            onClick={handleAddAccommodation}
          >
            Add Accommodation
          </button>
        </div>
      )}
      <div className="accommodation-list mt-4">
        {filteredAccommodations.length === 0 ? (
          <p>No accommodations found</p>
        ) : (
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                <th className="px-4 py-3">Accommodation Number</th>
                <th className="px-4 py-3">Ground ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Location Description</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Picture</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccommodations.map(accommodation => (
                <tr key={accommodation.accommodation_id} className="bg-white border-b hover:bg-gray-50">
                  <td className='px-1 py-3'>{accommodation.accommodation_id}</td>
                  {isEditing === accommodation.accommodation_id ? (
                    <>
                      <EditableField type="text" name="ground_id" value={accommodation.ground_id} onChange={(e) => handleChange(accommodation.accommodation_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField
                        type="select"
                        name="type"
                        value={accommodation.type}
                        onChange={(e) => handleChange(accommodation.accommodation_id, e.target.name, e.target.value)}
                        setCurrentField={setCurrentField}
                        currentField={currentField}
                        options={[
                          { value: "Tent", label: "Tent" },
                          { value: "Cabin", label: "Cabin" }
                        ]}
                      />
                      <EditableField type="text" name="capacity" value={accommodation.capacity} onChange={(e) => handleChange(accommodation.accommodation_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField type="text" name="location_description" value={accommodation.location_description} onChange={(e) => handleChange(accommodation.accommodation_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField
                        type="select"
                        name="status"
                        value={accommodation.status}
                        onChange={(e) => handleChange(accommodation.accommodation_id, e.target.name, e.target.value)}
                        setCurrentField={setCurrentField}
                        currentField={currentField}
                        options={[
                          { value: "Active", label: "Active" },
                          { value: "Inactive", label: "Inactive" }
                        ]}
                      />
                      <EditableField type="text" name="picture" value={accommodation.picture} onChange={(e) => handleChange(accommodation.accommodation_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                    </>
                  ) : (
                    <>
                      <td>{accommodation.ground_id}</td>
                      <td>{accommodation.type}</td>
                      <td>{accommodation.capacity}</td>
                      <td>{accommodation.location_description}</td>
                      <td>{accommodation.status}</td>
                      <td>{accommodation.picture}</td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    {isEditing === accommodation.accommodation_id ? (
                      <div>
                        <button onClick={() => {
                          if (validateAccommodation(accommodation)) {
                            handleSave(accommodation.accommodation_id);
                            setIsEditing(null);
                          }
                        }}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                        <button onClick={() => { setIsEditing(null); window.location.reload(); }}
                          className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <button onClick={() => toggleEdit(accommodation.accommodation_id)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                        <button onClick={() => handleDeleteAccommodation(accommodation.accommodation_id)}
                          className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                      </div>
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

export default ManageAccommodations;
