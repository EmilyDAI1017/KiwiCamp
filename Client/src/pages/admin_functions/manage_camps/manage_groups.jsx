import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const ManageGroups = () => {
    const [groups, setGroups] = useState([]);
    const [groupLeaders, setGroupLeaders] = useState([]);
    const [camps, setCamps] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentField, setCurrentField] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newGroup, setNewGroup] = useState({
        group_leader_id: '',
        camp_id: '',
        number_of_attendees: '',
        group_name: '',
        description: '',
        group_status: 'Active'
    });

    const fetchGroups = () => {
        setIsLoading(true);
        axios.get('http://localhost:3000/admin/manage_groups')
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => console.error('Error fetching groups:', error))
            .finally(() => setIsLoading(false));
    };

    const fetchGroupLeaders = () => {
        axios.get('http://localhost:3000/admin/group_leaders')
            .then(response => {
                setGroupLeaders(response.data);
            })
            .catch(error => console.error('Error fetching group leaders:', error));
    };

    const fetchCamps = () => {
        axios.get('http://localhost:3000/admin/camps')
            .then(response => {
                setCamps(response.data);
            })
            .catch(error => console.error('Error fetching camps:', error));
    };

    useEffect(() => {
        fetchGroups();
        fetchGroupLeaders();
        fetchCamps();
    }, []);

    const handleInputChange = useCallback(
        debounce((id, name, value) => {
            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group.group_id === id ? { ...group, [name]: value } : group
                )
            );
        }, 300),
        []
    );

    const handleChange = (id, name, value) => {
        setGroups(prevGroups =>
            prevGroups.map(group =>
                group.group_id === id ? { ...group, [name]: value } : group
            )
        );
        handleInputChange(id, name, value);
    };

    const handleNewGroupChange = (e) => {
        const { name, value } = e.target;
        setNewGroup(prevState => ({ ...prevState, [name]: value }));
    };

    const validateGroup = (group) => {
        if (!group.group_leader_id || !group.group_name || !group.group_status) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const handleSave = async (id) => {
        setIsLoading(true);
        const group = groups.find(group => group.group_id === id);
        const updatedGroup = { ...group };

        if (!validateGroup(updatedGroup)) {
            setIsLoading(false);
            return;
        }

        try {
            await axios.put(`http://localhost:3000/admin/manage_groups/${id}`, updatedGroup);
            setIsEditing(null);
            alert('Group profile updated successfully');
            fetchGroups();

            if (updatedGroup.group_status === 'Active') {
                const leader = groupLeaders.find(leader => leader.group_leader_id === updatedGroup.group_leader_id);
                if (leader) {
                    sendNewsToGroupLeader(leader.user_id, 'Group Application Approved', `Your group "${updatedGroup.group_name}" has been approved and is now active.`);
                }
                console.log(updatedGroup.camp_id)
                await axios.put(axios.put(`http://localhost:3000/admin/camps/${updatedGroup.camp_id}`, { camp_status: 'Pending' }))
                fetchCamps(); // Fetch updated camp data
            }

        } finally {
            setIsLoading(false);
        }
    };

    const sendNewsToGroupLeader = (receiverId, title, content) => {
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

    const handleSearch = () => {
        setSearchTerm(searchInput.toLowerCase());
    };

    const handleAddGroup = () => {
        if (!validateGroup(newGroup)) {
            return;
        }

        axios.post('http://localhost:3000/admin/manage_groups', newGroup)
            .then(response => {
                alert("Group added successfully");
                fetchGroups();
                setNewGroup({
                    group_leader_id: '',
                    camp_id: '',
                    number_of_attendees: '',
                    group_name: '',
                    description: '',
                    group_status: 'Active',
                    registration_fee_youth: '',
                    registration_fee_adult: '',
                    payment_status: 'Unpaid'
                });
                setShowAddForm(false);
            })
            .catch(error => {
                console.error('Error adding group:', error);
                alert('Failed to add group');
            });
    };

    const handleDeleteGroup = (id) => {
        if (!window.confirm('Are you sure you want to delete this group?')) {
            return;
        }

        axios.delete(`http://localhost:3000/admin/manage_groups/${id}`)
            .then(response => {
                alert("Group deleted successfully");
                fetchGroups();
            })
            .catch(error => {
                console.error('Error deleting group:', error);
                alert('Failed to delete group');
            });
    };

    const filteredGroups = groups.filter(group =>
        group.group_name.toLowerCase().includes(searchTerm) ||
        group.description.toLowerCase().includes(searchTerm)
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
            <h1 className="text-xl font-bold mb-4">Manage Groups</h1>
            <div className="search-container my-4">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-input rounded-md shadow-sm mt-1 w-1/3"
                    placeholder="Search groups by name/description..."
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
                {showAddForm ? 'Hide Add Group Form' : 'Show Add Group Form'}
            </button>
            {showAddForm && (
                <div className="new-group-form my-4">
                    <h2 className="text-lg font-bold mb-2">Add New Group</h2>
                    <select
                        name="group_leader_id"
                        value={newGroup.group_leader_id}
                        onChange={handleNewGroupChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="">Select Group Leader</option>
                        {groupLeaders.map(leader => (
                            <option key={leader.group_leader_id} value={leader.group_leader_id}>
                                {leader.first_name} {leader.last_name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="camp_id"
                        value={newGroup.camp_id}
                        onChange={handleNewGroupChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="">Select Camp</option>
                        {camps.map(camp => (
                            <option key={camp.camp_id} value={camp.camp_id}>
                                {camp.location} ({camp.start_date} - {camp.end_date})
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="number_of_attendees"
                        placeholder="Number of Attendees"
                        value={newGroup.number_of_attendees}
                        onChange={handleNewGroupChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <input
                        type="text"
                        name="group_name"
                        placeholder="Group Name"
                        value={newGroup.group_name}
                        onChange={handleNewGroupChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newGroup.description}
                        onChange={handleNewGroupChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <input
                        type="number"
                        name="registration_fee_youth"
                        placeholder="Registration Fee (Youth Camper)"
                        value={newGroup.registration_fee_youth}
                        onChange={handleNewGroupChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                                   <input
                        type="number"
                        name="registration_fee_adult"
                        placeholder="Registration Fee (Adult Leader)"
                        value={newGroup.registration_fee_adult}
                        onChange={handleNewGroupChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />


                    <select
                        name="payment_status"
                        value={newGroup.payment_status}
                        onChange={handleNewGroupChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    />
                    <select
                        name="group_status"
                        value={newGroup.group_status}
                        onChange={handleNewGroupChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={handleAddGroup}
                    >
                        Add Group
                    </button>
                </div>
            )}
            <div className="group-list mt-4">
                {filteredGroups.length === 0 ? (
                    <p>No groups found</p>
                ) : (
                    <table className="table-auto w-full text-left whitespace-no-wrap">
                        <thead>
                            <tr className="font-semibold text-gray-700 bg-gray-100">
                                <th className="px-2 py-3">Group Number</th>
                                <th className="px-2 py-3">Leader Contact Number</th>
                                <th className="px-2 py-3">Leader ID</th>
                                <th className="px-2 py-3">Leader Name</th>
                                <th className="px-2 py-3">Camp ID</th>
                                <th className="px-2 py-3">Attendees</th>
                                <th className="px-2 py-3">Group Name</th>
                                <th className="px-2 py-3">Description</th>
                                <th className="px-2 py-3">Registration Fee(Youth Camper)</th>
                                <th className="px-2 py-3">Registration Fee(Adult Leader)</th>
                                <th className="px-2 py-3">Payment Status</th>

                                <th className="px-2 py-3">Status</th>
                                
                                <th className="px-2 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGroups.map(group => (
                                <tr key={group.group_id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-2 py-3">{group.group_id}</td>
                                    <td className="px-2 py-3">{groupLeaders.find(leader => leader.group_leader_id === group.group_leader_id)?.phone_num || ''}</td>
                                    <td className="px-2 py-3">{group.group_leader_id}</td>
                                    <td className="px-2 py-3">{groupLeaders.find(leader => leader.group_leader_id === group.group_leader_id)?.first_name + ' ' + groupLeaders.find(leader => leader.group_leader_id === group.group_leader_id)?.last_name || ''}</td>
                                    {isEditing === group.group_id ? (
                                        <>
                                            <EditableField type="select" name="camp_id" value={group.camp_id} onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} options={camps.map(camp => ({ value: camp.camp_id , label: camp.camp_id }))} />
                                            <EditableField type="text" name="number_of_attendees" value={group.number_of_attendees} onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="text" name="group_name" value={group.group_name} onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="text" name="description" value={group.description} onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="number" name="registration_fee_youth" value={group.registration_fee_youth} onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="number" name="registration_fee_adult" value={group.registration_fee_adult} onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                          <EditableField
                                                type="select"
                                                name="payment_status"
                                                value={group.payment_status}
                                                onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value)}
                                                setCurrentField={setCurrentField}
                                                currentField={currentField}
                                                options={[
                                                    { value: "Unpaid", label: "Unpaid" },
                                                    { value: "Paid", label: "Paid" },
                                                ]}
                                            />

                                            <EditableField
                                                type="select"
                                                name="group_status"
                                                value={group.group_status}
                                                onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value)}
                                                setCurrentField={setCurrentField}
                                                currentField={currentField}
                                                options={[
                                                    { value: "Active", label: "Active" },
                                                    { value: "Inactive", label: "Inactive" },
                                                    { value: "Pending", label: "Pending" }
                                                ]}
                                            />
                                        </>

                                    ) : (
                                        <>
                                   
                                            <td>{group.camp_id}</td>
                                            <td>{group.number_of_attendees}</td>
                                            <td>{group.group_name}</td>
                                            <td>{group.description}</td>
                                            <td>{group.registration_fee_youth}</td>
                                            <td>{group.registration_fee_adult}</td>
                                            <td>{group.payment_status}</td>
                                            <td>{group.group_status}</td>
                                        </>
                                    )}
                                    <td className="px-4 py-3">
                                        {isEditing === group.group_id ? (
                                            <div>
                                                <button onClick={() => handleSave(group.group_id)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                                                <button onClick={() => setIsEditing(null)}
                                                    className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                                            </div>
                                        ) : (
                                            <div>
                                                <button onClick={() => toggleEdit(group.group_id)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                                                <button onClick={() => handleDeleteGroup(group.group_id)}
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

export default ManageGroups;
