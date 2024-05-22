import { useState } from 'react'
import './App.css'




import Navbar from './components/sidenav'
import Home from './pages/home'
import About from './pages/about'
import Contact from './pages/contact'
import Login from './pages/login'
import Register from './pages/register'
import ResetPassword from './pages/reset_password'
import ResetForm from './pages/reset_form';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

//Registration
import Youth from "./pages/registration/youth_camper";
import Adult_Leader from "./pages/registration/adult_leader";
import Group_Leader from "./pages/registration/group_leader";

//Dashboards
import Youth_Dashboard from './pages/dashboards/youth_dashboard'
import Adult_Leader_Dashboard from './pages/dashboards/adult_leader_dashboard'
import Group_Leader_Dashboard from './pages/dashboards/group_leader_dashboard'
import Admin_Dashboard from './pages/dashboards/admin_dashboard'
import Staff_Dashboard from './pages/dashboards/staff_dashboard'
import Manager_Dashboard from './pages/dashboards/manager_dashboard'

//Profiles
import Youth_Profile from './pages/profiles/youth_profile'
import Adult_Leader_Profile from './pages/profiles/adult_leader_profile'
import Group_Leader_Profile from './pages/profiles/group_leader_profile'
import Admin_Profile from './pages/profiles/admin_profile'
import Staff_Profile from './pages/profiles/staff_profile'
import Manager_Profile from './pages/profiles/manager_profile'
import Logout from './pages/logout'
import NotFound from './components/notfound'

//Admin Functions
import DiscountManagement from './pages/admin_functions/discount_management';
import ManageAccommodations from './pages/admin_functions/manage_accommodations';
import ManageActivities from './pages/admin_functions/manage_activities';
import ManageCamps from './pages/admin_functions/manage_camps';
import ManageUsers from "./pages/admin_functions/manage_users";
import NewsEdit from "./pages/admin_functions/news_edit";
import ReportGenerate from "./pages/admin_functions/report_generation";
import ManageGrounds from "./pages/admin_functions/manage_grounds";

//Manager Users Accounts
import ManageCampers from "./pages/admin_functions/manage_users/manage_users_campers";
import ManageYouth from "./pages/admin_functions/manage_users/manage_youth";
import ManageLeaders from "./pages/admin_functions/manage_users/manage_leaders";
import ManageTeams from "./pages/admin_functions/manage_users/manage_teams";
import ManageManagers from "./pages/admin_functions/manage_users/manage_managers";
import ManageStaff from "./pages/admin_functions/manage_users/manage_staff";

//Manage Camps
import ManageApplications from "./pages/admin_functions/manage_camps/manage_applications";
import ManagerCampsInfo from './pages/admin_functions/manage_camps/manager_camps_info'
import ManageGroups from "./pages/admin_functions/manage_camps/manage_groups";


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
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/reset/:token" element={<ResetForm />} />

        {/* Registration */}
        <Route path="/register/youth_camper" element={<Youth />} />
        <Route path="/register/adult_leader" element={<Adult_Leader />} />
        <Route path="/register/group_leader" element={<Group_Leader />} />
        {/* \Dashboards */}
        <Route path="/youth_camper_dashboard/:id" element={<Youth_Dashboard />} />        
        <Route path="/adult_leader_dashboard/:id" element={<Adult_Leader_Dashboard />} />
        <Route path="/group_leader_dashboard/:id" element={<Group_Leader_Dashboard />} />
        <Route path="/admin_dashboard/:id" element={<Admin_Dashboard />} />
        <Route path="/staff_dashboard/:id" element={<Staff_Dashboard />} />
        <Route path="/manager_dashboard/:id" element={<Manager_Dashboard />} />
        {/* Profiles */}
        <Route path="/youth_profile/:id" element={<Youth_Profile/>} />
        <Route path="/adult_leader_profile/:id" element={<Adult_Leader_Profile/>} />
        <Route path="/group_leader_profile/:id" element={<Group_Leader_Profile/>} />
        <Route path="/admin_profile/:id" element={<Admin_Profile/>} />
        <Route path="/staff_profile/:id" element={<Staff_Profile/>} />
        <Route path="/manager_profile/:id" element={<Manager_Profile/>} />
        <Route path="/logout" element={<Logout />} /> 
       
        <Route path="*" element={<NotFound />} />

      {/* Admin Functions */}
      <Route path="/admin/manage_users" element={<ManageUsers />} />
            {/* Admin manage users */}
            <Route path="/admin/manage_users/campers" element={<ManageCampers />} />  
            <Route path="/admin/manage_users/manage_youth" element={<ManageYouth/>} />
            <Route path="/admin/manage_users/manage_leaders" element={<ManageLeaders />} />
            <Route path="/admin/manage_users/manage_teams" element={<ManageTeams />} />
            <Route path="/admin/manage_users/manage_managers" element={<ManageManagers />} />
            <Route path="/admin/manage_users/manage_staff" element={<ManageStaff />} />

      <Route path="/admin/manage_grounds" element={<ManageGrounds />} />
      <Route path="/admin/manage_camps" element={<ManageCamps />} />
      {/* Admin manage camps */}
          <Route path="/admin/manage_camps/manage_applications" element={<ManageApplications />} />
          <Route path="/admin/manage_camps/manager_camps_info" element={<ManagerCampsInfo />} />
          <Route path="/admin/manage_camps/manage_groups" element={<ManageGroups />} />

      <Route path="/admin/manage_activities" element={<ManageActivities />} />
      <Route path="/admin/manage_accommodations" element={<ManageAccommodations />} />
      <Route path="/admin/discount_management" element={<DiscountManagement />} />
      <Route path="/admin/news_edit" element={<NewsEdit />} />
      <Route path="/admin/report_generate" element={<ReportGenerate />} />      
      
      {/* Group Leader Functions */}
      
    
          </Routes>
          </UserProvider>

      
    </div>
  );
}

export default App;
