import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Adult_Leader_Profile() {
  const { id } = useParams();
  const [leaderData, setLeaderData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:3000/group_leader_dashboard/${id}`)
      .then(res => {
        
        setLeaderData(res.data.leader);
        setHealthData(res.data.health);
        setIsLoading(false);
      }
      )
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
    if(!leaderData.first_name) {
      alert("Please enter the leader's first name");
      return;
    }
    if(!leaderData.last_name) {
      alert("Please enter the leader's last name");
      return;
    }
    if(!leaderData.email) {
      alert('Please enter email');
      return;
    }
    if(!leaderData.phone_num) {
      alert('Please enter contact number');
      return;
    }
    if(!leaderData.first_name) {
      alert("Please enter the your first name");
      return;
    }
    if(!leaderData.last_name) {
      alert("Please enter the your last name");
      return;
    }
    if(!leaderData.email) {
      alert('Please enter email');
      return;
    }
    if(!leaderData.phone_num) {
      alert('Please enter contact number');
      return;
    }
    if (!leaderData.dob) {
      alert("Please enter the leader's date of birth");
      return;
    }
    // Validate phone number format
            const phoneRegex = /^[0-9]{10}$/; // assuming 10-digit phone number
            if (!phoneRegex.test(leaderData.phone_num)) {
                alert('Please enter a valid phone number');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(leaderData.email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Validate birthday not beyond today's date
            const today = new Date();
            const dob = new Date(leaderData.dob);
            if (dob > today) {
                alert('Please enter a valid date of birth');
                return;
            }

    const updatedLeaderData = { ...leaderData, dob: new Date(leaderData.dob).toISOString().slice(0,10) };
    const updatedHealthData = { ...healthData, last_updated_date: new Date().toISOString().slice(0, 10) }; 
    console.log("UPDATE HEALTH",updatedHealthData);
    const dataToSend = { 
       leader: updatedLeaderData,
       health: updatedHealthData };

    axios.put(`http://localhost:3000/group_leader_profile/${id}`, dataToSend)
      .then(res => {
        setIsEditing(false);
        
        alert('Your profile has been updated');
        setError("");
        setHealthData(updatedHealthData);
        setLeaderData(updatedLeaderData);

      })
      .catch(error => {
        console.error('Error updating data:', error);
        alert('Failed to update data');
      });
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLeaderData({
      ...leaderData,
      [name]: value
    });

  };
  const handleHealthChange = (event) => {
    const { name, value } = event.target;
    setHealthData({ ...healthData, [name]: value });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (!leaderData) {
    return <p>No data found</p>;
  }

  const date = new Date(leaderData.dob);
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  return (
    <div className="main-content bg-gray-100/90 flex flex-col items-center justify-center min-h-screen py-12"
        style={{
            backgroundImage: "url('/src/images/camp_bg2.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%'
        }}>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Welcome {leaderData.first_name} {leaderData.last_name}!</h1>
            {isEditing ? (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-gray-700">First Name:</label>
                        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            type="text" name="first_name" value={leaderData.first_name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Last Name:</label>
                        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            type="text" name="last_name" value={leaderData.last_name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email:</label>
                        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            type="email" name="email" value={leaderData.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Phone Number:</label>
                        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            type="text" name="phone_num" value={leaderData.phone_num} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Gender:</label>
                        <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            name="gender" value={leaderData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Date of Birth:</label>
                        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            type="date" name="dob" value={formattedDate} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Emergency Contact Name:</label>
                        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            type="text" name="emergency_contacts_name" value={leaderData.emergency_contacts_name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Emergency Contact Phone:</label>
                        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            type="text" name="emergency_contacts_phone" value={leaderData.emergency_contacts_phone} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Medical Condition:</label>
                        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            type="text" name="medical_condition" value={healthData.medical_condition} onChange={handleHealthChange} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Allergies information:</label>
                        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            type="text" name="allergies_information" value={healthData.allergies_information} onChange={handleHealthChange} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Dietary requirement:</label>
                        <input className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                            type="text" name="dietary_requirement" value={healthData.dietary_requirement} onChange={handleHealthChange} />
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full" type="submit">Save Changes</button>
                </form>
            ) : (
                <div className="space-y-4">
                    <p className="text-gray-700"><strong>First Name:</strong> {leaderData.first_name}</p>
                    <p className="text-gray-700"><strong>Last Name:</strong> {leaderData.last_name}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {leaderData.email}</p>
                    <p className="text-gray-700"><strong>Phone Number:</strong> {leaderData.phone_num}</p>
                    <p className="text-gray-700"><strong>Gender:</strong> {leaderData.gender}</p>
                    <p className="text-gray-700"><strong>Date of Birth:</strong> {formattedDate}</p>
                    <p className="text-gray-700"><strong>Emergency Contact Name:</strong> {leaderData.emergency_contacts_name}</p>
                    <p className="text-gray-700"><strong>Emergency Contact Phone:</strong> {leaderData.emergency_contacts_phone}</p>
                    {healthData && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mt-6">Health Record:</h2>
                            <p className="text-gray-700"><strong>Medical Condition:</strong> {healthData.medical_condition}</p>
                            <p className="text-gray-700"><strong>Allergies information:</strong> {healthData.allergies_information}</p>
                            <p className="text-gray-700"><strong>Dietary requirement:</strong> {healthData.dietary_requirement}</p>
                            <p className="text-gray-700"><strong>Updated date:</strong> {healthData.last_updated_date}</p>
                        </div>
                    )}
                </div>
            )}
            <button   className="mt-2 bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
 onClick={handleEditToggle}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <br></br>
            <button
          className="mt-2 bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => window.history.back()}
        >
          Back to dashboard
        </button>
        </div>
   
    </div>
);
};