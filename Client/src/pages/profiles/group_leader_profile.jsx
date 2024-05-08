import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"

export default function Group_Leader_Profile() {
    const { id } = useParams();
    const [groupLeaderData, setGroupLeaderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:3000/group_leader_dashboard/${id}`)
        .then(res => {
            setGroupLeaderData(res.data.group_leader);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setError("Failed to load data");
            setIsLoading(false);
        });
    }, [id]);
    
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
    
        if(!groupLeaderData.first_name) {
            alert("Please enter the group leader's first name")
            return
        }
        if(!groupLeaderData.last_name) {
            alert("Please enter the group leader's last name")
            return
        }
        if(!groupLeaderData.email) {
            alert('Please enter email')
            return
        }
        if(!groupLeaderData.phone_num) {
            alert('Please enter contact number')
            return
        }
        if(!groupLeaderData.first_name) {
            alert("Please enter the your first name")
            return
        }
        if(!groupLeaderData.last_name) {
            alert("Please enter the your last name")
            return
        }
        if(!groupLeaderData.email) {
            alert('Please enter email')
            return
        }
        if(!groupLeaderData.phone_num) {
            alert('Please enter contact number')
            return
        }
        if (!groupLeader.dob) {
            alert("Please enter the group leader's date of birth")
            return
        }
