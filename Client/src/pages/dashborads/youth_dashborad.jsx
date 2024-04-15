import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function YouthDashboard() {
  const { id } = useParams();
  const [youthData, setYouthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/youth_camper_dashboard/${id}`) // Make sure this URL matches your API route!
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
      <h1>Welcome, {youthData.first_name} {youthData.last_name}!</h1>
      <p>Your user ID is {youthData.user_id}.</p>
      <p>Your role is {youthData.first_name}.</p>
      <p>Your email is {youthData.email}.</p>
    </div>
  );
}
