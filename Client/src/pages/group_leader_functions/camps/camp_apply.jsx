import  React, { useState, useEffect } from 'react';  
import { Link } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';

const CampApplication = () => {
    const { user, logout } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [applicationData, setApplicationData] = useState(null);

return (

<div>
    <h1>Camp Application</h1>
    <div className="container">

    </div>
</div>
);
}   

export default CampApplication;