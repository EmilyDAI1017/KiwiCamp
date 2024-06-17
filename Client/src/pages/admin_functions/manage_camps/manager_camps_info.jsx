import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const ManagerCampsInfo = () => {
    const [camps, setCamps] = useState([]);
    const [campGrounds, setCampGrounds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentField, setCurrentField] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCamp, setNewCamp] = useState({
        ground_id: '',
        location: '',
        start_date: '',
        end_date: '',
        capacity: '',
        schedule: '',
        description: '',
        status: 'Pending'
    });

    const fetchCamps = () => {
        setIsLoading(true);
        axios.get('http://localhost:3000/admin/manage_camps')
            .then(response => {
                setCamps(response.data);
            })
            .catch(error => console.error('Error fetching camps:', error))
            .finally(() => setIsLoading(false));
    };

    const fetchCampGrounds = () => {
        axios.get('http://localhost:3000/admin/camp_grounds')
            .then(response => {
                setCampGrounds(response.data);
            })
            .catch(error => console.error('Error fetching camp grounds:', error));
    };

    useEffect(() => {
        fetchCamps();
        fetchCampGrounds();
    }, []);

    const handleInputChange = useCallback(
        debounce((id, name, value) => {
            setCamps(prevCamps =>
                prevCamps.map(camp =>
                    camp.camp_id === id ? { ...camp, [name]: value } : camp
                )
            );
        }, 300),
        []
    );

    const handleChange = (id, name, value) => {
        setCamps(prevCamps =>
            prevCamps.map(camp =>
                camp.camp_id === id ? { ...camp, [name]: value } : camp
            )
        );
        handleInputChange(id, name, value);
    };

    const handleNewCampChange = (e) => {
        const { name, value } = e.target;
        setNewCamp(prevState => ({ ...prevState, [name]: value }));
    };

    const validateCamp = (camp) => {
        if (!camp.ground_id || !camp.location || !camp.capacity || !camp.status) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const handleSave = (id) => {
        setIsLoading(true);
        const camp = camps.find(camp => camp.camp_id === id);
        const updatedCamp = { ...camp,
            start_date: formatDateForBackend(camp.start_date),
            end_date: formatDateForBackend(camp.end_date)};

        if (!validateCamp(updatedCamp)) {
            setIsLoading(false);
            return;
        }

        axios.put(`http://localhost:3000/admin/manage_camps/${id}`, updatedCamp)
            .then(response => {
                setIsEditing(null);
                alert('Camp updated successfully');
                fetchCamps();
            })
            .catch(error => {
                console.error('Error updating camp:', error);
                alert('Failed to update camp');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSearch = () => {
        setSearchTerm(searchInput.toLowerCase());
    };

    const handleAddCamp = () => {
        if (!validateCamp(newCamp)) {
            return;
        }

        axios.post('http://localhost:3000/admin/manage_camps', newCamp)
            .then(response => {
                alert("Camp added successfully");
                fetchCamps();
                setNewCamp({
                    ground_id: '',
                    location: '',
                    start_date: '',
                    end_date: '',
                    capacity: '',
                    schedule: '',
                    description: '',
                    status: 'Pending'
                });
                setShowAddForm(false);
            })
            .catch(error => {
                console.error('Error adding camp:', error);
                alert('Failed to add camp');
            });
    };

    const handleDeleteCamp = (id) => {
        if (!window.confirm('Are you sure you want to delete this camp?')) {
            return;
        }

        axios.delete(`http://localhost:3000/admin/manage_camps/${id}`)
            .then(response => {
                alert("Camp deleted successfully");
                fetchCamps();
            })
            .catch(error => {
                console.error('Error deleting camp:', error);
                alert('Failed to delete camp');
            });
    };

    const filteredCamps = camps.filter(camp =>
        camp.location.toLowerCase().includes(searchTerm) ||
        camp.description.toLowerCase().includes(searchTerm)
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
            <h1 className="text-xl font-bold mb-4">Manage Camps</h1>
            <div className="search-container my-4">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-input rounded-md shadow-sm mt-1 w-1/3"
                    placeholder="Search camps by location/description..."
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
                    Back
                </button>
            </div>
            <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none"
                onClick={() => setShowAddForm(!showAddForm)}
            >
                {showAddForm ? 'Hide Add Camp Form' : 'Show Add Camp Form'}
            </button>
            {showAddForm && (
                <div className="add_new_form my-4">
                    <h2 className="text-lg font-bold mb-2">Add New Camp</h2>
                    <label className="block text-sm font-medium text-gray-700">Ground ID</label>
                    <select
                        name="ground_id"
                        value={newCamp.ground_id}
                        onChange={handleNewCampChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="">Select Ground</option>
                        {campGrounds.map(ground => (
                            <option key={ground.ground_id} value={ground.ground_id}>
                                {ground.name}
                            </option>
                        ))}
                    </select>
                    <label className="block text-sm font-medium text-gray-700">Camp Name</label>
                    <input 
                        type="text"
                        name="camp_name"
                        placeholder="Camp Name"
                        value={newCamp.camp_name}
                        onChange={handleNewCampChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={newCamp.location}
                        onChange={handleNewCampChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        name="start_date"
                        placeholder="Start Date"
                        value={newCamp.start_date}
                        onChange={handleNewCampChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        name="end_date"
                        placeholder="End Date"
                        value={newCamp.end_date}
                        onChange={handleNewCampChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Capacity</label>
                    <input
                        type="text"
                        name="capacity"
                        placeholder="Capacity"
                        value={newCamp.capacity}
                        onChange={handleNewCampChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Schedule</label>
                    <input
                        type="text"
                        name="schedule"
                        placeholder="Schedule"
                        value={newCamp.schedule}
                        onChange={handleNewCampChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newCamp.description}
                        onChange={handleNewCampChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Price</label>

                    <input
                        type='float'
                        name='price'
                        placeholder='Price'
                        value={newCamp.price}
                        onChange={handleNewCampChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        value={newCamp.status}
                        onChange={handleNewCampChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                    </select>
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={handleAddCamp}
                    >
                        Add Camp
                    </button>
                </div>
            )}
            <div className="camp-list mt-4">
                {filteredCamps.length === 0 ? (
                    <p>No camps found</p>
                ) : (
                    <table className="table-auto w-full text-left whitespace-no-wrap">
                        <thead>
                            <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                                <th className="px-4 py-3">Camp ID</th>
                                <th className="px-4 py-3">Ground ID</th>
                                <th className="px-4 py-3">Camp Name</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Start Date</th>
                                <th className="px-4 py-3">End Date</th>
                                <th className="px-4 py-3">Capacity</th>
                                <th className="px-4 py-3">Schedule</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCamps.map(camp => (
                                <tr key={camp.camp_id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-1 py-3">{camp.camp_id}</td>
                                    {isEditing === camp.camp_id ? (
                                        <>
                                            <EditableField type="select" name="ground_id" value={camp.ground_id} onChange={(e) => handleChange(camp.camp_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} options={campGrounds.map(ground => ({ value: ground.ground_id, label: ground.name }))} />
                                            <EditableField type="text" name="camp_name" value={camp.camp_name} onChange={(e) => handleChange(camp.camp_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="text" name="location" value={camp.location} onChange={(e) => handleChange(camp.camp_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="date" name="start_date" value={formatDateForInput(camp.start_date)} onChange={(e) => handleChange(camp.camp_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="date" name="end_date" value={formatDateForInput(camp.end_date)} onChange={(e) => handleChange(camp.camp_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="text" name="capacity" value={camp.capacity} onChange={(e) => handleChange(camp.camp_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="text" name="schedule" value={camp.schedule} onChange={(e) => handleChange(camp.camp_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="text" name="description" value={camp.description} onChange={(e) => handleChange(camp.camp_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="float" name="price" value={camp.price} onChange={(e) => handleChange(camp.camp_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField
                                                type="select"
                                                name="status"
                                                value={camp.status}
                                                onChange={(e) => handleChange(camp.camp_id, e.target.name, e.target.value)}
                                                setCurrentField={setCurrentField}
                                                currentField={currentField}
                                                options={[
                                                    { value: "Pending", label: "Pending" },
                                                    { value: "Approved", label: "Approved" }
                                                ]}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <td>{camp.ground_id}</td>
                                            <td>{camp.camp_name}</td>
                                            <td>{camp.location}</td>
                                            <td>{formatDateDisplay(camp.start_date)}</td>
                                            <td>{formatDateDisplay(camp.end_date)}</td>
                                            <td>{camp.capacity}</td>
                                            <td>{camp.schedule}</td>
                                            <td>{camp.description}</td>
                                            <td>{camp.price}</td>
                                            <td>{camp.status}</td>
                                        </>
                                    )}
                                    <td className="px-4 py-3">
                                        {isEditing === camp.camp_id ? (
                                            <div>
                                                <button onClick={() => handleSave(camp.camp_id)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                                                <button onClick={() => setIsEditing(null)}
                                                    className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                                            </div>
                                        ) : (
                                            <div>
                                                <button onClick={() => toggleEdit(camp.camp_id)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                                                <button onClick={() => handleDeleteCamp(camp.camp_id)}
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


export default ManagerCampsInfo;
