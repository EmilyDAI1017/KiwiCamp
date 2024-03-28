import { useState } from "react"

export default function Login(){

    const [pwdHidden, setPwdHidden] =  useState('password')

    const [ formData, setFormData ] = useState({
        username: '',
        password: ''
    })
    
    const togglePwdShow = (e) => {
        e.preventDefault()
        pwdHidden === 'text' ? setPwdHidden('password') :
        setPwdHidden('text')
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
    }
    const handleFormChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    return (
        <div>
            <h1>Welcome to Kiwi Camp</h1>
            <form>
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleFormChange} placeholder="Enter your username" required></input>    
                <label>Password:</label>
                <input type={pwdHidden} value={formData.password} onChange={handleFormChange} name="password" placeholder="Enter password"></input>
                <button onClick={togglePwdShow}>Show Password</button>
                <button onClick={handleSubmit}>Login</button>
            </form>   
        </div>
    )
}