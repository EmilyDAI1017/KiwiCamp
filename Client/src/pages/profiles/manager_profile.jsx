import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Manager_Profile() {
    const { id } = useParams();
    const [managerData, setManagerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:3000/manager_dashboard/${id}`)
            .then(res => {
                setManagerData(res.data.manager);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError("Failed to load data");
                setIsLoading(false);
            });
    }
    , [id]);
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if(!managerData.first_name) {
            alert("Please enter the manager's first name");
            return;
        }
        if(!managerData.last_name) {
            alert("Please enter the manager's last name");
            return;
        }
        if(!managerData.email) {
            alert('Please enter email');
            return;
        }
        if(!managerData.phone_num) {
            alert('Please enter contact number');
            return;
        }
        if(!managerData.first_name) {
            alert("Please enter the your first name");
            return;
        }
        if(!managerData.last_name) {
            alert("Please enter the your last name");
            return;
        }

        if(!managerData.email) {
            alert('Please enter email');
            return;
        }
        if(!managerData.phone_num) {
            alert('Please enter contact number');
            return;
        }

            // Validate phone number format
            const phoneRegex = /^[0-9]{10}$/; // assuming 10-digit phone number
            if (!phoneRegex.test(managerData.phone_num)) {
                alert('Please enter a valid phone number');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(managerData.email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Validate birthday not beyond today's date
            const today = new Date();
            const dob = new Date(managerData.dob);
            if (dob > today) {
                alert('Please enter a valid date of birth');
                return;
            }

        axios.put(`http://localhost:3000/manager_profile/${id}`, managerData)
            .then(res => {
                alert('Your profile has been updated');
                setIsEditing(false);
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                alert('Failed to update profile');
            });
    };
    if(isLoading) {
        return <div>Loading...</div>;
    }
    if(error) {
        return <div>{error}</div>;
    }
    return (
        <div class="main-content">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manager Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    First Name:
                    <input type="text" value={managerData.first_name} onChange={e => setManagerData({...managerData, first_name: e.target.value})} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500" />
                </label>
                <label className="block">
                    Last Name:
                    <input type="text" value={managerData.last_name} onChange={e => setManagerData({...managerData, last_name: e.target.value})} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"/>
                </label>
                
                <label className="block">
                    Email:
                    <input type="email" value={managerData.email} onChange={e => setManagerData({...managerData, email: e.target.value})} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"/>
                </label>
                <label >
                    Contact Number:
                    <input type="tel" value={managerData.phone_num} onChange={e => setManagerData({...managerData, phone_num: e.target.value})} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"/>
                </label>

                <label className="block">
        Gender:
        <select 
            value={managerData.gender || ''}
            onChange={e => setManagerData({...managerData, gender: e.target.value})}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
        >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
        </select>
    </label>

                <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ease-in-out" onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit'}</button>
                {isEditing && <button 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ease-in-out" type="submit">Save</button>}
            </form>
        </div>
    </div>
    );
}