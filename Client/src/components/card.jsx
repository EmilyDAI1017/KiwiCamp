import React from 'react';
import '../App.css';


export default function Card({ title, icon, description }) {
  return (
    <div className="card">
      <img src={icon} alt="icon" className="card-icon" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
