import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook


export default function Card({ title, icon, description, navigateTo}) {
  const navigate = useNavigate(); // Create a navigate function using the hook

  const handleClick = () => {
      navigate(navigateTo); // Navigate to the path provided in the navigateTo prop
  };

  return (
  <div className="card bg-white p-12 m-5 rounded-lg shadow cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out max-h-30 max- overflow-hidden" onClick={handleClick}>     
   <div className="card-icon text-mb-1 flex justify-center">
          {icon}
      </div> 
     <h3 className="text-md font-semibold">{title}</h3>
    <p className="text-sm">{description}</p>

      </div>
  );
}