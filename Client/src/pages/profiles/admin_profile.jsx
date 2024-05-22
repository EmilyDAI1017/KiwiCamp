import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Admin_Profile() {
    const { id } = useParams();
    const [adminData, setAdminData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:3000/admin_dashboard/${id}`)
            .then(res => {
                setAdminData(res.data.admin);
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
        if(!adminData.first_name) {
            alert("Please enter the admin's first name");
            return;
        }
        if(!adminData.last_name) {
            alert("Please enter the admin's last name");
            return;
        }
        if(!adminData.email) {
            alert('Please enter email');
            return;
        }
        if(!adminData.phone_num) {
            alert('Please enter contact number');
            return;
        }
        if(!adminData.first_name) {
            alert("Please enter the your first name");
            return;
        }
        if(!adminData.last_name) {
            alert("Please enter the your last name");
            return;
        }
        if(!adminData.email) {
            alert('Please enter email');
            return;
        }
        if(!adminData.phone_num) {
            alert('Please enter contact number');
            return;
        }

            // Validate phone number format
            const phoneRegex = /^[0-9]{10}$/; // assuming 10-digit phone number
            if (!phoneRegex.test(adminData.phone_num)) {
                alert('Please enter a valid phone number');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(adminData.email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Validate birthday not beyond today's date
            const today = new Date();
            const dob = new Date(adminData.dob);
            if (dob > today) {
                alert('Please enter a valid date of birth');
                return;
            }

        axios.put(`http://localhost:3000/admin_profile/${id}`, adminData)
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
    if (!adminData) return <div>No data found</div>;
    return (
        <div class="main-content">
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome {adminData.first_name} {adminData.last_name} ! </h2>
            <form onSubmit={handleSubmit}>
                <label className="label"> 
                    First Name:
                    <input className="input" type="text" value={adminData.first_name} onChange={e => setAdminData({ ...adminData, first_name: e.target.value })} disabled={!isEditing} />
                </label>
                <label className="block">
                    Last Name:
                    <input className="input" type="text" value={adminData.last_name} onChange={e => setAdminData({ ...adminData, last_name: e.target.value })} disabled={!isEditing} />
                </label>
                <label className="block"> 
                    Email:
                    <input className="input" type="email" value={adminData.email} onChange={e => setAdminData({ ...adminData, email: e.target.value })} disabled={!isEditing} />
                </label>
                <label className="block">
                    Contact Number:
                    <input className="input" type="tel" value={adminData.phone_num} onChange={e => setAdminData({ ...adminData, phone_num: e.target.value })} disabled={!isEditing} />
                </label>

                <label className="block">
                    Gender:
                    <select
                        value={adminData.gender || ''}
                        onChange={e => setAdminData({...adminData, gender: e.target.value})}
                        disabled={!isEditing}
                        className="input"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <button type="button" className=" bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded" onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit'}</button>
                {isEditing && <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit">Save</button>}
            </form>
            </div>
        </div>
    );
}
