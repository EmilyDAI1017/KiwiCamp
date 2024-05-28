import React, { useState, useEffect } from "react";
import Card from "../../components/card";
import { FcApproval } from "react-icons/fc";
import { GiForestCamp } from "react-icons/gi";
import { MdOutlineGroups2 } from "react-icons/md";

const ManageActivities = () => {
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState({
        name: "",
        description: "",
    });

    // Function to fetch activities from the server
    const fetchActivities = async () => {
        try {
            const response = await fetch("/admin/manage_activities");
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    // Function to add a new activity
    const addActivity = async (newActivity) => {
        try {
            const response = await fetch("/admin/manage_activities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newActivity),
            });
            const data = await response.json();
            setActivities([...activities, data]);
        } catch (error) {
            console.error("Error adding activity:", error);
        }
    };

    // Function to edit an existing activity
    const editActivity = async (activityId, updatedActivity) => {
        try {
            const response = await fetch(`/api/activities/${activityId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedActivity),
            });
            const data = await response.json();
            const updatedActivities = activities.map((activity) =>
                activity.id === activityId ? data : activity
            );
            setActivities(updatedActivities);
        } catch (error) {
            console.error("Error editing activity:", error);
        }
    };

    // Function to delete an activity
    const deleteActivity = async (activityId) => {
        try {
            await fetch(`/api/activities/${activityId}`, {
                method: "DELETE",
            });
            const updatedActivities = activities.filter(
                (activity) => activity.id !== activityId
            );
            setActivities(updatedActivities);
        } catch (error) {
            console.error("Error deleting activity:", error);
        }
    };

    // Fetch activities when the component mounts
    useEffect(() => {
        fetchActivities();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        addActivity(newActivity);
        setNewActivity({ name: "", description: "" });
    };

    return (
        <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card
                    title="Manage Camps"
                    description="Edit and manage camp information"
                    navigateTo="/admin/manage_camps/manager_camps_info"
                    icon={<GiForestCamp className="text-9xl text-green-600" />}
                />
                <Card
                    title="Manage Groups"
                    description="Edit and manage group information"
                    navigateTo="/admin/manage_camps/manage_groups"
                    icon={<MdOutlineGroups2 className="text-8xl text-blue-500" />}
                />
                <Card
                    title="Manage Camp Registrations"
                    description="Edit and manage camp registration information"
                    navigateTo="/admin/manage_camps/manage_camp_registrations"
                    icon={<FcApproval className="text-9xl text-green-500" />}
                />
            </div>

            <div>
                {/* Display activities */}
                {activities.map((activity) => (
                    <div key={activity.id}>
                        <h3>{activity.name}</h3>
                        <p>{activity.description}</p>
                        {/* Add edit and delete buttons */}
                        <button onClick={() => editActivity(activity.id, updatedActivity)}>
                            Edit
                        </button>
                        <button onClick={() => deleteActivity(activity.id)}>Delete</button>
                    </div>
                ))}

                {/* Add activity form */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newActivity.name}
                        onChange={(e) =>
                            setNewActivity({ ...newActivity, name: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        value={newActivity.description}
                        onChange={(e) =>
                            setNewActivity({ ...newActivity, description: e.target.value })
                        }
                    />
                    <button type="submit">Add Activity</button>
                </form>
            </div>

            <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
                onClick={() => window.history.back()}
            >
                Back
            </button>
        </div>
    );
};

export default ManageActivities;