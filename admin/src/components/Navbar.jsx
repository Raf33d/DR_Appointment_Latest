import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext.jsx'    
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext.jsx'
import { LogOut, Stethoscope } from 'lucide-react'
const Navbar = () => {

    const {aToken,setAToken} = useContext(AdminContext)
    const {dToken,setDToken} = useContext(DoctorContext)

    const navigate = useNavigate()

    const logout = () => {
      aToken && setAToken('') // Clear the token
      aToken && localStorage.removeItem('aToken') // Remove token from local storage
      dToken && setDToken('') // Clear the token
      dToken && localStorage.removeItem('dToken') // Remove token from local storage
      navigate('/') // Redirect to login page
    }

  return (
    <header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#dfe9e7] bg-white px-4 sm:px-6'>
        <div className='flex items-center gap-3'>
            <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white'><Stethoscope className='h-5 w-5' /></span>
            <div><p className='font-semibold text-ink'>Med<span className='text-primary'>Book</span></p><p className='text-[11px] text-gray-400'>{aToken ? 'Administration' : 'Doctor workspace'}</p></div>
        </div>
        <button onClick={logout} className='flex items-center gap-2 rounded-lg border border-[#cddbd8] px-3 py-2 text-sm font-medium text-ink hover:border-primary hover:text-primary'><LogOut className='h-4 w-4' /><span className='hidden sm:inline'>Log out</span></button>
    </header>
  )
}

export default Navbar
