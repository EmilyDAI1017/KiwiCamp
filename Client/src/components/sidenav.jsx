import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../App.css';

function Navbar() {
    const { user, logout } = useUser();
    console.log(user.role)	// Debugging
    return (
        <nav  className="nav">
           <a href="/" className="site-title">Kiwi Camp</a>
            {/* Navigation links */}
            {user.isLoggedIn ? (
         <ul>
            <li><Link to="/">Home</Link></li>
            {user.role === 'Youth' && <li><Link to={`/youth_camper_dashboard/${user.id}`}>Dashboard</Link></li>}
            {user.role === 'Adult Leader' && <li><Link to={`/adult_leader_dashboard/${user.id}`}>Dashboard</Link></li>}
            {user.role === 'Group Leader' && <li><Link to={`/group_leader_dashboard/${user.id}`}>Dashboard</Link></li>}
            {user.role === 'Admin' && <li><Link to={`/admin_dashboard/${user.id}`}>Dashboard</Link></li>}
            {user.role === 'Staff' && <li><Link to={`/staff_dashboard/${user.id}`}>Dashboard</Link></li>}
            {user.role === 'Manager' && <li><Link to={`/manager_dashboard/${user.id}`}>Dashboard</Link></li>}
            <li><Link to={`/profile/${user.id}`}>Profile</Link></li>
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
        </nav>
    );
}

export default Navbar;
// import React from "react"
// import {AiOutlineMenu} from "react-icons/ai"
// import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import '../App.css'
// import { useUser } from '../contexts/UserContext';

// export default function Navbar({ isLoggedIn }) {
//     const { user, logout } = useUser();
//     const guestLinks = (
        // <>
        //   <li><Link to="/">Home</Link></li>
        //   <li><Link to="/about">About</Link></li>
        //   <li><Link to="/contact">Contact</Link></li>
        //   <li><Link to="/login">Login</Link></li>
        //   <li><Link to="/register">Register</Link></li>
        // </>
//       );

//       const userLinks = (
//         <>
//           <li><Link to="/">Home</Link></li>
//           {/* Add additional authenticated user links here */}
//           <li><Link to={`/profile/${id}`}>Profile</Link></li>
//           <li><Link to="/logout">Logout</Link></li>
//         </>
//       );
    
//       return (
//         <nav className="nav">
//           <a href="/" className="site-title">Kiwi Camp</a>
    
//           <ul>
//             {isLoggedIn ? userLinks : guestLinks}
//           </ul>
//         </nav>
//       );
    
    //   return (
    //     <nav>
    //         {/* Navigation links */}
    //         {user.isLoggedIn ? (
    //             <ul>
    //                 <li><Link to="/">Home</Link></li>
    //                 <li><Link to={`/profile/${user.id}`}>Profile</Link></li>
    //                 <li><button onClick={logout}>Logout</button></li>
    //             </ul>
    //         ) : (
    //             <ul>
    //                 <li><Link to="/login">Login</Link></li>
    //                 <li><Link to="/register">Register</Link></li>
    //             </ul>
    //         )}
    //     </nav>
    // );
// }
//     return (
//         <nav className="nav">
//             <a href="/" className="site-title">Kiwi Camp</a>

//         <ul>
//             <li><a href="/">Home</a></li>
//             <li><a href="/about">About</a></li>
//             <li><a href="/contact">Contact</a></li>
//             <li><a href="/login">Login</a></li>
//             <li><a href="/register">Register</a></li>

//         </ul>

//         </nav>
//     )
// }
