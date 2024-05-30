import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

function ViewGrounds() {
  const [grounds, setGrounds] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGrounds = () => {
    axios.get('http://localhost:3000/admin/manage_grounds')
      .then(response => {
        setGrounds(response.data);
      })
      .catch(error => console.error('Error fetching grounds:', error));
  };

  useEffect(() => {
    fetchGrounds();
  }, []);

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const filteredGrounds = grounds.filter(ground =>
    ground.name.toLowerCase().includes(searchTerm) ||
    ground.description.toLowerCase().includes(searchTerm) ||
    ground.location.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="main-content">
      <h1 className="text-xl font-bold mb-4">View Camping Grounds</h1>
      <div className="search-container my-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input rounded-md shadow-sm mt-1 w-1/3"
          placeholder="Search grounds by name/description/location..."
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
      <div className="ground-list mt-4">
        {filteredGrounds.length === 0 ? (
          <p>No grounds found</p>
        ) : (
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                <th className="px-4 py-3">Ground Number</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Picture</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrounds.map(ground => (
                <tr key={ground.ground_id} className="bg-white border-b hover:bg-gray-50">
                  <td className='px-1 py-3'>{ground.ground_id}</td>
                  <td>{ground.name}</td>
                  <td>{ground.capacity}</td>
                  <td>{ground.description}</td>
                  <td>{ground.location}</td>
                  <td>{ground.status}</td>
                  <td>{ground.picture}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ViewGrounds;
