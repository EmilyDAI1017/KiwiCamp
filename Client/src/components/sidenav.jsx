

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { GiForestCamp } from 'react-icons/gi';
import Sidebar from './navbar_dash'; 
import '../App.css'; 

function Navbar() {
    const { user, logout } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="navbar-wrapper">
            <nav className="nav">
                <a href="/" className="site-title text-8xl"><GiForestCamp className="site-title text-6xl text-yellow-200"  /> <p className='text-5xl'>Kiwi Camp</p></a>
                <button onClick={() => setIsOpen(!isOpen)} className="text-green-600 text-3xl md:hidden focus:outline-none">
                    <span>☰</span>
                </button>
                <div className={`${isOpen ? 'smallbar' : ''} ${isOpen ? 'block' : 'hidden'} w-full md:w-auto md:flex md:items-center text-1rem`}>
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
                            <li><button onClick={logout}><Link to="/login">Logout</Link></button></li>
                        </ul>
                    ) : (
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </ul>
                    )}
                </div>
            </nav>
  
        </div>
    );
}

export default Navbar;
