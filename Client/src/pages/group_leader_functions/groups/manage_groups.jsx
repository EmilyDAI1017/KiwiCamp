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

    const [groupDetails, setGroupDetails] = useState({});
    const [adultLeaders, setAdultLeaders] = useState([]);
    const [youthCampers, setYouthCampers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [selectedLeader, setSelectedLeader] = useState('');
    const [selectedCamper, setSelectedCamper] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');

    useEffect(() => {
        fetchGroupDetails();
        fetchGroupMembers();
        fetchTeams();
    }, [group_id]);

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
    
    // After adding a camper to a team
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
    
    // After removing a leader from a team
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
    
    // After removing a camper from a team
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

    const assignAccommodationToLeader = (team_id, leader_id) => {
        const camp_id = groupDetails.camp_id; // Assuming camp_id is part of groupDetails
    
        axios.post('http://localhost:3000/group_leader/teams/assign_accommodation/leader', {
            team_id,
            leader_id,
            camp_id
        })
            .then(response => {
                alert('Leader accommodation assigned successfully');
                fetchTeams();  // Refresh teams list after assigning accommodation
            })
            .catch(error => {
                if (error.response.status === 400) {
                    alert('The Leader has been assigned an accommodation');
                }
                console.error("Error assigning accommodation to leader:", error);
            });
    };

    const assignAccommodationToCamper = (team_id, camper_id) => {
        const camp_id = groupDetails.camp_id; // Assuming camp_id is part of groupDetails
    
        axios.post('http://localhost:3000/group_leader/teams/assign_accommodation/camper', {
            team_id,
            camper_id,
            camp_id
        })
            .then(response => {
                alert('Camper accommodation assigned successfully');
                fetchTeams();  // Refresh teams list after assigning accommodation
            })
            .catch(error => {
                if (error.response.status === 400) {
                    alert('The Camper has been assigned an accommodation');
                }
                
                console.error("Error assigning accommodation to camper:", error);
            });
    };

    return (
    <div className="container mx-auto p-6">
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
                            {camper.first_name} {camper.last_name}
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
                    <h3 className="text-xl font-semibold">{team.team_name}</h3>
                    <p className="mb-2">Leader: {team.leader_first_name} {team.leader_last_name}</p>
                    <div className="mb-4">
                        <select
                            value={team.adult_leader_id}
                            onChange={(e) => updateLeaderInTeam(team.team_id, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Choose Leader</option>
                            {adultLeaders.map(leader => (
                                <option key={leader.adult_leader_id} value={leader.adult_leader_id}>
                                    {leader.first_name} {leader.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {team.members.map((member, index) => (
                            <li key={index} className="py-4  items-center">
                                <div className=" space-x-4">
                                    <p className="text-lg font-medium text-gray-900">
                                        {member.first_name} {member.last_name}
                                    </p>
                                </div>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                                    onClick={() => removeCamperFromTeam(team.team_id, member.camper_id)}
                                >
                                    Remove Camper
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                        onClick={() => assignAccommodationToLeader(team.team_id, team.adult_leader_id)}
                    >
                        Assign Leader Accommodation
                    </button>
                    {team.members.map(member => (
                        <button
                            key={member.camper_id}
                            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                            onClick={() => assignAccommodationToCamper(team.team_id, member.camper_id)}
                        >
                            Assign Accommodation to {member.first_name}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    </div>
);
}


export default ManageGroups;
