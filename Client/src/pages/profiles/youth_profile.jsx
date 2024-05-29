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
            alert('Your profile has been updated');
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

    <div
    className="main-content mt-10 bg-cover p-8 min-h-screen flex flex-col items-center justify-center"
    style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1618526640189-81726d5dd707?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    <div className="max-w-5xl w-full bg-white/80 shadow-lg rounded-lg p-8 space-y-6 overflow-auto">
      <h1 className="text-4xl font-serif">Welcome, {youthData.first_name} {youthData.last_name}!</h1>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
              <p className="label">First name: <input className="input" type="text" name="first_name" value={youthData.first_name} onChange={handleChange} /></p>
              <p className="label">Last name: <input className="input" type="text" name="last_name" value={youthData.last_name} onChange={handleChange} /></p>
              <p>Gender:
                <select className="input" name="gender" value={youthData.gender} onChange={handleChange} disabled={!isEditing}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </p>
              <p>Date of Birth: <input className="input" type="date" name="dob" value={formattedDate} onChange={handleChange} /></p>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
              <p className="label"><strong>User ID:</strong> {youthData.user_id}</p>
              <p className="label">Email: <input className="input" type="email" name="email" value={youthData.email} onChange={handleChange} /></p>
              <p className="label">Phone Number: <input className="input" type="tel" name="phone_num" value={youthData.phone_num} onChange={handleChange} /></p>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Guardian Information</h2>
              <p className="label">Parent/guardian's name: <input className="input" type="text" name="parent_guardian_name" value={youthData.parent_guardian_name} onChange={handleChange} /></p>
              <p className="label">Parent/guardian's phone number: <input className="input" type="tel" name="parent_guardian_phone" value={youthData.parent_guardian_phone} onChange={handleChange} /></p>
              <p className="label">Parent/guardian's email: <input className="input" type="email" name="parent_guardian_email" value={youthData.parent_guardian_email} onChange={handleChange} /></p>
              <p className="label">Relationship to camper: <input className="input" type="text" name="relationship_to_camper" value={youthData.relationship_to_camper} onChange={handleChange} /></p>
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
            <p className="label"><strong>First name:</strong> {youthData.first_name}</p>
            <p className="label"><strong>Last name:</strong> {youthData.last_name}</p>
            <p className="label"><strong>Gender:</strong> {youthData.gender}</p>
            <p className="label"><strong>Date of Birth:</strong> {formattedDate}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
            <p className="label"><strong>User ID:</strong> {youthData.user_id}</p>
            <p className="label"><strong>Email:</strong> {youthData.email}</p>
            <p className="label"><strong>Phone number:</strong> {youthData.phone_num}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Guardian Information</h2>
            <p className="label"><strong>Parent/guardian's name:</strong> {youthData.parent_guardian_name}</p>
            <p className="label"><strong>Parent/guardian's phone:</strong> {youthData.parent_guardian_phone}</p>
            <p className="label"><strong>Parent/guardian's email:</strong> {youthData.parent_guardian_email}</p>
            <p className="label"><strong>Relationship to camper:</strong> {youthData.relationship_to_camper}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Health Record</h2>
            <p className="label"><strong>Medical Condition:</strong> {healthData.medical_condition}</p>
            <p className="label"><strong>Allergies information:</strong> {healthData.allergies_information}</p>
            <p className="label"><strong>Dietary requirement:</strong> {healthData.dietary_requirement}</p>
            <p className="label"><strong>Updated date:</strong> {healthData.last_updated_date}</p>
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
};
