import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const ManageActivities = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentField, setCurrentField] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newActivity, setNewActivity] = useState({
        name: '',
        duration: '',
        description: '',
        cost: '',
        capacity: ''
    });

    const fetchActivities = () => {
        setIsLoading(true);
        axios.get('http://localhost:3000/admin/activities')
            .then(response => {
                setActivities(response.data);
            })
            .catch(error => console.error('Error fetching activities:', error))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleInputChange = useCallback(
        debounce((id, name, value) => {
            setActivities(prevActivities =>
                prevActivities.map(activity =>
                    activity.activity_id === id ? { ...activity, [name]: value } : activity
                )
            );
        }, 300),
        []
    );

    const handleChange = (id, name, value) => {
        setActivities(prevActivities =>
            prevActivities.map(activity =>
                activity.activity_id === id ? { ...activity, [name]: value } : activity
            )
        );
        handleInputChange(id, name, value);
    };

    const handleNewActivityChange = (e) => {
        const { name, value } = e.target;
        setNewActivity(prevState => ({ ...prevState, [name]: value }));
    };

    const validateActivity = (activity) => {
        if (!activity.name || !activity.duration || !activity.cost || !activity.capacity) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const handleSave = (id) => {
        setIsLoading(true);
        const activity = activities.find(activity => activity.activity_id === id);

        if (!validateActivity(activity)) {
            setIsLoading(false);
            return;
        }

        axios.put(`http://localhost:3000/admin/activities/${id}`, activity)
            .then(response => {
                setIsEditing(null);
                alert('Activity updated successfully');
                fetchActivities();
            })
            .catch(error => {
                console.error('Error updating activity:', error);
                alert('Failed to update activity');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSearch = () => {
        setSearchTerm(searchInput.toLowerCase());
    };

    const handleAddActivity = () => {
        if (!validateActivity(newActivity)) {
            return;
        }

        axios.post('http://localhost:3000/admin/activities', newActivity)
            .then(response => {
                alert("Activity added successfully");
                fetchActivities();
                setNewActivity({
                    name: '',
                    duration: '',
                    description: '',
                    cost: '',
                    capacity: ''
                });
                setShowAddForm(false);
            })
            .catch(error => {
                console.error('Error adding activity:', error);
                alert('Failed to add activity');
            });
    };

    const handleDeleteActivity = (id) => {
        if (!window.confirm('Are you sure you want to delete this activity?')) {
            return;
        }

        axios.delete(`http://localhost:3000/admin/activities/${id}`)
            .then(response => {
                alert("Activity deleted successfully");
                fetchActivities();
            })
            .catch(error => {
                console.error('Error deleting activity:', error);
                alert('Failed to delete activity');
            });
    };

    const filteredActivities = activities.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm) ||
        activity.description.toLowerCase().includes(searchTerm)
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
            <h1 className="text-xl font-bold mb-4">Manage Activities</h1>
            <div className="search-container my-4">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-input rounded-md shadow-sm mt-1 w-1/3"
                    placeholder="Search activities by name/description..."
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
                {showAddForm ? 'Hide Add Activity Form' : 'Show Add Activity Form'}
            </button>
            {showAddForm && (
                <div className="new-activity-form my-4">
                    <h2 className="text-lg font-bold mb-2">Add New Activity</h2>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newActivity.name}
                        onChange={handleNewActivityChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <input
                        type="text"
                        name="duration"
                        placeholder="Duration"
                        value={newActivity.duration}
                        onChange={handleNewActivityChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newActivity.description}
                        onChange={handleNewActivityChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Cost</label>
                    <input
                        type='float'
                        name='cost'
                        placeholder='Cost'
                        value={newActivity.cost}
                        onChange={handleNewActivityChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Capacity</label>
                    <input
                        type="text"
                        name="capacity"
                        placeholder="Capacity"
                        value={newActivity.capacity}
                        onChange={handleNewActivityChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={handleAddActivity}
                    >
                        Add Activity
                    </button>
                </div>
            )}
            <div className="activity-list mt-4">
                {filteredActivities.length === 0 ? (
                    <p>No activities found</p>
                ) : (
                    <table className="table-auto w-full text-left whitespace-no-wrap">
                        <thead>
                            <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                                <th className="px-4 py-3">Activity ID</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Duration</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Cost</th>
                                <th className="px-4 py-3">Capacity</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivities.map(activity => (
                                <tr key={activity.activity_id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-1 py-3">{activity.activity_id}</td>
                                    {isEditing === activity.activity_id ? (
                                        <>
                                            <EditableField type="text" name="name" value={activity.name} onChange={(e) => handleChange(activity.activity_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="text" name="duration" value={activity.duration} onChange={(e) => handleChange(activity.activity_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="text" name="description" value={activity.description} onChange={(e) => handleChange(activity.activity_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="float" name="cost" value={activity.cost} onChange={(e) => handleChange(activity.activity_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="text" name="capacity" value={activity.capacity} onChange={(e) => handleChange(activity.activity_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                        </>
                                    ) : (
                                        <>
                                            <td>{activity.name}</td>
                                            <td>{activity.duration}</td>
                                            <td>{activity.description}</td>
                                            <td>{activity.cost}</td>
                                            <td>{activity.capacity}</td>
                                        </>
                                    )}
                                    <td className="px-4 py-3">
                                        {isEditing === activity.activity_id ? (
                                            <div>
                                                <button onClick={() => handleSave(activity.activity_id)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                                                <button onClick={() => setIsEditing(null)}
                                                    className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                                            </div>
                                        ) : (
                                            <div>
                                                <button onClick={() => toggleEdit(activity.activity_id)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                                                <button onClick={() => handleDeleteActivity(activity.activity_id)}
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

export default ManageActivities;
