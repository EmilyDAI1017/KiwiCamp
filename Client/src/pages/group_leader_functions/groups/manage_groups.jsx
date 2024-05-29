import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';

const ManageGroups = () => {
    const { user } = useUser();
    const user_id = user.id;
    const location = useLocation();
    const { id } = useParams();
    const group_id = id;
    const navigate = useNavigate();
    const campId = location.state && location.state.campId;


    const [groupDetails, setGroupDetails] = useState({});
    const [adultLeaders, setAdultLeaders] = useState([]);
    const [youthCampers, setYouthCampers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [selectedLeader, setSelectedLeader] = useState('');
    const [selectedCamper, setSelectedCamper] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [availableCabins, setAvailableCabins] = useState([]);
    const [availableTents, setAvailableTents] = useState([]);
    const [selectedAccommodation, setSelectedAccommodation] = useState('');

    useEffect(() => {
        fetchGroupDetails();
        fetchGroupMembers();
        fetchTeams();
        fetchAvailableCabins();
        fetchAvailableTents();
    }, [group_id]);

    useEffect(() => {
        // Fetch available cabins and tents once groupDetails are available
        if (groupDetails.camp_id || (location.state && location.state.campId)) {
            fetchAvailableCabins();
            fetchAvailableTents();
        }
    }, [groupDetails, location.state]);

    const fetchGroupDetails = () => {
        axios.get(`http://localhost:3000/group_leader/groups/${group_id}`)
            .then(response => {
                setGroupDetails(response.data);
            })
            .catch(error => {
                console.error("Error fetching group details:", error);
            });
    };

    const fetchGroupMembers = () => {
        axios.get(`http://localhost:3000/group_leader/groups/members/${group_id}`)
            .then(response => {
                const { adultLeaders, youthCampers } = response.data;
                setAdultLeaders(adultLeaders);
                setYouthCampers(youthCampers);
            })
            .catch(error => {
                console.error("Error fetching group members:", error);
            });
    };

    const fetchTeams = () => {
        axios.get(`http://localhost:3000/group_leader/teams/${group_id}`)
            .then(response => {
                setTeams(response.data);
            })
            .catch(error => {
                console.error("Error fetching teams:", error);
            });
    };

    const fetchAvailableCabins = () => {
        axios.get(`http://localhost:3000/group_leader/accommodations/cabins/${campId}`)
            .then(response => {
                setAvailableCabins(response.data);
            })
            .catch(error => {
                console.error("Error fetching available cabins:", error);
            });
    };

    const fetchAvailableTents = () => {
        axios.get(`http://localhost:3000/group_leader/accommodations/tents/${campId}`)
            .then(response => {
                setAvailableTents(response.data);
            })
            .catch(error => {
                console.error("Error fetching available tents:", error);
            });
    };

    const createTeam = () => {
        if (!teamName || !selectedLeader) {
            alert('Please provide a team name and select an adult leader');
            return;
        }

        axios.post('http://localhost:3000/group_leader/teams', {
            group_id,
            team_name: teamName,
            adult_leader_id: selectedLeader
        })
            .then(response => {
                setTeams([...teams, response.data]);
                setTeamName('');
                setSelectedLeader('');
                fetchGroupMembers();  // Refresh members list after creating team
                fetchTeams();  // Refresh teams list after creating team
            })
            .catch(error => {
                console.error("Error creating team:", error);
            });
    };

    const addCamperToTeam = () => {
        if (!selectedTeam || !selectedCamper) {
            alert('Please select a team and a camper to add');
            return;
        }

        axios.post('http://localhost:3000/group_leader/teams/add_camper', {
            team_id: selectedTeam,
            camper_id: selectedCamper
        })
            .then(response => {
                alert('Camper added to team successfully');
                fetchTeams();  // Refresh teams list after adding camper
                fetchGroupMembers();  // Refresh members list after adding camper
            })
            .catch(error => {
                console.error("Error adding camper to team:", error);
            });
    };

    const updateLeaderInTeam = (team_id, leader_id) => {
        axios.put(`http://localhost:3000/group_leader/teams/update_leader/${team_id}/${leader_id}`)
            .then(response => {
                alert('Leader updated successfully');
                fetchTeams();  // Refresh teams list after updating leader
                fetchGroupMembers();  // Refresh members list after updating leader
            })
            .catch(error => {
                console.error("Error updating leader in team:", error);
            });
    };

    const assignAccommodationToLeader = (team_id, leader_id) => {
        const camp_id = groupDetails.camp_id; // Assuming camp_id is part of groupDetails

        axios.post('http://localhost:3000/group_leader/teams/assign_accommodation/leader', {
            accommodation_id: selectedAccommodation,
            leader_id,
            camp_id
        })
            .then(response => {
                alert('Leader accommodation assigned successfully');
                fetchTeams();  // Refresh teams list after assigning accommodation
            })
            .catch(error => {
                if (error.response.status === 400) {
                    alert('Accommodation is already assigned to this camper');
                }
                console.error("Error assigning accommodation to leader:", error);
            });
    };

    const assignAccommodationToCamper = (team_id, camper_id) => {
        const camp_id = groupDetails.camp_id; // Assuming camp_id is part of groupDetails

        axios.post('http://localhost:3000/group_leader/teams/assign_accommodation/camper', {
            accommodation_id: selectedAccommodation,
            camper_id,
            camp_id
        })
            .then(response => {
                alert('Camper accommodation assigned successfully');
                fetchTeams();  // Refresh teams list after assigning accommodation
            })
            .catch(error => {
                if (error.response.status === 400) {
                    alert('Accommodation is already assigned to this camper');
                }

                console.error("Error assigning accommodation to camper:", error);
            });
    };

    const removeLeaderFromTeam = (team_id, leader_id) => {
        axios.put(`http://localhost:3000/group_leader/teams/remove_leader/${team_id}/${leader_id}`)
            .then(response => {
                alert('Leader removed from team successfully');
                fetchTeams();  // Refresh teams list after removing leader
                fetchGroupMembers();  // Refresh members list after removing leader
            })
            .catch(error => {
                console.error("Error removing leader from team:", error);
            });
    };

    const removeCamperFromTeam = (team_id, camper_id) => {
        axios.delete(`http://localhost:3000/group_leader/teams/remove_camper/${team_id}/${camper_id}`)
            .then(response => {
                alert('Camper removed from team successfully');
                fetchTeams();  // Refresh teams list after removing camper
                fetchGroupMembers();  // Refresh members list after removing camper
            })
            .catch(error => {
                console.error("Error removing camper from team:", error);
            });
    };

    const deleteTeam = (team_id) => {
        axios.delete(`http://localhost:3000/group_leader/teams/delete/${team_id}`)
            .then(response => {
                alert('Team deleted and members released successfully');
                fetchTeams();  // Refresh teams list after deleting team
                fetchGroupMembers();  // Refresh members list after deleting team
            })
            .catch(error => {
                console.error("Error deleting team:", error);
            });
    };

    return (
        <div className="main-content mx-auto p-6">
            <h1 className="text-4xl font-bold mb-6">Manage Group: {groupDetails.group_name}</h1>
            
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Create Team</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Team Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <select
                        value={selectedLeader}
                        onChange={(e) => setSelectedLeader(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Select Adult Leader</option>
                        {adultLeaders.map(leader => (
                            <option key={leader.adult_leader_id} value={leader.adult_leader_id}>
                                {leader.first_name} {leader.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={createTeam}
                >
                    Create Team
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Add Camper to Team</h2>
                <div className="mb-4">
                    <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Select Team</option>
                        {teams.map(team => (
                            <option key={team.team_id} value={team.team_id}>
                                {team.team_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <select
                        value={selectedCamper}
                        onChange={(e) => setSelectedCamper(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Select Camper</option>
                        {youthCampers.map(camper => (
                            <option key={camper.camper_id} value={camper.camper_id}>
                                {camper.first_name} {camper.last_name} {camper.accommodation ? `- Accommodation: ${camper.accommodation}` : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={addCamperToTeam}
                >
                    Add Camper
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Teams</h2>
                {teams.map(team => (
                    <div key={team.team_id} className="mb-6">
                        <h3 className="text-3xl font-semibold">{team.team_name}</h3>
                        <div className="mb-4  grid grid-cols-2">
                        <div>
                        <p className="mb-2">Leader: </p>
                        <p className='mb-2 text-xl'> {team.leader_first_name} {team.leader_last_name}</p>
                        <select
                                value={team.adult_leader_id}
                                onChange={(e) => updateLeaderInTeam(team.team_id, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Replace Leader</option>
                                {adultLeaders.map(leader => (
                                    
                                    <option key={leader.adult_leader_id} value={leader.adult_leader_id}>
                                        {leader.first_name} {leader.last_name}
                                    </option>
                    
                                ))}
                            </select>
                            <p className="mb-2">Current Accommodation: </p>
                            <p>Type: {team.type} Name:{team.location_description}</p>
                                <label className="block text-sm font-medium text-gray-700">Accommodation:</label>
                                <select
                                    value={team.accommodation_id}
                                    onChange={(e) => assignAccommodationToLeader(team.team_id, team.adult_leader_id, false)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Accommodation</option>
                                    {availableCabins.map(accommodation => (
                                        <option key={accommodation.accommodation_id} value={accommodation.accommodation_id}>
                                                    {accommodation.location_description} (Tent) - Occupants: {accommodation.current_occupancy}/{accommodation.capacity}
                                        </option>
                                    ))}
                             </select>


                        <div className="mb-4">
                      
                            <button
                                className="bg-orange-500 text-white px-2 py-1 rounded"
                                onClick={() => removeLeaderFromTeam(team.team_id, team.adult_leader_id)}
                            >
                                Remove Leader
                            </button>
                        </div>
                        </div>
                        <div>
                        <ul className="divide-y divide-gray-200">
                            <p className="mb-2">Members:</p>
                            {team.members.map((member, index) => (
                                <li key={index} className="py-4">
                                    {member.first_name} {member.last_name}
                                    <p className="mt-2"> Current Accommodation: </p>
                                    <p>Type: {member.type} Name: {member.location_description}</p>
                                    <div className="mt-2">
                                        <label className="block text-sm font-medium text-gray-700">Accommodation:</label>
                                        <select
                                            value={member.accommodation_id}
                                            onChange={(e) => assignAccommodationToCamper(team.team_id, member.camper_id, false)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Select Accommodation</option>
                                            {availableTents.map(accommodation => (
                                                <option key={accommodation.accommodation_id} value={accommodation.accommodation_id}>
                                                    {accommodation.location_description} (Tent) - Occupants: {accommodation.current_occupancy}/{accommodation.capacity}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                                        onClick={() => removeCamperFromTeam(team.team_id, member.camper_id)}
                                    >
                                        Remove Camper
                                    </button>
                                </li>
                            ))}
                        </ul>
        </div>

                      
                    </div>
                                      <button
                            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                            onClick={() => deleteTeam(team.team_id)}
                        >
                            Delete Team
                        </button>
                    </div>
                ))}

            </div>
        </div>
    
    );
};

export default ManageGroups;
