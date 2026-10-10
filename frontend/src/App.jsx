import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Failed from './components/Failed'

const App = () => {
  return (
    <div className='min-h-screen bg-[#f7faf9]'>
      <Navbar />
      <main className='mx-auto min-h-[70vh] w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'>
      <ToastContainer position='top-right' />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/payment/failed' element={<Failed/>} />
        
      </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
