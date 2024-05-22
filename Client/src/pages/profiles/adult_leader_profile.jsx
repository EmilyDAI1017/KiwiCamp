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
        alert('Your profile has been updated');
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
        <div className="main-content mt-5 bg-contain p-8 min-h-screen flex flex-col items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FtcHxlbnwwfHwwfHx8MA%3D%3D')" }} >
              <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">

      <h1 className="text-4xl font-serif">Welcome {leaderData.first_name} {leaderData.last_name}!</h1>
      <button className=" bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded" onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit Profile'}</button>
      {isEditing ? (
      <form onSubmit={handleSubmit}>
        <p className="block">
          First Name:
          <input type="text" name="first_name" value={leaderData.first_name} onChange={handleChange} disabled={!isEditing} />
        </p>
        <p className="block"> 
          Last Name:
          <input type="text" name="last_name" value={leaderData.last_name} onChange={handleChange} disabled={!isEditing} />
        </p>
        <p className="block">
          Email:
          <input type="email" name="email" value={leaderData.email} onChange={handleChange} disabled={!isEditing} />
        </p>
        <p className="block">
          Phone Number:
          <input type="text" name="phone_num" value={leaderData.phone_num} onChange={handleChange} disabled={!isEditing} />
        </p>
        <p className="block">
        Gender:
        <select name="gender" value={leaderData.gender} onChange={handleChange} disabled={!isEditing}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        </p>
        <p className="block">
          Date of Birth:  {formattedDate}
          <input type="date" name="dob" value={formattedDate} onChange={handleChange} disabled={!isEditing} />
        </p>
        <p className="block">Emergency Contact Name:
          <input type="text" name="emergency_contacts_name" value={leaderData.emergency_contacts_name} onChange={handleChange} disabled={!isEditing} />
        </p>

        <p className="block">Emergency Contact Phone:
          <input type="text" name="emergency_contacts_phone" value={leaderData.emergency_contacts_phone} onChange={handleChange} disabled={!isEditing} />
        </p>

        <p className="text-xl-3">Health Record:</p>
        <p className="block">
          Medical Condition:
          <input type="text" name="medical_condition" value={healthData.medical_condition} onChange={handleHealthChange} disabled={!isEditing} />
        </p>
        <p className="block">
          Allergies information:
          <input type="text" name="allergies_information" value={healthData.allergies_information} onChange={handleHealthChange} disabled={!isEditing} />
        </p>
        <p className="block"> 
          Dietary requirement:
          <input type="text" name="dietary_requirement" value={healthData.dietary_requirement} onChange={handleHealthChange} disabled={!isEditing} />
        </p>

        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit">Save Changes</button>
      </form> 
      ):(
      <div>
       First Name:  <p className="input" >{leaderData.first_name}</p>
       Last Name:  <p className="input" >{leaderData.last_name}</p>
       Email:  <p className="input" >{leaderData.email}</p>
       Phone Number:  <p className="input" >{leaderData.phone_num}</p>
        Gender:  <p className="input" >{leaderData.gender}</p>
        Date of Birth:  <p className="input" >{formattedDate}</p>
        Emergency Contact Name:  <p className="input" >{leaderData.emergency_contacts_name}</p>
        Emergency Contact Phone:  <p className="input" >{leaderData.emergency_contacts_phone}</p>
        {healthData && (
          <div>
        <p className="text-3xl font-serif text-gray-800">Health Record:</p>
        Medical Condition:  <p className="input" >{healthData.medical_condition}</p>
        Allergies information:  <p className="input" >{healthData.allergies_information}</p>
        Dietary requirement:  <p className="input" >{healthData.dietary_requirement}</p>
        Updated date:  <p className="input" >{healthData.last_updated_date}</p>
        </div> 
          )}
        </div>
      )}
    </div>
  </div>
  );
}