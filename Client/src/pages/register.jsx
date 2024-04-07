import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const [selectedRole, setSelectedRole] = useState("");
    const navigate = useNavigate(); // Renamed to navigate

    const handleRoleSelection = (role) => {
        setSelectedRole(role);
        // Redirect to the corresponding registration page based on role
        navigate( `/register/${role.toLowerCase().replace(' ', '_')}`); // Correct usage of navigate 
        // `../pages/registration/${role.toLowerCase().replace(' ', '_')}`
    };

    return (
        <div>
            <h1>Register for Kiwi Camp</h1>
            <p>I want to sign up as a:</p>
            <button onClick={() => handleRoleSelection("Youth Camper")}>Youth Camper</button>
            <button onClick={() => handleRoleSelection("Adult Leader")}>Adult Leader</button>
            <button onClick={() => handleRoleSelection("Group Leader")}>Group Leader</button>
        </div>
    );
}