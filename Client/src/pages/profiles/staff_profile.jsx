import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Staff_Profile() {
    const { id } = useParams();
    const [staffData, setStaffData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:3000/staff_dashboard/${id}`)
            .then(res => {
                setStaffData(res.data.staff);
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
        if(!staffData.first_name) {
            alert("Please enter the staff's first name");
            return;
        }
        if(!staffData.last_name) {
            alert("Please enter the staff's last name");
            return;
        }
        if(!staffData.email) {
            alert('Please enter email');
            return;
        }
        if(!staffData.phone_num) {
            alert('Please enter contact number');
            return;
        }
        if(!staffData.first_name) {
            alert("Please enter the your first name");
            return;
        }
        if(!staffData.last_name) {
            alert("Please enter the your last name");
            return;
        }
        if(!staffData.email) {
            alert('Please enter email');
            return;
        }
        if(!staffData.phone_num) {
            alert('Please enter contact number');
            return;
        }

            // Validate phone number format
            const phoneRegex = /^[0-9]{10}$/; // assuming 10-digit phone number
            if (!phoneRegex.test(staffData.phone_num)) {
                alert('Please enter a valid phone number');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(staffData.email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Validate birthday not beyond today's date
            const today = new Date();
            const dob = new Date(staffData.dob);
            if (dob > today) {
                alert('Please enter a valid date of birth');
                return;
            }

        axios.put(`http://localhost:3000/staff_profile/${id}`, staffData)
            .then(res => {
                alert('Your profile has been updated successfully');
                setIsEditing(false);
            })
            .catch(error => {
                console.error('Error updating data:', error);
                alert('Failed to save data');
            });
    };
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!staffData) return <div>No data found</div>;
    return (
        <div class="main-content">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Staff Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    First Name:
                    <input type="text" value={staffData.first_name} onChange={e => setStaffData({ ...staffData, first_name: e.target.value })} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"/>
                </label>
                <label className="block">
                    Last Name:
                    <input type="text" value={staffData.last_name} onChange={e => setStaffData({ ...staffData, last_name: e.target.value })} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"/>
                </label>
                <label className="block">
                    Email:
                    <input type="email" value={staffData.email} onChange={e => setStaffData({ ...staffData, email: e.target.value })} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"/>
                </label>
                <label className="block">
                    Contact Number:
                    <input type="tel" value={staffData.phone_num} onChange={e => setStaffData({ ...staffData, phone_num: e.target.value })} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"/>
                </label>

                <label className="block">
                    Gender:
                    <select
                        value={staffData.gender || ''}
                        onChange={e => setStaffData({...staffData, gender: e.target.value})}
                        disabled={!isEditing}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
            >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <label className="block">
                    Emergency Contact Name:
                    <input type="text" value={staffData.emergency_contacts_name} onChange={e => setStaffData({ ...staffData, emergency_contacts_name: e.target.value })} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"/>
                </label>
                <label className="block">
                    Emergency Contact Number:
                    <input type="tel" value={staffData.emergency_contacts_phone} onChange={e => setStaffData({ ...staffData, emergency_contacts_profile: e.target.value })} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"/>
                </label>

                <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ease-in-out" onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit'}</button>
                {isEditing && <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit">Save</button>}
            </form>
        </div>
    </div>
    );
}