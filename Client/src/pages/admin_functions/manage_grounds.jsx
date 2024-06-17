import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import '../../App.css';

function ManageGrounds() {
  const [grounds, setGrounds] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentField, setCurrentField] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGround, setNewGround] = useState({
    name: '', capacity: '', description: '', location: '',
    status: '', picture: ''
  });

  const fetchGrounds = () => {
    axios.get('http://localhost:3000/admin/manage_grounds')
      .then(response => {
        setGrounds(response.data);
      })
      .catch(error => console.error('Error fetching grounds:', error));
  };

  useEffect(() => {
    fetchGrounds();
  }, []);

  const handleInputChange = useCallback(
    debounce((id, name, value) => {
      setGrounds(previousGrounds =>
        previousGrounds.map(ground =>
          ground.ground_id === id ? { ...ground, [name]: value } : ground
        )
      );
    }, 300),
    []
  );

  const handleChange = (id, name, value) => {
    setGrounds(previousGrounds =>
      previousGrounds.map(ground =>
        ground.ground_id === id ? { ...ground, [name]: value } : ground
      )
    );
    handleInputChange(id, name, value);
  };

  const handleNewGroundChange = (e) => {
    const { name, value } = e.target;
    setNewGround(prevState => ({ ...prevState, [name]: value }));
  };

  const validateGround = (ground) => {
    if (!ground.name || !ground.capacity || !ground.status) {
      alert('Please fill in all required fields');
      return false;
    }

    const capacityPattern = /^\d+$/;
    if (!capacityPattern.test(ground.capacity)) {
      alert('Please enter a valid capacity');
      return false;
    }

    return true;
  };

  const handleSave = (id) => {
    setIsLoading(true);
    const ground = grounds.find(ground => ground.ground_id === id);
    const updatedGround = { ...ground };

    if (!validateGround(updatedGround)) {
      setIsLoading(false);
      return;
    }

    axios.put(`http://localhost:3000/admin/manage_grounds/${id}`, updatedGround)
      .then(response => {
        setIsEditing(null);
        alert('Ground profile updated successfully');
        fetchGrounds();
      })
      .catch(error => {
        console.error('Error updating ground:', error);
        alert('Failed to update ground profile');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const handleAddGround = () => {
    if (!validateGround(newGround)) {
      return;
    }

    axios.post('http://localhost:3000/admin/manage_grounds', newGround)
      .then(response => {
        alert("Ground added successfully");
        fetchGrounds();
        setNewGround({
          name: '', capacity: '', description: '', location: '',
          status: '', picture: ''
        });
        setShowAddForm(false);
      })
      .catch(error => {
        console.error('Error adding ground:', error);
        alert('Failed to add ground');
      });
  };

  const handleDeleteGround = (id) => {
    if (!window.confirm('Are you sure you want to delete this ground?')) {
      return;
    }

    axios.delete(`http://localhost:3000/admin/manage_grounds/${id}`)
      .then(response => {
        alert("Ground deleted successfully");
        fetchGrounds();
      })
      .catch(error => {
        console.error('Error deleting ground:', error);
        alert('Failed to delete ground');
      });
  };

  const filteredGrounds = grounds.filter(ground =>
    ground.name.toLowerCase().includes(searchTerm) ||
    ground.description.toLowerCase().includes(searchTerm) ||
    ground.location.toLowerCase().includes(searchTerm)
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
      <h1 className="text-xl font-bold mb-4">Manage Camping Grounds</h1>
      <div className="search-container my-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input rounded-md shadow-sm mt-1 w-1/3"
          placeholder="Search grounds by name/description/location..."
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
        {showAddForm ? 'Hide Add Ground Form' : 'Show Add Ground Form'}
      </button>
      {showAddForm && (
        <div className="add_new_form my-4">
          <h2 className="text-lg font-bold mb-2">Add New Ground</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newGround.name}
            onChange={handleNewGroundChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="capacity"
            placeholder="Capacity"
            value={newGround.capacity}
            onChange={handleNewGroundChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newGround.description}
            onChange={handleNewGroundChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={newGround.location}
            onChange={handleNewGroundChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <select
            name="status"
            value={newGround.status}
            onChange={handleNewGroundChange}
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
            value={newGround.picture}
            onChange={handleNewGroundChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
            onClick={handleAddGround}
          >
            Add Ground
          </button>
        </div>
      )}
      <div className="ground-list mt-4">
        {filteredGrounds.length === 0 ? (
          <p>No grounds found</p>
        ) : (
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                <th className="px-4 py-3">Ground Number</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Picture</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrounds.map(ground => (
                <tr key={ground.ground_id} className="bg-white border-b hover:bg-gray-50">
                <td className='px-1 py-3'>{ground.ground_id}</td>
                  
                  {isEditing === ground.ground_id ? (
                    <>
                      <EditableField type="text" name="name" value={ground.name} onChange={(e) => handleChange(ground.ground_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField type="text" name="capacity" value={ground.capacity} onChange={(e) => handleChange(ground.ground_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField type="text" name="description" value={ground.description} onChange={(e) => handleChange(ground.ground_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField type="text" name="location" value={ground.location} onChange={(e) => handleChange(ground.ground_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField
                        type="select"
                        name="status"
                        value={ground.status}
                        onChange={(e) => handleChange(ground.ground_id, e.target.name, e.target.value)}
                        setCurrentField={setCurrentField}
                        currentField={currentField}
                        options={[
                          { value: "Active", label: "Active" },
                          { value: "Inactive", label: "Inactive" }
                        ]}
                      />
                      <EditableField type="text" name="picture" value={ground.picture} onChange={(e) => handleChange(ground.ground_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                    </>
                  ) : (
                    <>

                      <td>{ground.name}</td>
                      <td>{ground.capacity}</td>
                      <td>{ground.description}</td>
                      <td>{ground.location}</td>
                      <td>{ground.status}</td>
                      <td>{ground.picture}</td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    {isEditing === ground.ground_id ? (
                      <div>
                        <button onClick={() => {
                          if (validateGround(ground)) {
                            handleSave(ground.ground_id);
                            setIsEditing(null);
                          }
                        }}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                        <button onClick={() => { setIsEditing(null); window.location.reload(); }}
                          className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <button onClick={() => toggleEdit(ground.ground_id)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                        <button onClick={() => handleDeleteGround(ground.ground_id)}
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

export default ManageGrounds;
