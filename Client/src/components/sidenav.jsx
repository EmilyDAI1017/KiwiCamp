import React from "react"
import {AiOutlineMenu} from "react-icons/ai"
import '../App.css'

export default function Navbar() {
    return (
        <nav className="nav">
            <a href="/" className="site-title">Kiwi Camp</a>

        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>

        </ul>

        </nav>
    )
}
// const Sidenav = () => {
//    return (
//       <div>
//             <div className="sidenav">
//                 <div className="sidenav-header">
//                 <div className="sidenav-header-icon">
//                     <AiOutlineMenu />
//                 </div>
//                 <div className="sidenav-header-title">
//                     <h1>My Sidenav</h1>
//                 </div>
//                 </div>
//                 <div className="sidenav-list">
//                 <ul>
//                     <li>Home</li>
//                     <li>About</li>
//                     <li>Contact</li>
//                 </ul>
//                 </div>
//             </div>
//       </div>
//    )
// }

// export default Sidenav
