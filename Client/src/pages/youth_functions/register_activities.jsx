import React, { useState, useEffect } from 'react';
import "../../App.css";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const RegisterActivities = () => {
    const { user_id } = useParams();
    const [campDetails, setCampDetails] = useState(null);
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCampDetails();
    }, []);

    const fetchCampDetails = () => {
        setIsLoading(true);
        axios.get(`http://localhost:3000/youth/camp_details/${user_id}`)
            .then(response => {
                setCampDetails(response.data.campDetails);
                setActivities(response.data.activities);
            })
            .catch(error => console.error('Error fetching camp details:', error))
            .finally(() => setIsLoading(false));
    };

    const handleActivitySelect = (activityId, cost) => {
        if (selectedActivities.includes(activityId)) {
            setSelectedActivities(selectedActivities.filter(id => id !== activityId));
            setTotalCost(totalCost - cost);
        } else {
            setSelectedActivities([...selectedActivities, activityId]);
            setTotalCost(totalCost + cost);
        }
    };

    const handleRegister = () => {
        if (selectedActivities.length === 0) {
            alert('Please select at least one activity to register');
            return;
        }

        setIsLoading(true);
        axios.post(`http://localhost:3000/youth/register_activities/${user_id}`, {
            activity_ids: selectedActivities,
            total_cost: totalCost,
            camp_id: campDetails.camp_id
        })
            .then(response => {
                alert('Activities registered successfully');
                setSelectedActivities([]);
                setTotalCost(0);
                const activityNames = activities.filter(activity => selectedActivities.includes(activity.activity_id)).map(activity => activity.name);
                navigate(`/youth_camper_functions/register_activities/pay/${user_id}`, {
                    state: {
                        camp_id: campDetails.camp_id,
                        total_cost: totalCost,
                        activity_names: activityNames,

                    }
                });

                // navigate(`/youth_camper_functions/register_activities/pay/${user_id}/`, { state: { camp_id: campDetails.camp_id } });
                
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    alert('You have registered this activity already');
                }
                else{
                console.error('Error registering activities:', error);
                alert('Failed to register activities');}
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="main-content flex bg-cover bg-center bg-no-repeat p-8"
        style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')",
                height: '100vh'
        }}>             {campDetails ? (
            <div className="container mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
            <h1 className="text-xl font-bold mb-4">Register Activities for Camp</h1>
                    <div className="camp-details mb-4">
                        <h2 className="text-lg font-bold">Camp Details</h2>
                        <p><strong>Camp Name:</strong> {campDetails.camp_name}</p>
                        <p><strong>Location:</strong> {campDetails.location}</p>
                        <p><strong>Start Date:</strong> {formatDateDisplay(campDetails.start_date)}</p>
                        <p><strong>End Date:</strong> {formatDateDisplay(campDetails.end_date)}</p>
                        <p><strong>Schedule:</strong> {campDetails.schedule}</p>
                        <p><strong>Description:</strong> {campDetails.description}</p>
                    </div>
                    <div className="activities mb-4">
                        <h2 className="text-lg font-bold">Available Activities</h2>
                        <table className="table-auto w-full text-left whitespace-no-wrap">
                            <thead>
                                <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                                    <th className="px-4 py-3">Select</th>
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
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedActivities.includes(activity.activity_id)}
                                                onChange={() => handleActivitySelect(activity.activity_id, activity.cost)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">{activity.activity_id}</td>
                                        <td className="px-4 py-3">{activity.name}</td>
                                        <td className="px-4 py-3">{activity.duration}</td>
                                        <td className="px-4 py-3">{activity.description}</td>
                                        <td className="px-4 py-3">${activity.cost.toFixed(2)}</td>
                                        <td className="px-4 py-3">{activity.capacity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="total-cost mb-4">
                        <h2 className="text-lg font-bold">Total Cost: ${totalCost.toFixed(2)}</h2>
                    </div>
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register Activities'}
                    </button>       
                    <button
          className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => window.history.back()}
        >
          Back
        </button>
                </div>
            ) : (
                <p>No camp registration found for this camper.</p>
                
            )}

                
       
        </div>
    );
}; function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  }


export default RegisterActivities;
