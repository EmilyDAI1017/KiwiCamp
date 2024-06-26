import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

function CampDetailsY() {
  const { camp_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [camp, setCamp] = useState(null);
  const { user_id } = location.state;


  useEffect(() => {
    fetchCampDetails();
  }, []);

  const fetchCampDetails = () => {
    axios.get(`http://localhost:3000/youth_campers/camp_details/${camp_id}`)
      .then(response => {
        setCamp(response.data);
      })
      .catch(error => console.error('Error fetching camp details:', error));
  };

 const handleJoin = () => {

    if (camp.available_spots > 0) {
      const currentDate = new Date();

      // Insert a new record into camp_registrations table
      axios.post(`http://localhost:3000/camper/camp_register/${user_id}`, {
        group_id: camp.group_id,
        camp_id: camp.camp_id,
        user_id,
        camper_type: 'Youth',
        registration_date: currentDate,
        status: 'Unpaid'
      })
      .then(response => {


        navigate(`/youth_camper_functions/youth_pay/${user_id}`, {
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
      })
      .catch(function (error) {
        if (error.response) {
          console.log("Error response data:", error.response.data);
          console.log("Error response status:", error.response.status);
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 409 && error.response.data.alreadyRegistered) {
            alert('You have applied to join this camp, please check your payment status.');
          } else {
            alert(`Error registering for camp: ${error.response.data.error}`);
          }
        } else if (error.request) {
          console.log("No response received:", error.request);
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          alert('No response received from the server. Please try again later.');
        } else {
          console.log("Error message:", error.message);
          // Something happened in setting up the request that triggered an Error
          alert(`An unexpected error occurred: ${error.message}`);
        }
      });
    } else {
      alert('No available spots!');
    }
  };

  if (!camp) return <p>Loading camp details...</p>;

  return (
<div className="main-content flex bg-cover bg-center bg-no-repeat p-8"
    style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')", height: '100vh' }}>
    <div className="container mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-xl">
        <h2 className="text-3xl font-bold mb-6">{camp.camp_name}</h2>
        <img src={camp.image_url || 'https://images.zeald.com/ic/elrancho/4114289463/unspecified.jpg'} alt={camp.camp_name} className="w-full h-64 object-cover mb-6 rounded-lg shadow-md" />
        <div className="text-lg mb-4">

       <p>Start Date: {formatDateDisplay(camp.start_date)}</p>
        <p>End Date: {formatDateDisplay(camp.end_date)}</p>
        <p>Location: {camp.location}</p>
        <p>Available spots: {camp.available_spots}</p>
        <p>Capacity: {camp.number_of_attendees}</p>
        <p>Schedule: {camp.schedule}</p>
        <p>Description: {camp.camp_description}</p>
        <p>Group Name: {camp.group_name}</p>
        <p>Group Leader: {camp.first_name} {camp.last_name}</p>
        <p>Group Description: {camp.group_description}</p>
        <p>Price: ${camp.price}</p>
        </div>
        {camp.available_spots > 0 && (
          <button onClick={handleJoin} className="w-full py-3 mb-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out">Register and Pay</button>
        )}
        <br></br>
        <button
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
                    onClick={() => navigate(-1)} // Go back to the previous page
                >
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

export default CampDetailsY;
