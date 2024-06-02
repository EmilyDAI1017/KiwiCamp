import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../App.css';

function MyCampers() {
  const [campers, setCampers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user_id } = useParams();

  const fetchCampers = () => {
    axios.get(`http://localhost:3000/group_leaders/my_campers/${user_id}`)
      .then(response => {
        setCampers(response.data);
      })
      .catch(error => console.error('Error fetching campers:', error));
  };

  useEffect(() => {
    fetchCampers();
  }, []);

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const filteredCampers = campers.filter(camp =>
    (camp.youth_first_name && camp.youth_first_name.toLowerCase().includes(searchTerm)) ||
    (camp.youth_last_name && camp.youth_last_name.toLowerCase().includes(searchTerm)) ||
    (camp.adult_first_name && camp.adult_first_name.toLowerCase().includes(searchTerm)) ||
    (camp.adult_last_name && camp.adult_last_name.toLowerCase().includes(searchTerm)) ||
    (camp.group_name && camp.group_name.toLowerCase().includes(searchTerm)) ||
    (camp.team_name && camp.team_name.toLowerCase().includes(searchTerm))
  );

  const groupedCampers = filteredCampers.reduce((acc, camp) => {
    const group = camp.group_name || 'Ungrouped';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(camp);
    return acc;
  }, {});

  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  };

  return (
    <div
      className="main-content bg-cover bg-center bg-no-repeat p-8"
      style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')" }}
    >
      <div className="container mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl text-green-700 font-bold mb-6">View Registered Campers</h1>
        <div className="search-container mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="form-input rounded-md shadow-sm w-full md:w-1/2 lg:w-1/3 h-10 px-4"
            placeholder="Search campers by name/group/team..."
          />
          <button
            className="ml-4 bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="ml-4 bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={() => window.history.back()}
          >
            Back to Dashboard
          </button>
        </div>
        <div className="campers-list mt-4 overflow-x-auto">
          {Object.keys(groupedCampers).length === 0 ? (
            <p className="text-red-500">No campers found</p>
          ) : (
            Object.keys(groupedCampers).map((group, idx) => (
              <div key={idx} className="group-section mb-8">
                <h2 className="text-2xl text-green-700  font-semibold mb-4">{group}</h2>

                <h3 className="text-lg font-semibold mb-2">Youth Campers</h3>
                <table className="table-auto w-full text-left whitespace-no-wrap mb-6">
                  <thead>
                    <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                      <th className="px-4 py-3">Team Name</th>
                      <th className="px-4 py-3">Youth Camper Name</th>
                      <th className="px-4 py-3">Youth Email</th>
                      <th className="px-4 py-3">Youth Phone</th>
                      <th className="px-4 py-3">Youth Gender</th>
                      <th className="px-4 py-3">Youth DOB</th>
                      <th className="px-4 py-3">Parent/Guardian Name</th>
                      <th className="px-4 py-3">Parent/Guardian Phone</th>
                      <th className="px-4 py-3">Parent/Guardian Email</th>
                      <th className="px-4 py-3">Relationship to Camper</th>
                      <th className="px-4 py-3">Activity Preferences</th>
                      <th className="px-4 py-3">Medical Condition</th>
                      <th className="px-4 py-3">Allergies Information</th>
                      <th className="px-4 py-3">Dietary Requirement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedCampers[group].filter(camp => camp.youth_first_name).map((camp, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{camp.team_name || 'No Team'}</td>
                        <td className="px-4 py-3">{camp.youth_first_name} {camp.youth_last_name}</td>
                        <td className="px-4 py-3">{camp.youth_email}</td>
                        <td className="px-4 py-3">{camp.youth_phone}</td>
                        <td className="px-4 py-3">{camp.youth_gender}</td>
                        <td className="px-4 py-3">{formatDateDisplay(camp.youth_dob)}</td>
                        <td className="px-4 py-3">{camp.parent_guardian_name}</td>
                        <td className="px-4 py-3">{camp.parent_guardian_phone}</td>
                        <td className="px-4 py-3">{camp.parent_guardian_email}</td>
                        <td className="px-4 py-3">{camp.relationship_to_camper}</td>
                        <td className="px-4 py-3">{camp.activity_preferences}</td>
                        <td className="px-4 py-3">{camp.medical_condition}</td>
                        <td className="px-4 py-3">{camp.allergies_information}</td>
                        <td className="px-4 py-3">{camp.dietary_requirement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 className="text-lg font-semibold mb-2">Adult Leaders</h3>
                <table className="table-auto w-full text-left whitespace-no-wrap">
                  <thead>
                    <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                      <th className="px-4 py-3">Team Name</th>
                      <th className="px-4 py-3">Adult Leader Name</th>
                      <th className="px-4 py-3">Adult Email</th>
                      <th className="px-4 py-3">Adult Phone</th>
                      <th className="px-4 py-3">Adult Gender</th>
                      <th className="px-4 py-3">Adult DOB</th>
                      <th className="px-4 py-3">Emergency Contact Name</th>
                      <th className="px-4 py-3">Emergency Contact Phone</th>
                      <th className="px-4 py-3">Medical Condition</th>
                      <th className="px-4 py-3">Allergies Information</th>
                      <th className="px-4 py-3">Dietary Requirement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedCampers[group].filter(camp => camp.adult_first_name).map((camp, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{camp.team_name || 'No Team'}</td>
                        <td className="px-4 py-3">{camp.adult_first_name} {camp.adult_last_name}</td>
                        <td className="px-4 py-3">{camp.adult_email}</td>
                        <td className="px-4 py-3">{camp.adult_phone}</td>
                        <td className="px-4 py-3">{camp.adult_gender}</td>
                        <td className="px-4 py-3">{formatDateDisplay(camp.adult_dob)}</td>
                        <td className="px-4 py-3">{camp.emergency_contacts_name}</td>
                        <td className="px-4 py-3">{camp.emergency_contacts_phone}</td>
                        <td className="px-4 py-3">{camp.medical_condition}</td>
                        <td className="px-4 py-3">{camp.allergies_information}</td>
                        <td className="px-4 py-3">{camp.dietary_requirement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCampers;
