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
        <div className="main-content bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100%'
        }}>
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold text-green-700 mb-8">Manage Groups</h1>

                <div className="mb-8">
                    <Link
                        to={`/group_leader_functions/groups/group_application_form/${user_id}`}
                        className="inline-block mt-2 mb-4 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
                    >
                        Apply for a New Group
                    </Link>
                </div>



                <div className="mb-8">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="form-input rounded-md shadow-sm mt-1 pr-2 w-full md:w-1/3 h-10"
                        placeholder="Search groups by group ID/name/status/payment status..."
                    />
                    <button
                        className="bg-blue-600 hover:bg-blue-900 text-white font-bold ml-3 py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                        onClick={handleSearch}
                    >
                        Search
                    </button>


                </div>

                <button
                    className="mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
                    onClick={() => navigate(-1)} // Go back to the previous page
                >
                    Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GroupBlock
                        title="Approved Groups"
                        groups={filteredGroups(approvedGroups)}
                        groupType="approved"
                        handleCancelApplication={handleCancelApplication}
                        handlePay={handlePay}
                        navigate={navigate}
                    />
                    <GroupBlock
                        title="Applied Groups"
                        groups={filteredGroups(appliedGroups)}
                        groupType="applied"
                        handleCancelApplication={handleCancelApplication}
                        handlePay={handlePay}
                        navigate={navigate}
                    />
                    <GroupBlock
                        title="Previous Group Applications"
                        groups={filteredGroups(previousApplications)}
                        groupType="previous"
                        handleCancelApplication={handleCancelApplication}
                        handlePay={handlePay}
                    />
                </div>
            </div>
        </div>
    );
};

const GroupBlock = ({ title, groups, groupType, handleCancelApplication, handlePay, navigate }) => {
    const handleManageGroupClick = (group) => {
        navigate(`/group_leader_functions/groups/manage_groups/${group.group_id}`, { state: { campId: group.camp_id } });
    };

    return (
        <div className="p-4 bg-white bg-opacity-90 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {groups.length > 0 ? (
                groups.map(group => (
                    <div key={group.group_id} className="mb-4 p-6 border rounded-lg shadow-md">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><span className="font-semibold">Group Name:</span> {group.group_name}</p>
                                <p><span className="font-semibold">Camp ID:</span> {group.camp_id}</p>
                                <p><span className="font-semibold">Number of Attendees:</span> {group.number_of_attendees}</p>
                                <p><span className="font-semibold">Description:</span> {group.description}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Status:</span> {group.group_status}</p>
                                <p><span className="font-semibold">Payment Status:</span> {group.payment_status}</p>
                                <p><span className="font-semibold">Camp Name:</span> {group.camp_name}</p>
                                <p><span className="font-semibold">Price:</span> {group.price}</p>
                                <p><span className="font-semibold">Registration Fee (Youth):</span> {group.registration_fee_youth}</p>
                                <p><span className="font-semibold">Registration Fee (Adult):</span> {group.registration_fee_adult}</p>
                            </div>
                        </div>
                        <div className="mt-4 space-x-2">
                            {groupType === 'approved' && (
                                <button
                                    onClick={() => handleManageGroupClick(group)}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                                >
                                    Manage Group
                                </button>
                            )}
                            {groupType === 'applied' && (
                                <>
                                    <button
                                        onClick={() => handleCancelApplication(group.group_id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                                    >
                                        Cancel Application
                                    </button>
                                    {group.payment_status === 'Unpaid' && (
                                        <button
                                            onClick={() => handlePay(group, { camp_id: group.camp_id, camp_name: group.camp_name, price: group.price })}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-200"
                                        >
                                            Pay
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No {title.toLowerCase()}.</p>
            )}
        </div>
    );
};

export default GroupApplication;
