import { useState } from 'react'
import './App.css'
import Navbar from './components/sidenav'
import Home from './pages/home'
import About from './pages/about'
import Contact from './pages/contact'
import Login from './pages/login'
import Register from './pages/register'
import { Route, Routes } from "react-router-dom"

import Youth from "./pages/registration/youth_camper";
import Adult_Leader from "./pages/registration/adult_leader";
import Group_Leader from "./pages/registration/group_leader";
import Youth_Dashboard from './pages/dashborads/youth_dashborad'
import Adult_Leader_Dashboard from './pages/dashborads/adult_leader_dashboard'
import Group_Leader_Dashboard from './pages/dashborads/group_leader_dashboard'
import Admin_Dashboard from './pages/dashborads/admin_dashboard'
import Staff_Dashboard from './pages/dashborads/staff_dashboard'
import Manager_Dashboard from './pages/dashborads/manager_dashboard'



function App() {

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/youth_camper" element={<Youth />} />
          <Route path="/register/adult_leader" element={<Adult_Leader />} />
          <Route path="/register/group_leader" element={<Group_Leader />} />
          <Route path="/youth_camper_dashboard/:id" element={<Youth_Dashboard />} />
          <Route path="/adult_leader_dashboard/:id" element={<Adult_Leader_Dashboard />} />
          <Route path="/group_leader_dashboard/:id" element={<Group_Leader_Dashboard />} />
          <Route path="/admin_dashboard" element={<Admin_Dashboard />} />
          <Route path="/staff_dashboard" element={<Staff_Dashboard />} />
          <Route path="/manager_dashboard" element={<Manager_Dashboard />} />
        </Routes>
      </div>
    </>
    
  )
}

export default App
