import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Youth_Profile() {
  const { id } = useParams();
  const [youthData, setYouthData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:3000/youth_camper_dashboard/${id}`)
      .then(res => {
        setYouthData(res.data.youth);
        setHealthData(res.data.health);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError("Failed to load data");
        setIsLoading(false);
      });
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (event) => {
    event.preventDefault();


    if(!youthData.first_name) {
        alert("Please enter the camper's first name")
        return
    }
    if(!youthData.last_name) {
        alert("Please enter the camper's last name")
        return
    }
    if(!youthData.email) {
        alert('Please enter email')
        return
    }
    if(!youthData.phone_num) {
        alert('Please enter contact number')
        return
    }
    if(!youthData.gender) {
        alert("Please select the camper's gender")
        return
    }
    if(!youthData.dob) {
        alert("Please enter the camper's date of birth")
        return
    }
    if(!youthData.parent_guardian_name) {
        alert("Please enter the parent/guardian's name")
        return
    }
    if(!youthData.parent_guardian_phone) {
        alert("Please enter the parent/guardian's phone number")
        return
    }
    if(!youthData.parent_guardian_email) {
        alert("Please enter the parent/guardian's email")
        return
    }
    
        // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/; // assuming 10-digit phone number
    if (!phoneRegex.test(youthData.phone_num)) {
        alert('Please enter a valid phone number');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(youthData.email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Validate birthday not beyond today's date
    const today = new Date();
    const dob = new Date(youthData.dob);
    if (dob > today) {
        alert('Please enter a valid date of birth');
        return;
    }

    const updatedYouthData = { ...youthData, dob: new Date(youthData.dob).toISOString().slice(0, 10) }; // Ensure date is in the right format
    const updatedHealthData = { ...healthData, last_updated_date: new Date().toISOString().slice(0, 10) }; // Update the health data's last updated date

    // Prepare the data to send as one object
    const dataToSend = {
        youth: updatedYouthData,
        health: updatedHealthData
    };

    axios.put(`http://localhost:3000/youth_profile/${id}`, dataToSend)
        .then(res => {
            setIsEditing(false);
            setError("");
            setHealthData(updatedHealthData);
            setYouthData(updatedYouthData);
        })
        .catch(error => {
            console.error('Error updating data:', error);
            setError("Failed to update data");
        });
};

const handleChange = (event) => {
  const { name, value } = event.target;
  setYouthData({
    ...youthData,
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

if (!youthData) {
  return <p>No youth data found.</p>;
}

const date = new Date(youthData.dob);
const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  return (


    <div className="dashboard-container">
      <h1>Welcome, {youthData.first_name} {youthData.last_name}!</h1>
      <button className=" bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded" onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit Profile'}</button>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <p>First name: <input type="text" name="first_name" value={youthData.first_name} onChange={handleChange} /></p>
          <p>Last name: <input type="text" name="last_name" value={youthData.last_name} onChange={handleChange} /></p>
          <p>Email: <input type="email" name="email" value={youthData.email} onChange={handleChange} /></p>
          <p>Phone Number: <input type="tel" name="phone_num" value={youthData.phone_num} onChange={handleChange} /></p>
          <p>
        Gender:
        <select name="gender" value={youthData.gender} onChange={handleChange} disabled={!isEditing}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        </p>          <p>Date of Birth: {formattedDate} <input type="date" name="dob" value={formattedDate} onChange={handleChange} /></p>
          <p>Parent/guardian's name: <input type="text" name="parent_guardian_name" value={youthData.parent_guardian_name} onChange={handleChange} /></p>
          <p>Parent/guardian's phone number:<input type="tel" name="parent_guardian_phone" value={youthData.parent_guardian_phone} onChange={handleChange} /></p>
          <p>Parent/guardian's email: <input type="email" name="parent_guardian_email" value={youthData.parent_guardian_email} onChange={handleChange} /></p>
        	<p>Health Record:</p>
          <p>Medical Condition: <input type="text" name="medical_condition" value={healthData.medical_condition} onChange={handleHealthChange} /></p>
          <p>Allergies information: <input type="text" name="allergies_information" value={healthData.allergies_information} onChange={handleHealthChange} /></p>
          <p>Dietary requirement: <input type="text" name="dietary_requirement" value={healthData.dietary_requirement} onChange={handleHealthChange} /></p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit">Save Changes</button>
        </form>
      ) : (
        <div>
          <p>User ID: {youthData.user_id}</p>
          <p>First name: {youthData.first_name}</p>
          <p>Last name: {youthData.last_name}</p>
          <p>Email: {youthData.email}</p>
          <p>Phone number: {youthData.phone_num}</p>
          <p>Gender: {youthData.gender}</p>
          <p>Date of Birth: {formattedDate}</p>
          <p>Parent/guardian's name : {youthData.parent_guardian_name}</p>
          <p>Parent/guardian's phone number: {youthData.parent_guardian_phone}</p>
          <p>Parent/guardian's email: {youthData.parent_guardian_email}</p>
          <p>Health Record:</p>
          {healthData && (
            <div>
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
