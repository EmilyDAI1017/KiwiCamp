import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignAcToCamps = () => {
    const [camps, setCamps] = useState([]);
    const [activities, setActivities] = useState([]);
    const [selectedCamp, setSelectedCamp] = useState('');
    const [selectedActivity, setSelectedActivity] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPendingCamps();
        fetchActivities();
    }, []);

    const fetchPendingCamps = () => {
        axios.get('http://localhost:3000/admin/manage_camps?status=Pending')
            .then(response => {
                setCamps(response.data);
            })
            .catch(error => console.error('Error fetching camps:', error));
    };

    const fetchActivities = () => {
        axios.get('http://localhost:3000/admin/activities')
            .then(response => {
                setActivities(response.data);
            })
            .catch(error => console.error('Error fetching activities:', error));
    };

    const handleAssign = () => {
        if (!selectedCamp || !selectedActivity) {
            alert('Please select both a camp and an activity');
            return;
        }

        setIsLoading(true);
        axios.post('http://localhost:3000/admin/camp_activities', {
            camp_id: selectedCamp,
            activity_id: selectedActivity
        })
            .then(response => {
                alert('Activity assigned to camp successfully');
                setSelectedCamp('');
                setSelectedActivity('');
            })
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    alert('Activity already assigned to this camp');
                } else {
                    console.error('Error assigning activity to camp:', error);
                    alert('Failed to assign activity to camp');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="main-content">
            <h1 className="text-xl font-bold mb-4">Assign Activities to Camps</h1>
            <div className="assign-form my-4">
                <label className="block text-sm font-medium text-gray-700">Select Camp</label>
                <select
                    value={selectedCamp}
                    onChange={(e) => setSelectedCamp(e.target.value)}
                    className="form-select rounded-md shadow-sm mt-1 block w-full"
                >
                    <option value="">Select Camp</option>
                    {camps.map(camp => (
                        <option key={camp.camp_id} value={camp.camp_id}>
                            {camp.camp_name} - {camp.location}
                        </option>
                    ))}
                </select>
                <label className="block text-sm font-medium text-gray-700">Select Activity</label>
                <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="form-select rounded-md shadow-sm mt-1 block w-full"
                >
                    <option value="">Select Activity</option>
                    {activities.map(activity => (
                        <option key={activity.activity_id} value={activity.activity_id}>
                            {activity.name}
                        </option>
                    ))}
                </select>
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                    onClick={handleAssign}
                    disabled={isLoading}
                >
                    {isLoading ? 'Assigning...' : 'Assign Activity'}
                </button>
            </div>

            {selectedCamp && <CampActivities campId={selectedCamp} />}
        </div>
    );
};

export default AssignAcToCamps;


const CampActivities = ({ campId }) => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (campId) {
            fetchCampActivities(campId);
        }
    }, [campId]);

    const fetchCampActivities = (campId) => {
        setIsLoading(true);
        axios.get(`http://localhost:3000/admin/camps/${campId}/activities`)
            .then(response => {
                setActivities(response.data);
            })
            .catch(error => {
                if (error.response.status === 409) {
                   alert('The activity already assigned to this camp')
                }

                console.error('Error fetching activities for camp:', error);
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="activities-list mt-4">
            <h2 className="text-lg font-bold mb-2">Activities for Camp {campId}</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : activities.length === 0 ? (
                <p>No activities assigned to this camp</p>
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
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map(activity => (
                            <tr key={activity.activity_id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-1 py-3">{activity.activity_id}</td>
                                <td>{activity.name}</td>
                                <td>{activity.duration}</td>
                                <td>{activity.description}</td>
                                <td>{activity.cost}</td>
                                <td>{activity.capacity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};