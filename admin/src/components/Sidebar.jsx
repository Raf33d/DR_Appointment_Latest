import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { CalendarDays, LayoutDashboard, UserPlus, UserRound, UsersRound } from 'lucide-react'


const Sidebar = () => {

    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)

    const adminLinks = [
        { to: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/all-appointments', label: 'Appointments', icon: CalendarDays },
        { to: '/add-doctor', label: 'Add doctor', icon: UserPlus },
        { to: '/all-doctors', label: 'Doctors', icon: UsersRound },
    ]
    const doctorLinks = [
        { to: '/doctor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/doctor-appointments', label: 'Appointments', icon: CalendarDays },
        { to: '/doctor-profile', label: 'Profile', icon: UserRound },
    ]
    const links = aToken ? adminLinks : dToken ? doctorLinks : []

    return (
        <aside className='w-[68px] shrink-0 border-r border-[#dfe9e7] bg-white md:w-60'>
            <nav className='sticky top-20 space-y-1 p-2 md:p-4'>
                <p className='mb-3 hidden px-3 text-[11px] font-semibold uppercase text-gray-400 md:block'>{aToken ? 'Clinic management' : 'Doctor tools'}</p>
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink key={to} className={({ isActive }) => `flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${isActive ? 'bg-[#e4f1ef] text-primary' : 'text-gray-500 hover:bg-mist hover:text-ink'}`} to={to} title={label}>
                        <Icon className='h-5 w-5 shrink-0' />
                        <span className='hidden md:block'>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
