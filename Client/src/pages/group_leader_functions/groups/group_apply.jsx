import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import { useUser } from '../../../contexts/UserContext';



const GroupApplication = () => {
    const { user } = useUser();
    const user_id = user.id;
    console.log("User ID:", user_id);

    const [previousApplications, setPreviousApplications] = useState([]);
    const [appliedGroups, setAppliedGroups] = useState([]);
    const [approvedGroups, setApprovedGroups] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentField, setCurrentField] = useState(null);

    const fetchGroupData = (user_id) => {
        axios.get(`http://localhost:3000/group_leader/groups_applications/${user_id}`)
            .then(response => {
                const { previous, applied, approved } = response.data;
                setPreviousApplications(previous || []);
                setAppliedGroups(applied || []);
                setApprovedGroups(approved || []);
            })
            .catch(error => console.error("Error fetching group data:", error));
    };

    useEffect(() => {
        if (user && user.id) {
            fetchGroupData(user.id);
        }
    }, [user]);


    const handleInputChange = useCallback(
        debounce((id, name, value, groupType) => {
            updateGroupState(id, name, value, groupType);
        }, 300),
        []
    );

    const updateGroupState = (id, name, value, groupType) => {
        switch (groupType) {
            case 'previous':
                setPreviousApplications(prevGroups =>
                    prevGroups.map(group =>
                        group.group_id === id ? { ...group, [name]: value } : group
                    )
                );
                break;
            case 'applied':
                setAppliedGroups(prevGroups =>
                    prevGroups.map(group =>
                        group.group_id === id ? { ...group, [name]: value } : group
                    )
                );
                break;
            case 'approved':
                setApprovedGroups(prevGroups =>
                    prevGroups.map(group =>
                        group.group_id === id ? { ...group, [name]: value } : group
                    )
                );
                break;
            default:
                break;
        }
    };

    const handleChange = (id, name, value, groupType) => {
        updateGroupState(id, name, value, groupType);
        handleInputChange(id, name, value, groupType);
    };

    const handleSave = (id, groupType) => {
        setIsLoading(true);
        const group = [...previousApplications, ...appliedGroups, ...approvedGroups].find(group => group.group_id === id);

        axios.put(`http://localhost:3000/group_leader/groups_applications/${id}`, group)
            .then(response => {
                setIsEditing(null);
                alert('Group profile updated successfully');
                fetchGroupData();
            })
            .catch(error => {
                console.error('Error updating group:', error);
                alert('Failed to update group profile');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleCancelApplication = (id) => {
        axios.put(`http://localhost:3000/group_leader/groups/cancel/${id}`)
            .then(response => {
                alert('Application is cancelled successfully');
                fetchGroupData();
            })
            .catch(error => {
                console.error('Error cancelling application:', error);
                alert('Failed to cancel application');
            });
    };

    const handleSearch = () => {
        setSearchTerm(searchInput.toLowerCase());
    };

    const toggleEdit = (id) => {
        setIsEditing(prevState => prevState === id ? null : id);
    };

    const filteredGroups = (groups) => {
        return groups.filter(group =>
            group.group_id.toString().includes(searchTerm) ||
            group.group_leader_id.toString().includes(searchTerm) ||
            group.group_status.toLowerCase().includes(searchTerm)
        );
    };

//Apply a new group
const [newGroup, setNewGroup] = useState({
    group_name: '',
    number_of_attendees: '',
    description: '',
    group_status: 'Pending'
});

const handleNewGroupChange = (e) => {
    const { name, value } = e.target;
    setNewGroup(prevState => ({ ...prevState, [name]: value }));
};

const handleApplyGroup = () => {
    axios.post(`http://localhost:3000/group_leader/groups_apply/${user_id}`, newGroup) // Send user_id as a parameter
        .then(response => {
            alert("Group application submitted successfully");
            fetchGroupData(user_id); // Refresh data after application
            setNewGroup({
                group_name: '',
                number_of_attendees: '',
                description: '',
                group_status: 'Pending'
            });
        })
        .catch(error => {
            console.error('Error applying for group:', error);
            alert('Failed to apply for group');
        });

};

    return (
        <div className='main-content'>

            <h1>Manager Groups</h1>

            <div>
    <h2>Apply for a New Group</h2>
    <div>
        <p></p>
        <input
            type="text"
            name="group_name"
            placeholder="Group Name"
            value={newGroup.group_name}
            onChange={handleNewGroupChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
        />
        <input
            type="number"
            name="number_of_attendees"
            placeholder="Number of Attendees"
            value={newGroup.number_of_attendees}
            onChange={handleNewGroupChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
        />
        <textarea
            name="description"
            placeholder="Description"
            value={newGroup.description}
            onChange={handleNewGroupChange}
            className="form-textarea rounded-md shadow-sm mt-1 block w-full"
        />
        <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
            onClick={handleApplyGroup}
        >
            Apply for Group
        </button>
    </div>
</div>


            <div className="search-container my-4">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-input rounded-md shadow-sm mt-1 w-1/3"
                    placeholder="Search groups by ID/leader/status..."
                />
                
                <button
                    className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <GroupBlock
                    title="Previous Group Applications"
                    groups={filteredGroups(previousApplications)}
                    groupType="previous"
                    isEditing={isEditing}
                    currentField={currentField}
                    handleChange={handleChange}
                    handleSave={handleSave}
                    toggleEdit={toggleEdit}
                    setCurrentField={setCurrentField}
                />
                <GroupBlock
                    title="Applied Groups"
                    groups={filteredGroups(appliedGroups)}
                    groupType="applied"
                    isEditing={isEditing}
                    currentField={currentField}
                    handleChange={handleChange}
                    handleSave={handleSave}
                    toggleEdit={toggleEdit}
                    setCurrentField={setCurrentField}
                    handleCancelApplication={handleCancelApplication}
                />
                <GroupBlock
                    title="Approved Groups"
                    groups={filteredGroups(approvedGroups)}
                    groupType="approved"
                    isEditing={isEditing}
                    currentField={currentField}
                    handleChange={handleChange}
                    handleSave={handleSave}
                    toggleEdit={toggleEdit}
                    setCurrentField={setCurrentField}
                />
            </div>
        </div>
    );
};

const GroupBlock = ({ title, groups, groupType, isEditing, currentField, handleChange, handleSave, toggleEdit, setCurrentField, handleCancelApplication }) => {
    return (
        <div>
            <h2>{title}</h2>
            {groups.length > 0 ? (
                groups.map(group => (
                    <div key={group.group_id}>
                        {isEditing === group.group_id ? (
                            <>
                                <EditableField type="text" name="camp_id" value={group.camp_id} onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value, groupType)} setCurrentField={setCurrentField} currentField={currentField} />
                                <EditableField type="text" name="number_of_attendees" value={group.number_of_attendees} onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value, groupType)} setCurrentField={setCurrentField} currentField={currentField} />
                                <EditableField type="select" name="group_status" value={group.group_status} onChange={(e) => handleChange(group.group_id, e.target.name, e.target.value, groupType)} setCurrentField={setCurrentField} currentField={currentField} options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }, { value: "Pending", label: "Pending" }]} />
                            </>
                        ) : (
                            <>
                                <p>Group Name: {group.group_name}</p>
                                <p>Camp ID: {group.camp_id}</p>
                                <p>Number of Attendees: {group.number_of_attendees}</p>
                                <p>Description: {group.description}</p>
                                <p>Status: {group.group_status}</p>
                            </>
                        )}
                        <div>
                            {isEditing === group.group_id ? (
                                <div>
                                    <button onClick={() => handleSave(group.group_id, groupType)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                                    <button onClick={() => toggleEdit(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    {/* {groupType === 'applied' && (
                                        // <button onClick={() => handleCancelApplication(group.group_id)} className="bg-red-500 text-white px-2 py-1 rounded">Cancel Application</button>
                                    )} */}
                                    {groupType === 'approved' && (
                                        <Link to={`/group_leader_functions/groups/manage_groups/${group.group_id}`} className="bg-green-500 text-white px-2 py-1 rounded">Manage Group</Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No {title.toLowerCase()}.</p>
            )}
        </div>
    );
};

const EditableField = ({ type = "text", name, value, onChange, setCurrentField, currentField, options = [] }) => {
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
        );
    }

    return (
        <input
            type={type}
            name={name}
            value={inputValue}
            onChange={handleLocalChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
            autoComplete="off"
            ref={inputRef}
        />
    );
};

export default GroupApplication;
