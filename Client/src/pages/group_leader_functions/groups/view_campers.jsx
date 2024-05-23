import React from "react";
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const ViewCampers = () => {
    const { user, logout } = useUser();
    return (
        <div>
            <h1>View Campers</h1>
        </div>
    );
};

export default ViewCampers;