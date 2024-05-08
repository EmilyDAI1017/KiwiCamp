import { useState } from 'react'
import './App.css'




import Navbar from './components/sidenav'
import Home from './pages/home'
import About from './pages/about'
import Contact from './pages/contact'
import Login from './pages/login'
import Register from './pages/register'
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

import Youth from "./pages/registration/youth_camper";
import Adult_Leader from "./pages/registration/adult_leader";
import Group_Leader from "./pages/registration/group_leader";
import Youth_Dashboard from './pages/dashboards/youth_dashboard'
import Adult_Leader_Dashboard from './pages/dashboards/adult_leader_dashboard'
import Group_Leader_Dashboard from './pages/dashboards/group_leader_dashboard'
import Admin_Dashboard from './pages/dashboards/admin_dashboard'
import Staff_Dashboard from './pages/dashboards/staff_dashboard'
import Manager_Dashboard from './pages/dashboards/manager_dashboard'
import Youth_Profile from './pages/profiles/youth_profile'
import Adult_Leader_Profile from './pages/profiles/adult_leader_profile'
import Logout from './pages/logout'
import NotFound from './components/notfound'


function App() {

  return (
    <div className="container">
      
  
        <UserProvider>

        <Navbar />
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
        <Route path="/admin_dashboard/:id" element={<Admin_Dashboard />} />
        <Route path="/staff_dashboard/:id" element={<Staff_Dashboard />} />
        <Route path="/manager_dashboard/:id" element={<Manager_Dashboard />} />

        <Route path="/youth_profile/:id" element={<Youth_Profile/>} />
        <Route path="/adult_leader_profile/:id" element={<Adult_Leader_Profile/>} />
        <Route path="/logout" element={<Logout />} /> 
        <Route path="*" element={<NotFound />} />
        
       </Routes>
       </UserProvider>

      
    </div>
  );
}

export default App;
