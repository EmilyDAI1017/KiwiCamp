import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import '../../../App.css';

const GroupApplicationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [newGroup, setNewGroup] = useState({
        group_name: '',
        number_of_attendees: '',
        description: '',
        group_status: 'Pending',
        camp_id: ''
    });

    const [camps, setCamps] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/group_leader/group_apply/get_camps_information')
            .then(response => {
                setCamps(response.data);
            })
            .catch(error => {
                console.error('Error fetching camps:', error);
            });
    }, []);

    const handleNewGroupChange = (e) => {
        const { name, value } = e.target;
        setNewGroup(prevState => ({ ...prevState, [name]: value }));
    };

    const handleApplyGroup = () => {
        const selectedCamp = camps.find(camp => camp.camp_id === newGroup.camp_id);
        if (selectedCamp && selectedCamp.capacity < newGroup.number_of_attendees) {
            alert(`The camp ${selectedCamp.location} cannot accommodate ${newGroup.number_of_attendees} attendees.`);
            return;
        }

        axios.post(`http://localhost:3000/group_leader/group_apply/${id}`, newGroup)
            .then(response => {
                const groupId = response.data.group_id;
                alert("Group application submitted successfully");
                navigate('/groups/payment', {
                    state: {
                        group: newGroup,
                        camp: selectedCamp,
                        camp_id: newGroup.camp_id,
                        user_id: id,
                        group_id: groupId
                    }
                });
            })
            .catch(error => {
                console.error('Error applying for group:', error);
                alert('Failed to apply for group');
            });
    };

    return (
        <div className='main-content'>
            <h1>Apply for a New Group</h1>
            <div>
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
                <input
                    type="number"
                    placeholder='Registration Fee for Youth Campers'
                    value={newGroup.registration_fee_youth}
                    onChange={handleNewGroupChange}
                    className="form-input rounded-md shadow-sm mt-1 block w-full"
                />
                <input
                    type="number"
                    placeholder='Registration Fee for Adult Campers'
                    value={newGroup.registration_fee_adult}
                    onChange={handleNewGroupChange}
                    className="form-input rounded-md shadow-sm mt-1 block w-full"
                />
                <div>
            <label className="block mt-4 font-semibold">Select a Camp</label>
            <div className="camp-selection">
                {camps.length > 0 ? (
                    camps.map(camp => (
                        <label
                            key={camp.camp_id}
                            className={`block border p-4 rounded-md shadow-sm mb-4 ${
                                newGroup.camp_id === camp.camp_id ? 'selected' : ''
                            }`}
                        >
                            <input
                                type="radio"
                                name="camp_id"
                                value={camp.camp_id}
                                checked={newGroup.camp_id === camp.camp_id}
                                onChange={() => handleNewGroupChange({ target: { name: 'camp_id', value: camp.camp_id } })}
                                className="mr-2 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <div>
                                <h3 className="font-semibold">{camp.camp_name}</h3>
                                <p>Location: {camp.location}</p>
                                <p>Capacity: {camp.capacity}</p>
                                <p>Start Date: {formatDateDisplay(camp.start_date)}</p>
                                <p>End Date: {formatDateDisplay(camp.end_date)}</p>
                                <p>Schedule: {camp.schedule}</p>
                                <p>Description: {camp.description}</p>
                                <p>Price: ${camp.price}</p>
                            </div>
                        </label>
                    ))
                ) : (
                    <p className="mt-4 text-red-500">No active camps available currently</p>
                )}
            </div>
        </div>
                <button
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none"
                    onClick={handleApplyGroup}
                >
                    Apply for Group
                </button>
                
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                    onClick={() => navigate(-1)} // Go back to the previous page
                >
                    Back
                </button>
            </div>
        </div>
    );
};

function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
}

export default GroupApplicationForm;
