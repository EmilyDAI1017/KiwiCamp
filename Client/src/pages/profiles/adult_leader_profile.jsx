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
    axios.get(`http://localhost:3000/adult_leader_dashboard/${id}`)
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

    axios.put(`http://localhost:3000/adult_leader_profile/${id}`, dataToSend)
      .then(res => {
        setIsEditing(false);
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
    <div className="dashboard-container">
      <h1>Welcome </h1>
      <button className=" bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded" onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit Profile'}</button>
      {isEditing ? (
      <form onSubmit={handleSubmit}>
        <p>
          First Name:
          <input type="text" name="first_name" value={leaderData.first_name} onChange={handleChange} disabled={!isEditing} />
        </p>
        <p>
          Last Name:
          <input type="text" name="last_name" value={leaderData.last_name} onChange={handleChange} disabled={!isEditing} />
        </p>
        <p>
          Email:
          <input type="email" name="email" value={leaderData.email} onChange={handleChange} disabled={!isEditing} />
        </p>
        <p>
          Phone Number:
          <input type="text" name="phone_num" value={leaderData.phone_num} onChange={handleChange} disabled={!isEditing} />
        </p>
        <p>
        Gender:
        <select name="gender" value={leaderData.gender} onChange={handleChange} disabled={!isEditing}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        </p>
        <p>
          Date of Birth:  {formattedDate}
          <input type="date" name="dob" value={formattedDate} onChange={handleChange} disabled={!isEditing} />
        </p>
        <p>Emergency Contact Name:
          <input type="text" name="emergency_contacts_name" value={leaderData.emergency_contacts_name} onChange={handleChange} disabled={!isEditing} />
        </p>

        <p>Emergency Contact Phone:
          <input type="text" name="emergency_contacts_phone" value={leaderData.emergency_contacts_phone} onChange={handleChange} disabled={!isEditing} />
        </p>

        <p>Health Record:</p>
        <p>
          Medical Condition:
          <input type="text" name="medical_condition" value={healthData.medical_condition} onChange={handleHealthChange} disabled={!isEditing} />
        </p>
        <p>
          Allergies information:
          <input type="text" name="allergies_information" value={healthData.allergies_information} onChange={handleHealthChange} disabled={!isEditing} />
        </p>
        <p>
          Dietary requirement:
          <input type="text" name="dietary_requirement" value={healthData.dietary_requirement} onChange={handleHealthChange} disabled={!isEditing} />
        </p>

        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit">Save Changes</button>
      </form> 
      ):(
      <div>
        <p>First Name: {leaderData.first_name}</p>
        <p>Last Name: {leaderData.last_name}</p>
        <p>Email: {leaderData.email}</p>
        <p>Phone Number: {leaderData.phone_num}</p>
        <p>Gender:{leaderData.gender}</p>
        <p>Date of Birth: {formattedDate}</p>
        <p>Emergency Contact Name: {leaderData.emergency_contacts_name}</p>
        <p>Emergency Contact Phone: {leaderData.emergency_contacts_phone}</p>
        {healthData && (
          <div>
        <p>Health Record:</p>
        <p>Medical Condition: {healthData.medical_condition}</p>
        <p>Allergies information: {healthData.allergies_information}</p>
        <p>Dietary requirement: {healthData.dietary_requirement}</p>
        <p>Updated date: {healthData.last_updated_date}</p>
        </div> 
          )}
        </div>
      )}
    </div>
  );
}