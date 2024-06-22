import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from "../Components/Navbar/Navbar"
import Login from '../Pages/Login/Login'
import Register from '../Pages/Register/Register'
import Home from '../Pages/Home/Home'
import Result from '../Pages/Result/Result'
import Payment from '../Pages/Payment/Payment'
import FlightDetail from "../Pages/FlightDetail/FlightDetail";
import Footer from "../Components/Footer/Footer"
import Ticket from '../Pages/Ticket/Ticket'
import AddFlight from '../Pages/AddFlight/AddFlight'
import Profile from '../Pages/Profile/Profile'
import Flights from '../Pages/Flights/Flights'

const AppRouter = () => {
  return (
    <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route  path="/" element={<Home/>}/>
            <Route  path="/login" element={<Login/>}/>
            <Route  path="/register" element={<Register/>}/>
            <Route  path="/result" element={<Result/>}/>
            <Route  path="/payment" element={<Payment/>}/>
            <Route  path="/flight-detail/:from/:to/:company" element={<FlightDetail/>}/>
            <Route  path="/ticket" element={<Ticket/>}/>
            <Route  path="/add-flight" element={<AddFlight/>}/>
            <Route  path="/ticket" element={<Ticket/>}/>
            <Route  path="/profile" element={<Profile/>}/>
            <Route  path="/flights" element={<Flights/>}/>
        </Routes>
        <Footer/>
    </BrowserRouter>
  )
}

export default AppRouter