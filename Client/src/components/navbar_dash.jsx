import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { GiForestCamp } from 'react-icons/gi';
import '../App.css'; // Make sure to include your CSS file for styling


function Sidebar() {
    const { user, logout } = useUser();
    return (
        <div className="sidebar">
            <div className="sidebar-header">
            </div>
            <ul className="sidebar-menu">
                <li><Link to="/">Home</Link></li>
                {user.role === 'Youth' && <li><Link to={`/youth_camper_dashboard/${user.id}`}>Dashboard</Link></li>}
                {user.role === 'Adult Leader' && <li><Link to={`/adult_leader_dashboard/${user.id}`}>Dashboard</Link></li>}
                {user.role === 'Group Leader' && <li><Link to={`/group_leader_dashboard/${user.id}`}>Dashboard</Link></li>}
                {user.role === 'Admin' && <li><Link to={`/admin_dashboard/${user.id}`}>Dashboard</Link></li>}
                {user.role === 'Staff' && <li><Link to={`/staff_dashboard/${user.id}`}>Dashboard</Link></li>}
                {user.role === 'Manager' && <li><Link to={`/manager_dashboard/${user.id}`}>Dashboard</Link></li>}

                {user.role === 'Youth' && <li><Link to={`/youth_profile/${user.id}`}>Profile</Link></li>}
                {user.role === 'Adult Leader' && <li><Link to={`/adult_leader_profile/${user.id}`}>Profile</Link></li>}
                {user.role === 'Group Leader' && <li><Link to={`/group_leader_profile/${user.id}`}>Profile</Link></li>}
                {user.role === 'Admin' && <li><Link to={`/admin_profile/${user.id}`}>Profile</Link></li>}
                {user.role === 'Staff' && <li><Link to={`/staff_profile/${user.id}`}>Profile</Link></li>}
                {user.role === 'Manager' && <li><Link to={`/manager_profile/${user.id}`}>Profile</Link></li>}
                
                {/* Group Leader */}
                {user.role === 'Group Leader' && <li><Link to={`/group_leader_profile/${user.id}`}>Groups</Link></li>}
                
            </ul>
            <div className="sidebar-footer">
                <button><Link to="/login">Logout</Link></button>
            </div>
        </div>
    );
}
export default Sidebar;