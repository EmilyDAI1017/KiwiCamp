import React, {useState}from 'react';

import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../App.css';

function Navbar() {
    const { user, logout } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    console.log(user.role)	// Debugging
    return (
        <nav  className="nav">
           <a href="/" className="site-title">Kiwi Camp</a>
            {/* Navigation links */}
            <button onClick={() => setIsOpen(!isOpen)} className="text-white md:hidden">
                <span>☰</span>
            </button>
            <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:items-center w-full md:w-auto`}>
            {user.isLoggedIn ? (
         <ul>
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
            <li><button className="logout" onClick={logout}><Link to="/login">Logout</Link></button></li>
        </ul>
            ) : (
                <ul>
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
                </ul>
            )}
            </div>
        </nav>
    );
}

export default Navbar;
