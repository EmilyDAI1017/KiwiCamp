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
import ManagePaymentDiscount from './pages/admin_functions/manage_payment_discount/payment_discount.jsx'
import ManageDiscounts from './pages/admin_functions/manage_payment_discount/manage_discount';
import ManagePayment from './pages/admin_functions/manage_payment_discount/manage_payment';
import ManageAccommodations from './pages/admin_functions/manage_accommodations';
import ManageActivities from './pages/admin_functions/manage_activities';
import ManageCamps from './pages/admin_functions/manage_camps';
import ManageUsers from "./pages/admin_functions/manage_users";
import ManageNews from "./pages/admin_functions/news_edit";
import ReportGenerate from "./pages/admin_functions/report_generation";
import ManageGrounds from "./pages/admin_functions/manage_grounds";
import AssignAcToCamps from './pages/admin_functions/assign_ac_to_camps.jsx';
import Activities from './pages/admin_functions/activities.jsx';

//Admin manager Users Accounts
import ManageCampers from "./pages/admin_functions/manage_users/manage_users_campers";
import ManageYouth from "./pages/admin_functions/manage_users/manage_youth";
import ManageLeaders from "./pages/admin_functions/manage_users/manage_leaders";
import ManageTeams from "./pages/admin_functions/manage_users/manage_teams";
import ManageManagers from "./pages/admin_functions/manage_users/manage_managers";
import ManageStaff from "./pages/admin_functions/manage_users/manage_staff";

//Admin manage Camps
import ManageRegistrations from "./pages/admin_functions/manage_camps/manage_camp_registrations.jsx";
import ManagerCampsInfo from './pages/admin_functions/manage_camps/manager_camps_info'
import ManageGroups from "./pages/admin_functions/manage_camps/manage_groups";


//Group Leader Functions
import Gl_Groups from "./pages/group_leader_functions/gl_groups";
import CampApplication from "./pages/group_leader_functions/camps/camp_apply";
import GroupApplication from "./pages/group_leader_functions/groups/group_apply";
import GLManageGroups from './pages/group_leader_functions/groups/manage_groups';
import GroupApplicationForm from './pages/group_leader_functions/groups/group_application_form';
import ManageMyPaymentGroupLeader from './pages/group_leader_functions/manage_my_payment_group_leader';
import BankInfo from './pages/bank_info';
import MyCampers from './pages/group_leader_functions/my_campers.jsx'

//Youth Camper Functions
import RegisterCamps from './pages/youth_functions/register_camps_youth';
import CampDetailsY from './pages/youth_functions/camp_details_youth';
import Youth_Pay from './pages/youth_functions/youth_pay';
import CampersCardPaymentYouth from './pages/youth_functions/campers_card_payment_youth';
import CampersSuccessPayYouth from './pages/youth_functions/campers_success_pay_youth.jsx';
import BankInfoYouth from './pages/youth_functions/bank_info_youth.jsx';
import ManageMyPaymentYouth from './pages/youth_functions/manage_my_payment_youth';
import RegisterActivities from './pages/youth_functions/register_activities.jsx'
import PayForActivities from './pages/youth_functions/pay_for_activities.jsx'
import ActivityCardPaymentYouth from './pages/youth_functions/activities_card_payment_youth.jsx'
import MyCamps from './pages/youth_functions/camps_functions.jsx'
import TeamsAndAccommodations from './pages/youth_functions/teams_and_accommodations.jsx'

//Adult Leader Functions
import RegisterCamps_AL from './pages/adult_leader_functions/register_camps_al';
import CampDetails from './pages/adult_leader_functions/camp_details'
import Adult_Pay from './pages/adult_leader_functions/adult_pay'
import CampersCardPayment from './pages/adult_leader_functions/campers_card_payment'
import CampersSuccessPay from './pages/adult_leader_functions/campers_success_pay'
import BankInfoAd from './pages/adult_leader_functions/bank_info_ad.jsx'  
import ManageMyPaymentAdult from './pages/adult_leader_functions/manage_my_payment_adult';
import TeamsAndAccommodationsAL from './pages/adult_leader_functions/teams_and_accom.jsx'
import MyCampsAL from './pages/adult_leader_functions/camp_functions_al.jsx'
import LeaderCampers from './pages/adult_leader_functions/all_youth_campers.jsx'

//Staff Functions (different from admin part)
import ViewGrounds from './pages/staff_functions/view_grounds.jsx'  

//Manager Functions (different from admin part)
import ManageUsersM from './pages/manager_functions/manage_users.jsx'


//Payment
import Payment from './pages/payment';
import CardPayment from './pages/card_payment';
import SuccessPay from './pages/group_leader_functions/groups/group_success_pay';
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
        <Route path="/card_payment" element={<CardPayment />} />


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
          <Route path="/admin/manage_camps/manage_camp_registrations" element={<ManageRegistrations />} />
          <Route path="/admin/manage_camps/manager_camps_info" element={<ManagerCampsInfo />} />
          <Route path="/admin/manage_camps/manage_groups" element={<ManageGroups />} />
    <Route path="/admin/manage_payment_discount" element={<ManagePaymentDiscount />} />
     <Route path="/admin/manage_payment" element={<ManagePayment />} />
      <Route path="/admin/manage_discounts" element={<ManageDiscounts />} />
      <Route path="/admin/activities" element={<Activities />} />
          <Route path="/admin/manage_activities" element={<ManageActivities />} />
          <Route path="/admin/assign_ac_to_camps" element={<AssignAcToCamps />} />

      <Route path="/admin/manage_accommodations" element={<ManageAccommodations />} />
      <Route path="/admin/manage_discount" element={<ManageDiscounts />} />
      <Route path="/admin/news_edit" element={<ManageNews />} />
     
      <Route path="/admin/report_generate" element={<ReportGenerate />} />      
      
      {/* Staff Functions (different from admin part) */}
      <Route path="/staff_functions/view_grounds" element={<ViewGrounds />} />
      {/* Manager Functions (different from admin part) */}
      <Route path="/manager_functions/manage_users" element={<ManageUsersM />} />

      {/* Group Leader Functions */}
      <Route path='/group_leader_functions/gl_groups/:id' element={<Gl_Groups />} />
      <Route path='/group_leader_functions/camps/camp_apply/:id' element={<CampApplication />} />
      <Route path='/group_leader_functions/groups/group_apply/:id' element={<GroupApplication />} />
      <Route path='/group_leader_functions/groups/manage_groups/:id' element={<GLManageGroups />} />
      <Route path='/group_leader_functions/groups/group_application_form/:id' element={<GroupApplicationForm />} />
      <Route path="/groups/payment" element={<Payment />} />
      <Route path="/group_leader_functions/groups/group_success_pay/:user_id" element={<SuccessPay />} />
      <Route path="/group_leader_functions/manage_my_payment_group_leader/:user_id" element={<ManageMyPaymentGroupLeader  />} />
      <Route path="/bank_info/:user_id" element={<BankInfo />} />
      <Route path="/group_leader_functions/my_campers/:user_id" element={<MyCampers />} />

      {/* Youth Camper functions */}
      <Route path="/youth_camper_functions/register_camps/:id" element={<RegisterCamps />} />
      <Route path="/youth_register_camps/camps/:camp_id" element={<CampDetailsY />} />
      <Route path="/youth_camper_functions/youth_pay/:user_id" element={<Youth_Pay />} />
      <Route path="/youth_camper_functions/campers_card_payment" element={<CampersCardPaymentYouth />} />
      <Route path="/youth_camper_functions/campers_success_pay/:user_id" element={<CampersSuccessPayYouth />} />
      <Route path="/youth_camper_functions/bank_info_youth/:user_id" element={<BankInfoYouth />} />
      <Route path='/youth_camper_functions/manage_my_payment_youth/:user_id' element={<ManageMyPaymentYouth />} />
      <Route path="/camper_functions/my_camps/:user_id" element={<RegisterActivities />} />
      <Route path='/youth_camper_functions/register_activities/pay/:user_id' element={<PayForActivities />} />
      <Route path='/youth_camper_functions/activity_card_payment' element={<ActivityCardPaymentYouth />} />
      <Route path='/camper_functions/camps/:user_id' element={<MyCamps />} />
      <Route path='/camps_functions/teams_and_accommodations/:user_id' element={<TeamsAndAccommodations />} />


      {/* Adult Leader functions */}
      <Route path="/adult_leader_functions/register_camps_al/:id" element={<RegisterCamps_AL />} />
      <Route path="/adult_register_camps/camps/:camp_id" element={<CampDetails />} />
      <Route path="/adult_leader_functions/adult_pay/:user_id" element={<Adult_Pay />} />
      <Route path="/adult_leader_functions/campers_card_payment" element={<CampersCardPayment />} />
      <Route path="/adult_leader_functions/campers_success_pay/:user_id" element={<CampersSuccessPay />} />
      <Route path="/adult_leader_functions/bank_info_ad/:user_id" element={<BankInfoAd />} />
      <Route path='/adult_leader_functions/manage_my_payment_adult/:user_id' element={<ManageMyPaymentAdult />} />
      <Route path='/adult_leader_functions/teams_and_accommodations/al/:user_id' element={<TeamsAndAccommodationsAL />} />
      <Route path='/adult_leader_functions/camp_functions_al/:user_id' element={<MyCampsAL />} />
      <Route path='/adult_leader_functions/camps/campers/:user_id' element={<LeaderCampers />} />
          </Routes>
          </UserProvider>

    

      
    </div>
  );
}

export default App;
