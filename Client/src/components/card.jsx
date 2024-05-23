import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

export default function Card({ title, icon, description, navigateTo, bgColor, f_name, bgImage, className}) {
  const navigate = useNavigate(); // Create a navigate function using the hook

  const handleClick = () => {
    navigate(navigateTo); // Navigate to the path provided in the navigateTo prop
  };

  return (
    <div
      className={`card p-6 m-4 rounded-lg shadow-lg my-3 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out overflow-hidden max-w-xs ${bgColor}`}
      style={{ backgroundImage: `url(${bgImage})` }}
      onClick={handleClick}
    >
      <div className="card-icon mb-4 flex justify-center">
        {icon}
      </div>
      <h1 className={`${className}`}>{f_name}</h1>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      <p className="text-lg text-gray-700">{description}</p>
    </div>
  );
}

