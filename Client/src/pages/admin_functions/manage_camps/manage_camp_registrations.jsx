import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const ManageRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [camps, setCamps] = useState([]);
    const [users, setUsers] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentField, setCurrentField] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRegistration, setNewRegistration] = useState({
        group_id: '',
        camp_id: '',
        user_id: '',
        camper_type: 'Youth',
        registration_date: '',
        status: 'Registered'
    });

    const fetchRegistrations = () => {
        setIsLoading(true);
        axios.get('http://localhost:3000/admin/manage_registrations')
            .then(response => {
                setRegistrations(response.data);
            })
            .catch(error => console.error('Error fetching registrations:', error))
            .finally(() => setIsLoading(false));
    };

    const fetchGroups = () => {
        axios.get('http://localhost:3000/admin_manage_camp_registrations/groups')
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => console.error('Error fetching groups:', error));
    };

    const fetchCamps = () => {
        axios.get('http://localhost:3000/admin/camps')
            .then(response => {
                setCamps(response.data);
            })
            .catch(error => console.error('Error fetching camps:', error));
    };

    const fetchUsers = () => {
        axios.get('http://localhost:3000/admin_manage_camp_registrations/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error('Error fetching users:', error));
    };

    useEffect(() => {
        fetchRegistrations();
        fetchGroups();
        fetchCamps();
        fetchUsers();
    }, []);

    const handleInputChange = useCallback(
        debounce((id, name, value) => {
            setRegistrations(prevRegistrations =>
                prevRegistrations.map(registration =>
                    registration.registration_id === id ? { ...registration, [name]: value } : registration
                )
            );
        }, 300),
        []
    );

    const handleChange = (id, name, value) => {
        setRegistrations(prevRegistrations =>
            prevRegistrations.map(registration =>
                registration.registration_id === id ? { ...registration, [name]: value } : registration
            )
        );
        handleInputChange(id, name, value);
    };

    const handleNewRegistrationChange = (e) => {
        const { name, value } = e.target;
        setNewRegistration(prevState => ({ ...prevState, [name]: value }));
    };

    const validateRegistration = (registration) => {
        if (!registration.group_id || !registration.camp_id || !registration.user_id || !registration.camper_type || !registration.status) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const handleSave = async (id) => {
        setIsLoading(true);
        const registration = registrations.find(registration => registration.registration_id === id);
        const updatedRegistration = { ...registration,
            registration_date: formatDateForBackend(registration.registration_date)};

        if (!validateRegistration(updatedRegistration)) {
            setIsLoading(false);
            return;
        }

        try {
            await axios.put(`http://localhost:3000/admin/manage_camp_registrations/${id}`, updatedRegistration);
            setIsEditing(null);
            alert('Registration updated successfully');
            fetchRegistrations();

        if (updatedRegistration.status === 'Registered') {
            const user = users.find(user => user.user_id === updatedRegistration.user_id);
            if (user) {
                sendNewsToUser(user.user_id, 'Camp Registration is approved','Your registration for camp has been approved.');
            }
        }
        } finally {
            setIsLoading(false);
        }   
    };


    const sendNewsToUser = (receiverId, title, content) => {
        const news = {
            receiver_id: receiverId,
            title: title,
            content: content,
            publish_date: new Date().toISOString().split('T')[0], // Today's date
            to_all: 'No',
            to_group: 'No',
        };

        axios.post('http://localhost:3000/send_news', news)
            .then(response => {
                console.log('News sent successfully');
            })
            .catch(error => {
                console.error('Error sending news:', error);
            });
    };

    const handleAddRegistration = () => {
        if (!validateRegistration(newRegistration)) {
            return;
        }

        axios.post('http://localhost:3000/admin/manage_camp_registrations', newRegistration)
            .then(response => {
                alert("Registration added successfully");
                fetchRegistrations();
                setNewRegistration({
                    group_id: '',
                    camp_id: '',
                    user_id: '',
                    camper_type: 'Youth',
                    registration_date: '',
                    status: 'Registered'
                });
                setShowAddForm(false);
            })
            .catch(error => {
                console.error('Error adding registration:', error);
                alert('Failed to add registration');
            });
    };

    const handleDeleteRegistration = (id) => {
        if (!window.confirm('Are you sure you want to delete this registration?')) {
            return;
        }

        axios.delete(`http://localhost:3000/admin/manage_camp_registrations/${id}`)
            .then(response => {
                alert("Registration deleted successfully");
                fetchRegistrations();
            })
            .catch(error => {
                console.error('Error deleting registration:', error);
                alert('Failed to delete registration');
            });
    };

    const handleSearch = () => {
        setSearchTerm(searchInput.toLowerCase());
    };

    const handleUserSearch = debounce((term) => {
        setUserSearchTerm(term);
        axios.get(`http://localhost:3000/admin_manage_camp_registrations/users?search=${term}`)
            .then(response => {
                setFilteredUsers(response.data);
            })
            .catch(error => console.error('Error searching users:', error));
    }, 300);

    const filteredRegistrations = registrations.filter(registration =>
        registration.group_id.toString().includes(searchTerm) ||
        registration.camp_id.toString().includes(searchTerm) ||
        registration.user_id.toString().includes(searchTerm) ||
        registration.camper_type.toLowerCase().includes(searchTerm) ||
        registration.status.toLowerCase().includes(searchTerm)
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
            <h1 className="text-xl font-bold mb-4">Manage Registrations</h1>
            <div className="search-container my-4">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-input rounded-md shadow-sm mt-1 w-1/2"
                    placeholder="Search registrations by status/group id/camp id/user id/camper type..."
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
                {showAddForm ? 'Hide Add Registration Form' : 'Show Add Registration Form'}
            </button>
            {showAddForm && (
                <div className="new-registration-form my-4">
                    <h2 className="text-lg font-bold mb-2">Add New Registration</h2>
                    <label className="block text-sm font-medium text-gray-700">Group ID</label>
                    <select
                        name="group_id"
                        value={newRegistration.group_id}
                        onChange={handleNewRegistrationChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="">Select Group</option>
                        {groups.map(group => (
                            <option key={group.group_id} value={group.group_id}>
                                Group Id: {group.group_id} Group Name: {group.group_name}
                            </option>
                        ))}
                    </select>
                    <label className="block text-sm font-medium text-gray-700">Camp</label>
                    <select
                        name="camp_id"
                        value={newRegistration.camp_id}
                        onChange={handleNewRegistrationChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="">Select Camp</option>
                        {camps.map(camp => (
                            <option key={camp.camp_id} value={camp.camp_id}>
                               {camp.camp_name} {camp.location} ({formatDateDisplay(camp.start_date)} - {formatDateDisplay(camp.end_date)})
                            </option>
                        ))}
                    </select>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    
                    <div className="user-search-container my-4">
                        <label className="block text-sm font-medium text-gray-700">Search Users by username</label>
                        
                        <input
    type="text"
    value={userSearchTerm}
    onChange={(e) => setUserSearchTerm(e.target.value)}
    className="form-input rounded-md shadow-sm mt-1 block w-full"
    placeholder="Search users by name..."
/>
<button
    onClick={() => handleUserSearch(userSearchTerm)}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
>
    Search User
</button>

                        
                    </div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <select
                        name="user_id"
                        value={newRegistration.user_id}
                        onChange={handleNewRegistrationChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user.user_id} value={user.user_id}>
                                Id: {user.user_id} Username: {user.username}
                            </option>
                        ))}
                    </select>


                    <label className="block text-sm font-medium text-gray-700">Camper Type</label>
                    <select
                        name="camper_type"
                        value={newRegistration.camper_type}
                        onChange={handleNewRegistrationChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="Youth">Youth</option>
                        <option value="Adult Leader">Adult Leader</option>
                    </select>
                    <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                    <input
                        type="date"
                        name="registration_date"
                        placeholder="Registration Date"
                        value={formatDateForInput(newRegistration.registration_date)}
                        onChange={handleNewRegistrationChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        value={newRegistration.status}
                        onChange={handleNewRegistrationChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="Registered">Registered</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={handleAddRegistration}
                    >
                        Add Registration
                    </button>
                </div>
            )}
            <div className="registration-list mt-4">
                {filteredRegistrations.length === 0 ? (
                    <p>No registrations found</p>
                ) : (
                    <table className="table-auto w-full text-left whitespace-no-wrap">
                        <thead>
                            <tr className="font-semibold text-gray-700 bg-gray-100">
                                <th className="px-2 py-3">Registration ID</th>
                                <th className="px-2 py-3">Group ID</th>
                                <th className="px-2 py-3">Camp ID</th>
                                <th className="px-2 py-3">User ID</th>
                                <th className="px-2 py-3">Camper Type</th>
                                <th className="px-2 py-3">Registration Date</th>
                                <th className="px-2 py-3">Status</th>
                                <th className="px-2 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map(registration => (
                                <tr key={registration.registration_id} className="bg-white border-b hover:bg-gray-50">
                                    {isEditing === registration.registration_id ? (
                                        <>
                                            <td>{registration.registration_id}</td>
                                            <EditableField type="select" name="group_id" value={registration.group_id} onChange={(e) => handleChange(registration.registration_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} options={groups.map(group => ({ value: group.group_id, label:  `${group.group_id} ${group.group_name}` }))} />
                                            <EditableField type="select" name="camp_id" value={registration.camp_id} onChange={(e) => handleChange(registration.registration_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} options={camps.map(camp => ({ value: camp.camp_id, label: `${camp.camp_id} ${camp.camp_name}` }))} />
                                            <EditableField type="select" name="user_id" value={registration.user_id} onChange={(e) => handleChange(registration.registration_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} options={users.map(user => ({ value: user.user_id, label: `${user.user_id} ${user.username}` }))} />
                                            <EditableField type="select" name="camper_type" value={registration.camper_type} onChange={(e) => handleChange(registration.registration_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} options={[{ value: 'Youth', label: 'Youth' }, { value: 'Adult Leader', label: 'Adult Leader' }]} />
                                            <EditableField type="date" name="registration_date" value={formatDateForInput(registration.registration_date)} onChange={(e) => handleChange(registration.registration_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="select" name="status" value={registration.status} onChange={(e) => handleChange(registration.registration_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} options={[{ value: 'Registered', label: 'Registered' }, { value: 'Unpaid', label: 'Unpaid' }, { value: 'Cancelled', label: 'Cancelled' }]} />
                                        </>
                                    ) : (
                                        <>
                                            <td>{registration.registration_id}</td>
                                            <td>{registration.group_id}</td>
                                            <td>{registration.camp_id}</td>
                                            <td>{registration.user_id}</td>
                                            <td>{registration.camper_type}</td>
                                            <td>{formatDateDisplay(registration.registration_date)}</td>
                                            <td>{registration.status}</td>
                                        </>
                                    )}
                                    <td className="px-4 py-3">
                                        {isEditing === registration.registration_id ? (
                                            <div>
                                                <button onClick={() => handleSave(registration.registration_id)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                                                <button onClick={() => setIsEditing(null)}
                                                    className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                                            </div>
                                        ) : (
                                            <div>
                                                <button onClick={() => toggleEdit(registration.registration_id)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                                                <button onClick={() => handleDeleteRegistration(registration.registration_id)}
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
};

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


export default ManageRegistrations;
