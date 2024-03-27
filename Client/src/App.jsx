import { useState } from 'react'
import './App.css'
import Navbar from './components/sidenav'
import Home from './pages/home'
import About from './pages/about'
import Contact from './pages/contact'
import Login from './pages/login'
import Register from './pages/register'
import { Route, Routes } from "react-router-dom"



function App() {
//  let p 
//  switch (window.location.pathname) {
//   case '/':
//     p = <Home />
//     break
//   case '/about':
//     p = <About />
//     break
//   case '/contact':
//     p = <Contact />
//     break
//   case '/login':
//     p = <Login />
//     break
//   case '/register':
//     p = <Register />
//     break
//    }

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
        </Routes>
      </div>
    </>
    
  )
}

export default App
