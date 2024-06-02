import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

function CampDetails() {
  const { camp_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [camp, setCamp] = useState(null);
  const { user_id } = location.state;


  useEffect(() => {
    fetchCampDetails();
  }, []);

  const fetchCampDetails = () => {
    axios.get(`http://localhost:3000/adult_leader/camp_details/${camp_id}`)
      .then(response => {
        setCamp(response.data);
      })
      .catch(error => console.error('Error fetching camp details:', error));
  };

  const handleJoin = async () => {
    if (camp.available_spots > 0) {
      try {
        const response = await axios.post(`http://localhost:3000/camper/camp_register/${user_id}`, {
          group_id: camp.group_id,
          camp_id: camp.camp_id,
          camper_type: 'Adult Leader',
          status: 'Unpaid'
        });
        navigate(`/adult_leader_functions/adult_pay/${user_id}`, {
          state: {
            user_id,
            price: camp.price,
            camp_name: camp.camp_name,
            camp_id: camp.camp_id,
            group_id: camp.group_id,
            group_name: camp.group_name,
            start_date: camp.start_date,
            end_date: camp.end_date,
            registration_id: response.data.registration_id
          }
        });
      } catch (error) {
        console.log("Entered catch block");
  
        if (error.response) {
          console.log("Error response data:", error.response.data);
          console.log("Error response status:", error.response.status);
  
          if (error.response.status === 409 && error.response.data.alreadyRegistered) {
            alert('You have applied to join this camp, please check your payment status.');
          } else {
            alert(`Error registering for camp: ${error.response.data.error}`);
          }
        } else if (error.request) {
          console.log("No response received:", error.request);
          alert('No response received from the server. Please try again later.');
        } else {
          console.log("Error message:", error.message);
          alert(`An unexpected error occurred: ${error.message}`);
        }
      }
    } else {
      alert('No available spots!');
    }
  };
  

  if (!camp) return <p>Loading camp details...</p>;

  return (
<div className="main-content flex bg-cover bg-center bg-no-repeat p-8"
    style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')", height: '100vh' }}>
    
    <div className="container mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-xl">
        <h2 className="text-4xl font-bold mb-6 text-center">{camp.camp_name}</h2>
        <img src={camp.image_url || 'https://images.zeald.com/ic/elrancho/4114289463/unspecified.jpg'} alt={camp.camp_name} className="w-full h-64 object-cover mb-6 rounded-lg shadow-md" />
        <div className="text-lg mb-4">
            <p><strong>Start Date:</strong> {formatDateDisplay(camp.start_date)}</p>
            <p><strong>End Date:</strong> {formatDateDisplay(camp.end_date)}</p>
            <p><strong>Location:</strong> {camp.location}</p>
            <p><strong>Available spots:</strong> {camp.available_spots}</p>
            <p><strong>Capacity:</strong> {camp.number_of_attendees}</p>
            <p><strong>Schedule:</strong> {camp.schedule}</p>
            <p><strong>Description:</strong> {camp.camp_description}</p>
            <p><strong>Group Name:</strong> {camp.group_name}</p>
            <p><strong>Group Leader:</strong> {camp.first_name} {camp.last_name}</p>
            <p><strong>Group Description:</strong> {camp.group_description}</p>
            <p><strong>Price:</strong> ${camp.price}</p>
        </div>
        {camp.available_spots > 0 && (
          <button onClick={handleJoin} className="w-full py-3 mb-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out">
            Register and Pay
          </button>
        )}
        <button
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={() => navigate(-1)}>
            Back
        </button>
    </div>
</div>

  );

  function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  }
}

export default CampDetails;
