import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../../App.css';

const TeamsAndAccommodations = () => {
    const { user_id } = useParams();
    const [team, setTeam] = useState(null);
    const [accommodations, setAccommodations] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/campers/team_accommodation/${user_id}`);
            const data = response.data;
            setTeam(data.team);
            setAccommodations(data.accommodations);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user_id]);

    return (
        <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen flex flex-col items-center justify-center">
            {team && (
                <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
                    <h2 className="text-2xl font-bold mb-2">My Team</h2>
                    <p className="mb-2"><strong>Camp:</strong> {team.camp_name}</p>
                    <p className="mb-2"><strong>Group:</strong> {team.group_name}</p>
                    <p className="mb-2"><strong>Team Name:</strong> {team.team_name}</p>
                    <p className="mb-2"><strong>Leader:</strong> {team.leader_first_name} {team.leader_last_name}</p>
                </div>
            )}

            {accommodations && (
                <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
                    <h2 className="text-2xl font-bold mb-2">My Accommodations</h2>
                    {accommodations.map((acc, index) => (
                        <div key={index} className="mb-4">
                            <p className="mb-2"><strong>Type:</strong> {acc.type}</p>
                            <p className="mb-2"><strong>Location:</strong> {acc.location_description}</p>
                            <div className="justify-center items-center pl-20">
    <img src={acc.picture} alt="Accommodation" className="w-20 h-auto rounded-lg" />
  </div>                        </div>
                    ))}
                </div>
            )}
            <div className="mb-4 mt-4">
                    <button
          className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => window.history.back()}
                    >
          Back
        </button>
        </div>
        </div>
    );
}

export default TeamsAndAccommodations;
