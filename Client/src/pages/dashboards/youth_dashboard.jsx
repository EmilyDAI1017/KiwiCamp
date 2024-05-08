import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../../App.css';
import Card from "../../components/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IoIosBonfire } from "react-icons/io";
import { IoIosAnalytics } from "react-icons/io";
import { RiProfileLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";





export default function YouthDashboard() {

  const { id } = useParams();
  const [youthData, setYouthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/youth_camper_dashboard/${id}`) 
      .then(res => {
        setYouthData(res.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching youth data:', error);
        setError("Failed to load data");
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!youthData) {
    return <p>No youth data found.</p>;
  }

  // Assuming the API returns an object directly, not an array
  return (
    <div>
        {/* <div class="dashboard-container">
          
        <h1>Welcome, {youthData.first_name} {youthData.last_name}!</h1>
   
        </div>

        <div class="categories-section">
          <div class="trends-section grid-item-large">
        <p>Your user ID is {youthData.user_id}.</p>
          </div>
        </div>

        <div class="categories-section grid-item-medium">
        <p>Your role is {youthData.first_name}.</p>
        </div>
      
        <div class="brands-section grid-item-medium">
        <p>Your email is {youthData.email}.</p>
        </div> */}
      
        <div className="dashboard">
      <Card title="Camp" icon={< FaUser />} description="View and select activities." />
      <Card title="Activity" icon={< FaUser />}  description="View your recent activity." />
      <Card title="Profile" icon={<RiProfileLine />} description="Edit your profile." />
      // Add more cards as needed
        </div>
    </div>
  );

  // const history = useHistory();

  // // State variables for profile and other dashboard data
  // const [profileData, setProfileData] = useState({ /* Profile data here */ });
  // const [selectedActivities, setSelectedActivities] = useState([]);
  // // Other state variables for camp information, payments, messages, etc.

  // // Function to handle logout
  // const handleLogout = () => {
  //   // Perform logout actions (clear session, redirect to login, etc.)
  //   history.push("/login");
  // };


  // return (
  //   <div className="dashboard-container">
  //     <div className="dashboard-header">
  //       <h2>Welcome to Your Youth Camper Dashboard</h2>
  //       <button onClick={handleLogout}>Logout</button>
  //     </div>
  //     <div className="dashboard-section profile-section">
  //       <h3>Profile</h3>
  //       {/* Profile information form or display */}
  //     </div>
  //     <div className="dashboard-section camp-info-section">
  //       <h3>Camp Information</h3>
  //       {/* Display camp information */}
  //     </div>
  //     <div className="dashboard-section activities-section">
  //       <h3>Activities Selection</h3>
  //       {/* Display available activities and selection functionality */}
  //     </div>
  //     <div className="dashboard-section payment-section">
  //       <h3>Payments</h3>
  //       {/* Payment processing functionality and display */}
  //     </div>
  //     <div className="dashboard-section messages-section">
  //       <h3>Messages</h3>
  //       {/* Messaging functionality and display */}
  //     </div>
  //   </div>
  // );

}