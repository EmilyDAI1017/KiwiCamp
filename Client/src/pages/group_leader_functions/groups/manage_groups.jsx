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
    const [selectedTeamForManagement, setSelectedTeamForManagement] = useState('');

    useEffect(() => {
        fetchGroupDetails();
        fetchGroupMembers();
        fetchTeams();
        fetchAvailableCabins();
        fetchAvailableTents();
    }, [group_id]);

    useEffect(() => {
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
                fetchGroupMembers();
                fetchTeams();
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
                fetchTeams();
                fetchGroupMembers();
            })
            .catch(error => {
                console.error("Error adding camper to team:", error);
            });
    };

    const updateLeaderInTeam = (team_id, leader_id) => {
        axios.put(`http://localhost:3000/group_leader/teams/update_leader/${team_id}/${leader_id}`)
            .then(response => {
                alert('Leader updated successfully');
                fetchTeams();
                fetchGroupMembers();
            })
            .catch(error => {
                console.error("Error updating leader in team:", error);
            });
    };

    const assignAccommodationToLeader = (team_id, leader_id) => {
        const camp_id = groupDetails.camp_id;

        axios.post('http://localhost:3000/group_leader/teams/assign_accommodation/leader', {
            accommodation_id: selectedAccommodation,
            leader_id,
            camp_id
        })
            .then(response => {
                alert('Leader accommodation assigned successfully');
                fetchTeams();
            })
            .catch(error => {
                if (error.response.status === 400) {
                    alert('Accommodation is already assigned to this leader');
                }
                console.error("Error assigning accommodation to leader:", error);
            });
    };

    const assignAccommodationToCamper = (team_id, camper_id) => {
        const camp_id = groupDetails.camp_id;

        axios.post('http://localhost:3000/group_leader/teams/assign_accommodation/camper', {
            accommodation_id: selectedAccommodation,
            camper_id,
            camp_id
        })
            .then(response => {
                alert('Camper accommodation assigned successfully');
                fetchTeams();
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
                fetchTeams();
                fetchGroupMembers();
            })
            .catch(error => {
                console.error("Error removing leader from team:", error);
            });
    };

    const removeCamperFromTeam = (team_id, camper_id) => {
        axios.delete(`http://localhost:3000/group_leader/teams/remove_camper/${team_id}/${camper_id}`)
            .then(response => {
                alert('Camper removed from team successfully');
                fetchTeams();
                fetchGroupMembers();
            })
            .catch(error => {
                console.error("Error removing camper from team:", error);
            });
    };

    const deleteTeam = (team_id) => {
        axios.delete(`http://localhost:3000/group_leader/teams/delete/${team_id}`)
            .then(response => {
                alert('Team deleted and members released successfully');
                fetchTeams();
                fetchGroupMembers();
            })
            .catch(error => {
                console.error("Error deleting team:", error);
            });
    };

    useEffect(() => {
        console.log('Selected Team:', selectedTeamForManagement);
        console.log('Teams:', teams);
    }, [selectedTeamForManagement, teams]);
    

    return (
        <div className="main-content bg-cover bg-center bg-no-repeat p-8" 
        style={{ backgroundImage: "url('/src/images/camp_bg2.jpeg')",
                height: '100%',
        }}>
            <div className="container mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl text-green-700 font-bold mb-6">Manage Group: {groupDetails.group_name}</h1>
                <button
            className="mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"


                    onClick={() => navigate(-1)} // Go back to the previous page
                >
                    Back
                </button>
                <div className="bg-white-100/90 p-6 mb-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Create Team</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Team Name"
                            className=" w-fit px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <select
                            value={selectedLeader}
                            onChange={(e) => setSelectedLeader(e.target.value)}
                            className="w-fit px-4 py-2 border border-gray-300 rounded-md"
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
            className="mb-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={createTeam}
                    >
                        Create Team
                    </button>
                </div>

                <div className="bg-white-100/90 p-6 mb-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Add Camper to Team</h2>
                    <div className="mb-4">
                        <select
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)
                            }

                            className=" w-fit px-4 py-2 border border-gray-300 rounded-md"
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
                            className=" w-fit px-4 py-2 border border-gray-300 rounded-md"
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
            className="mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold ml-3 rounded-lg focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={addCamperToTeam}
                    >
                        Add Camper
                    </button>
                </div>

                <div className="bg-white-100/90 p-6 mb-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Manage Teams</h2>
            <div className="mb-4">
                <select
                    value={selectedTeamForManagement}
                    onChange={(e) => setSelectedTeamForManagement(e.target.value)}
                    className="w-fit px-4 py-2 border border-gray-300 rounded-md"
                >
                    <option value="">Select Team to Manage</option>
                    {teams.map(team => (
                        <option key={team.team_id} value={team.team_id}>
                            {team.team_name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedTeamForManagement && (
                <div className="bg-gray-100 p-2 rounded-lg">
                    {teams
                    .filter(team => team.team_id.toString() === selectedTeamForManagement)
                    .map(team => (
                        <div key={team.team_id} className="mb-2 p-3 rounded-lg">
                            <h3 className="text-3xl font-semibold mb-4">{team.team_name}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="mb-2 text-xl"><strong>Leader:</strong> {team.leader_first_name} {team.leader_last_name}</p>
                                    <select
                                        value={team.adult_leader_id}
                                        onChange={(e) => updateLeaderInTeam(team.team_id, e.target.value)}
                                        className="w-fit px-4 py-2 border border-gray-100 rounded-md mb-4"
                                    >
                                        <option value="">Replace Leader</option>
                                        {adultLeaders.map(leader => (
                                            <option key={leader.adult_leader_id} value={leader.adult_leader_id}>
                                                {leader.first_name} {leader.last_name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mb-2"><strong>Current Accommodation:</strong></p>
                                    <p className="mb-4">Type: {team.type} Name: {team.location_description}</p>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Allocate An Accommodation:</label>
                                    <select
                                        value={team.accommodation_id}
                                        onChange={(e) => assignAccommodationToLeader(team.team_id, team.adult_leader_id, e.target.value)}
                                        className="w-fit px-4 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Select Accommodation</option>
                                        {availableCabins.map(accommodation => (
                                            <option key={accommodation.accommodation_id} value={accommodation.accommodation_id}>
                                                {accommodation.location_description} (Cabin) - Occupants: {accommodation.current_occupancy}/{accommodation.capacity}
                                            </option>
                                        ))}
                                    </select>
                                    <br></br>
                                    <button
                                        className="w-fit bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-4"
                                        onClick={() => removeLeaderFromTeam(team.team_id, team.adult_leader_id)}
                                    >
                                        Remove Leader
                                    </button>
                                </div>
                                <div>
                                    <p className="mb-2 text-xl"><strong>Members:</strong></p>
                                    <ul className="divide-y divide-gray-200">
                                        {team.members.map((member, index) => (
                                            <li key={index} className="py-4">
                                                <p className="mb-2"><strong>Name: {member.first_name} {member.last_name}</strong></p>
                                                <p className="mb-2"><strong>Current Accommodation:</strong></p>
                                                <p className="mb-4">Type: {member.type} Name: {member.location_description}</p>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Allocate An Accommodation:</label>
                                                <select
                                                    value={member.accommodation_id}
                                                    onChange={(e) => assignAccommodationToCamper(team.team_id, member.camper_id, e.target.value)}
                                                    className="w-fit px-4 py-2 border border-gray-300 rounded-md"
                                                >
                                                    <option value="">Select Accommodation</option>
                                                    {availableTents.map(accommodation => (
                                                        <option key={accommodation.accommodation_id} value={accommodation.accommodation_id}>
                                                            {accommodation.location_description} (Tent) - Occupants: {accommodation.current_occupancy}/{accommodation.capacity}
                                                        </option>
                                                    ))}
                                                </select>
                                                <br></br>
                                                <button
                                                    className="w-fit bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-4"
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
                                className="w-fit bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-4"
                                onClick={() => deleteTeam(team.team_id)}
                            >
                                Delete Team
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>




    </div>
</div>
    );
}

export default ManageGroups;
