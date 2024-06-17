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

  const validateForm = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const today = new Date();
    const dob = new Date(leaderData.dob);

    if (!leaderData.first_name || !leaderData.last_name || !leaderData.email || !leaderData.phone_num || !leaderData.dob) {
      alert("All fields are required");
      return false;
    }
    if (!phoneRegex.test(leaderData.phone_num)) {
      alert('Please enter a valid phone number');
      return false;
    }
    if (!emailRegex.test(leaderData.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (dob > today) {
      alert('Please enter a valid date of birth');
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const updatedLeaderData = { ...leaderData, dob: new Date(leaderData.dob).toISOString().slice(0, 10) };
    const updatedHealthData = { ...healthData, last_updated_date: new Date().toISOString().slice(0, 10) };

    axios.put(`http://localhost:3000/adult_leader_profile/${id}`, { leader: updatedLeaderData, health: updatedHealthData })
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
  };

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

  const formattedDate = new Date(leaderData.dob).toISOString().slice(0, 10);

  return (
    <div
      className="main-content mt-10 bg-cover p-8 min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/src/images/camp_bg2.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh'
      }}
    >
      <div className="max-w-5xl w-full bg-white/90 shadow-lg rounded-lg p-8 space-y-6 overflow-auto">
        <h1 className="text-4xl font-serif">Welcome, {leaderData.first_name} {leaderData.last_name}!</h1>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                <p className="label">First name: <input className="input" type="text" name="first_name" value={leaderData.first_name} onChange={handleChange} /></p>
                <p className="label">Last name: <input className="input" type="text" name="last_name" value={leaderData.last_name} onChange={handleChange} /></p>
                <p>Gender:
                  <select className="input" name="gender" value={leaderData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </p>
                <p>Date of Birth: <input className="input" type="date" name="dob" value={formattedDate} onChange={handleChange} /></p>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                <p className="label">Email: <input className="input" type="email" name="email" value={leaderData.email} onChange={handleChange} /></p>
                <p className="label">Phone Number: <input className="input" type="tel" name="phone_num" value={leaderData.phone_num} onChange={handleChange} /></p>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Emergency Contact Information</h2>
                <p className="label">Emergency Contact Name: <input className="input" type="text" name="emergency_contacts_name" value={leaderData.emergency_contacts_name} onChange={handleChange} /></p>
                <p className="label">Emergency Contact Phone: <input className="input" type="tel" name="emergency_contacts_phone" value={leaderData.emergency_contacts_phone} onChange={handleChange} /></p>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Health Record</h2>
                <p className="label">Medical Condition: <input className="input" type="text" name="medical_condition" value={healthData.medical_condition} onChange={handleHealthChange} /></p>
                <p className="label">Allergies information: <input className="input" type="text" name="allergies_information" value={healthData.allergies_information} onChange={handleHealthChange} /></p>
                <p className="label">Dietary requirement: <input className="input" type="text" name="dietary_requirement" value={healthData.dietary_requirement} onChange={handleHealthChange} /></p>
              </div>
            </div>

            <button className="bg-emerald-600 hover:bg-emerald-900 text-white font-bold py-2 px-4 rounded" type="submit">Save Changes</button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
              <p className="label"><strong>First name:</strong> {leaderData.first_name}</p>
              <p className="label"><strong>Last name:</strong> {leaderData.last_name}</p>
              <p className="label"><strong>Gender:</strong> {leaderData.gender}</p>
              <p className="label"><strong>Date of Birth:</strong> {formatDateDisplay(formattedDate)}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
              <p className="label"><strong>Email:</strong> {leaderData.email}</p>
              <p className="label"><strong>Phone number:</strong> {leaderData.phone_num}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Emergency Contact Information</h2>
              <p className="label"><strong>Emergency Contact Name:</strong> {leaderData.emergency_contacts_name}</p>
              <p className="label"><strong>Emergency Contact Phone:</strong> {leaderData.emergency_contacts_phone}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Health Record</h2>
              <p className="label"><strong>Medical Condition:</strong> {healthData.medical_condition}</p>
              <p className="label"><strong>Allergies information:</strong> {healthData.allergies_information}</p>
              <p className="label"><strong>Dietary requirement:</strong> {healthData.dietary_requirement}</p>
              <p className="label"><strong>Last Updated Date:</strong> {formatDateDisplay(healthData.last_updated_date)}</p>
            </div>
          </div>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          onClick={handleEditToggle}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>

        <div>
          <button
            className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={() => window.history.back()}
          >
            Back to dashboard
          </button>
        </div>

        
      </div>
    </div>

    
  );



  function formatDateForInput(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    return '';
  }

  function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  }

}
