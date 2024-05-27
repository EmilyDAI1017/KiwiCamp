import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../../contexts/UserContext';

const GroupApplication = () => {
    const { user } = useUser();
    const user_id = user.id;
    const navigate = useNavigate();

    const [previousApplications, setPreviousApplications] = useState([]);
    const [appliedGroups, setAppliedGroups] = useState([]);
    const [approvedGroups, setApprovedGroups] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSearch = () => {
        setSearchTerm(searchInput.toLowerCase());
    };

    const filteredGroups = (groups) => {
        return groups.filter(group =>
            group.group_id.toString().includes(searchTerm) ||
            group.group_name.toLowerCase().includes(searchTerm) ||
            group.group_leader_id.toString().includes(searchTerm) ||
            group.group_status.toLowerCase().includes(searchTerm) ||
            group.payment_status.toLowerCase().includes(searchTerm) // Include payment status in search
        );
    };

    const handleCancelApplication = (id) => {
        axios.put(`http://localhost:3000/group_leader/groups/cancel/${id}`)
            .then(response => {
                alert('Application is cancelled successfully');
                fetchGroupData(user_id);
            })
            .catch(error => {
                console.error('Error cancelling application:', error);
                alert('Failed to cancel application');
            });
    };

    const handlePay = (group, camp) => {
        navigate('/groups/payment', { state: { group, camp, user_id, group_id: group.group_id } });
    };

    return (
        <div className='main-content'>
            <h1>Manage Groups</h1>

            <div>
                <h2 className='mb-5'>Apply for a New Group</h2>
                <div>
                    <Link
                        to={`/group_leader_functions/groups/group_application_form/${user_id}`}
                        className="mt-2 mb-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
                    >
                        Apply for a New Group
                    </Link>
                </div>
            </div>

            <div className="search-container my-4">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-input rounded-md shadow-sm mt-1 w-1/3"
                    placeholder="Search groups by group ID/name/status/payment status..."
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
                    handleCancelApplication={handleCancelApplication}
                    handlePay={handlePay}
                />
                <GroupBlock
                    title="Applied Groups"
                    groups={filteredGroups(appliedGroups)}
                    groupType="applied"
                    handleCancelApplication={handleCancelApplication}
                    handlePay={handlePay}
                />
                <GroupBlock
                    title="Approved Groups"
                    groups={filteredGroups(approvedGroups)}
                    groupType="approved"
                    handleCancelApplication={handleCancelApplication}
                    handlePay={handlePay}
                />
            </div>
        </div>
    );
};

const GroupBlock = ({ title, groups, groupType, handleCancelApplication, handlePay }) => {
    return (
        <div>
            <h2>{title}</h2>
            {groups.length > 0 ? (
                groups.map(group => (
                    <div key={group.group_id} className="mb-4 p-4 border rounded">
                        <p>Group Name: {group.group_name}</p>
                        <p>Camp ID: {group.camp_id}</p>
                        <p>Number of Attendees: {group.number_of_attendees}</p>
                        <p>Description: {group.description}</p>
                        <p>Status: {group.group_status}</p>
                        <p>Payment Status: {group.payment_status}</p> {/* Display payment status */}
                        <p>Camp Name: {group.camp_name}</p> {/* Display camp name */}
                        <p>Price: {group.price}</p> {/* Display camp price */}
                        <p>Registration Fee For Youth Campers: {group.registration_fee_youth}</p>
                        <p>Registration Fee For Adult Campers: {group.registration_fee_adult}</p>
                        <div>
                            {groupType === 'applied' && (
                                <>
                                    <button onClick={() => handleCancelApplication(group.group_id)} className="bg-red-500 text-white px-2 py-1 rounded mr-2">Cancel Application</button>
                                    {group.payment_status === 'Unpaid' && (
                                        <button onClick={() => handlePay(group, { camp_id: group.camp_id, camp_name: group.camp_name, price: group.price })} className="bg-yellow-500 text-white px-2 py-1 rounded">Pay</button>
                                    )}
                                </>
                            )}
                            {groupType === 'approved' && (
                                <Link to={`/group_leader_functions/groups/manage_groups/${group.group_id}`} className="bg-green-500 text-white px-2 py-1 rounded">Manage Group</Link>
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

export default GroupApplication;
