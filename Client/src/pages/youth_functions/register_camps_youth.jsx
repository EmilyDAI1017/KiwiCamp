import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';
import Card from "../../components/card";
import '../../App.css';

function RegisterCamps() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = () => {
    axios.get('http://localhost:3000/youth_register_camps/camps')
      .then(response => {
        setCamps(response.data);
      })
      .catch(error => console.error('Error fetching camps:', error));
  };

  const handleRegister = (camp) => {
    if (user && user.id) {
      navigate(`/youth_register_camps/camps/${camp.camp_id}`, {
        state: {
          camp,
          user_id: user.id,
        },
      });
    } else {
      console.error('User is not logged in');
    }
  };

  return (
    <div className="main-content bg-cover p-6 min-h-screen flex flex-col items-center justify-start" 
    style={{
      backgroundImage: "url('/src/images/camp_bg2.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh'
    }}>
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-3xl text-green-700 font-bold mb-6">Available Camps</h2>
        <div className="grid grid-cols-3">
          {camps.length > 0 ? (
            camps.map(camp => (
              <div
                key={camp.camp_id}
                className="card p-6 m-4 rounded-lg shadow-lg my-3 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out overflow-hidden max-w-xs bg-white"
                onClick={() => handleRegister(camp)}
                style={{ backgroundImage: `url('/src/images/rainbow3.jpeg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                backgroundRepeat: 'no-repeat',
                height: '300px',
                opacity: '0.9'
               }}              >
                <div className="card-icon mb-4 flex justify-center">
                  {/* Optional icon can be added here */}
                </div>
                
              <h1 className="p-5 mx-1 text-2xl  font-bold text-gray-800">{camp.camp_name}</h1>
              <h2 className="text-5xl text-gray-700">Price: ${camp.price}</h2>
              <p className="text-4xl p-5 text-gray-700">Start Date: {formatDateDisplay(camp.start_date)}</p>
              </div>
            ))
          ) : (
            <p>No camps available.</p>
          )}
        </div>
        <button
                    className="mt-2 mb-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
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

export default RegisterCamps;
