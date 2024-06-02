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
        registration_fee_youth: '',
        registration_fee_adult: '',
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
        <div className='main-content p-20' 
        style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
        height: '100%'
        }}>
            <div className=" mx-2 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl text-green-700 font-bold mb-6">Group Information</h1>
                <div className="space-y-4">
                    <label className="block text-green-700 font-semibold mb-2">Group Name</label>
                    <input
                        type="text"
                        name="group_name"
                        placeholder="Group Name"
                        value={newGroup.group_name}
                        onChange={handleNewGroupChange}
                        className="form-input rounded-md shadow-sm w-3/6 p-3"
                    />
                    <label className="block text-green-700 font-semibold mb-2">Number of Attendees</label>
                    <input
                        type="number"
                        name="number_of_attendees"
                        placeholder="Number of Attendees"
                        value={newGroup.number_of_attendees}
                        onChange={handleNewGroupChange}
                        className="form-input rounded-md shadow-sm w-3/6 p-3"
                    />
                    <label className="block text-green-700 font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={newGroup.description}
                        onChange={handleNewGroupChange}
                        className="form-textarea rounded-md shadow-sm w-3/6 p-3"
                    />
                    <label className="block text-green-700 font-semibold mb-2">Registration Fees for Youth Campers</label>
                    <input
                        type="number"
                        name="registration_fee_youth"
                        placeholder='Registration Fee for Youth Campers'
                        value={newGroup.registration_fee_youth}
                        onChange={handleNewGroupChange}
                        className="form-input rounded-md shadow-sm w-3/6 p-3"
                    />
                    <label className="block text-green-700 font-semibold mb-2">Registration Fees for Adult Campers</label>
                    <input
                        type="number"
                        name="registration_fee_adult"
                        placeholder='Registration Fee for Adult Campers'
                        value={newGroup.registration_fee_adult}
                        onChange={handleNewGroupChange}
                        className="form-input rounded-md shadow-sm w-3/6 p-3"
                    />
                    <div className="mt-2">
                        <label className="block text-green-700 font-semibold mb-2">Select a Camp</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {camps.length > 0 ? (
                                camps.map(camp => (
                                    <label
                                        key={camp.camp_id}
                                        className={`block border p-1 rounded-md shadow-sm cursor-pointer ${
                                            newGroup.camp_id === camp.camp_id ? 'border-green-500 bg-green-50' : 'hover:bg-blue-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="camp_id"
                                            value={camp.camp_id}
                                            checked={newGroup.camp_id === camp.camp_id}
                                            onChange={() => handleNewGroupChange({ target: { name: 'camp_id', value: camp.camp_id } })}
                                            className="hidden"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-lg">{camp.camp_name}</h3>
                                            <p><span className="font-semibold">Location:</span> {camp.location}</p>
                                            <p><span className="font-semibold">Capacity:</span> {camp.capacity}</p>
                                            <p><span className="font-semibold">Start Date:</span> {formatDateDisplay(camp.start_date)}</p>
                                            <p><span className="font-semibold">End Date:</span> {formatDateDisplay(camp.end_date)}</p>
                                            <p><span className="font-semibold">Schedule:</span> {camp.schedule}</p>
                                            <p><span className="font-semibold">Description:</span> {camp.description}</p>
                                            <p><span className="font-semibold">Price:</span> ${camp.price}</p>
                                        </div>
                                    </label>
                                ))
                            ) : (
                                <p className="mt-4 text-red-500">No active camps available currently</p>
                            )}
                        </div>
                    </div>
                    <div className=" space-x-4 mt-6">
                        <button
                        className="inline-block mt-2 mb-4 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
                        onClick={handleApplyGroup}
                        >
                            Apply for Group
                        </button>
                        <button
                    className="mb-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
                    onClick={() => navigate(-1)} // Go back to the previous page
                        >
                            Back
                        </button>
                    </div>
                </div>
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
