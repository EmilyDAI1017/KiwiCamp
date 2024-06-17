import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../App.css';

function LeaderCampers() {
  const [campers, setCampers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user_id } = useParams(); // Using user_id from params

  const fetchCampers = () => {
    axios.get(`http://localhost:3000/adult_leaders/my_campers/${user_id}`)
      .then(response => {
        console.log('API response:', response.data); // Debugging log
        setCampers(response.data || []);
      })
      .catch(error => console.error('Error fetching campers:', error));
  };

  useEffect(() => {
    fetchCampers();
  }, [user_id]);

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const filteredCampers = campers.filter(camp =>
    (camp.youth_first_name && camp.youth_first_name.toLowerCase().includes(searchTerm)) ||
    (camp.youth_last_name && camp.youth_last_name.toLowerCase().includes(searchTerm)) ||
    (camp.team_name && camp.team_name.toLowerCase().includes(searchTerm))
  );

  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  };

  return (
    <div className="main-content p-8 bg-gradient-to-r from-green-50 to-green-70 min-h-screen "
    style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')",
            height: '100%'
    }}
    >
      <h1 className="text-xl font-bold mb-4">View Your Group's Campers</h1>
      <div className="search-container my-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input rounded-md shadow-sm mt-1 w-1/3"
          placeholder="Search campers by name/team..."
        />
        <button 
          className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={handleSearch}
        >
          Search
        </button>
        <br />
        <button
          className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => window.history.back()}
        >
          Back to dashboard
        </button>
      </div>
      <div className="campers-list mt-4 overflow-x-auto">
        {filteredCampers.length === 0 ? (
          <p>No campers found</p>
        ) : (
          <table className="table-auto w-full text-left whitespace-no-wrap mb-6">
            <thead>
              <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                <th className="px-4 py-3">Team Name</th>
                <th className="px-4 py-3">Youth Camper Name</th>
                <th className="px-4 py-3">Youth Email</th>
                <th className="px-4 py-3">Youth Phone</th>
                <th className="px-4 py-3">Youth Gender</th>
                <th className="px-4 py-3">Youth DOB</th>
                <th className="px-4 py-3">Parent Name</th>
                <th className="px-4 py-3">Parent Email</th>
                <th className="px-4 py-3">Parent Phone</th>
                <th className="px-4 py-3">Relationship</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampers.map((camp, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                      <td className="px-4 py-3">{camp.team_name || 'No Team'}</td>

                  <td className="px-4 py-3">{camp.first_name} {camp.last_name}</td>
                  <td className="px-4 py-3">{camp.email}</td>
                  <td className="px-4 py-3">{camp.phone_num}</td>
                  <td className="px-4 py-3">{camp.gender}</td>
                  <td className="px-4 py-3">{formatDateDisplay(camp.dob)}</td>

                  <td className="px-4 py-3">{camp.parent_guardian_name}</td>
                  <td className="px-4 py-3">{camp.parent_guardian_email}</td>
                  <td className="px-4 py-3">{camp.parent_guardian_phone}</td>
                  <td className="px-4 py-3">{camp.relationship_to_camper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LeaderCampers;
