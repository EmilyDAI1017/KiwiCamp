import React, { useState, useEffect } from 'react';
import "../../App.css";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const RegisterActivities = () => {
    const { user_id } = useParams();
    const [camps, setCamps] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState({});
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
                setCamps(response.data.camps);
                console.log(response.data.camps);
            })
            .catch(error => console.error('Error fetching camp details:', error))
            .finally(() => setIsLoading(false));
    };

    const handleActivitySelect = (campId, campActId, cost) => {
        const currentSelectedActivities = { ...selectedActivities };
        if (currentSelectedActivities[campId]?.includes(campActId)) {
            currentSelectedActivities[campId] = currentSelectedActivities[campId].filter(id => id !== campActId);
            setTotalCost(totalCost - cost);
        } else {
            if (!currentSelectedActivities[campId]) {
                currentSelectedActivities[campId] = [];
            }
            currentSelectedActivities[campId].push(campActId);
            setTotalCost(totalCost + cost);
        }
        setSelectedActivities(currentSelectedActivities);
    };

    const handleRegister = () => {
        const allSelectedActivities = Object.values(selectedActivities).flat();
        if (allSelectedActivities.length === 0) {
            alert('Please select at least one activity to register');
            return;
        }

        setIsLoading(true);

        // Log the data being sent
        console.log({
            activity_ids: allSelectedActivities,
            total_cost: totalCost
        });

        axios.post(`http://localhost:3000/youth/register_activities/${user_id}`, {
            activity_ids: allSelectedActivities,
            total_cost: totalCost
        })
            .then(response => {
                alert('Activities registered successfully');
                setSelectedActivities({});
                setTotalCost(0);
                navigate(`/youth_camper_functions/register_activities/pay/${user_id}`, {
                    state: {
                        total_cost: totalCost,
                        activities: camps.flatMap(camp =>
                            camp.activities.filter(activity =>
                                selectedActivities[camp.camp_id]?.includes(activity.camp_act_id)
                            ).map(activity => ({
                                name: activity.name,
                                camp_name: camp.camp_name,
                                camp_id: camp.camp_id
                            }))
                        ),
                    }
                });
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    alert('You have registered this activity already or there is an issue with the request data');
                } else {
                    console.error('Error registering activities:', error);
                    alert('Failed to register activities');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="main-content flex flex-col bg-cover bg-center bg-no-repeat p-8"
            style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')", height: '100%' }}>
            
            {camps.length > 0 ? (
                <div className='flex flex-col py-6 mt-12'>
                    {camps.map(camp => (
                        <div key={camp.camp_id} className="container mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg mb-4">
                            <h1 className="text-xl font-bold mb-4">Register Activities for {camp.camp_name}</h1>
                            <div className="camp-details mb-4">
                                <h2 className="text-lg font-bold">Camp Details</h2>
                                <p><strong>Camp Name:</strong> {camp.camp_name}</p>
                                <p><strong>Location:</strong> {camp.location}</p>
                                <p><strong>Start Date:</strong> {formatDateDisplay(camp.start_date)}</p>
                                <p><strong>End Date:</strong> {formatDateDisplay(camp.end_date)}</p>
                                <p><strong>Schedule:</strong> {camp.schedule}</p>
                                <p><strong>Description:</strong> {camp.description}</p>
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
                                        {camp.activities.map(activity => (
                                            <tr key={activity.camp_act_id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedActivities[camp.camp_id]?.includes(activity.camp_act_id) || false}
                                                        onChange={() => handleActivitySelect(camp.camp_id, activity.camp_act_id, activity.cost)}
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
                        </div>
                    ))}
                </div>
            ) : (
                <p>No camp registration found for this camper.</p>
            )}

            <div className='flex-row space-x-4 my-12'>
                <p className="text-lg font-bold">Total Cost: ${totalCost.toFixed(2)}</p>

                <button
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-900 text-white font-bold rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
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

export default RegisterActivities;
