import React from "react";
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const ManagerCamps = () => {
    const { user, logout } = useUser();
    return (
        <div>
            <h1>Manager Camps</h1>
        </div>
    );
};

export default ManagerCamps;