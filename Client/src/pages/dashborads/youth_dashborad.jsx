import React from 'react';
import { useParams } from 'react-router-dom';

const Youth_Dashboard = () => {
  const { id } = useParams();
  console.log(id)
  return (
    <div>
      <h1>Youth Camper Dashboard</h1>
      {id}
      {/* Add your dashboard content here */}
    </div>
  );
};

export default Youth_Dashboard;
