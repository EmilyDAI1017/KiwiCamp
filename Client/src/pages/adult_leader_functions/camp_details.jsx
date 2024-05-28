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
    <div className="main-content bg-cover p-6 min-h-screen flex flex-col items-center justify-start columns-8xs">
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6">{camp.camp_name}</h2>
        {/* <img src={camp.image_url || 'https://via.placeholder.com/150'} alt={camp.camp_name} /> */}
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
        {camp.available_spots > 0 && (
          <button onClick={handleJoin} className="mt-2 mb-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out">Register and Pay</button>
        )}
        <br></br>
        <button
                    className="mt-2 mb-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
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

export default CampDetails;
