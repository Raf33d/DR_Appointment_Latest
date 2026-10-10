import React, { useContext, useState } from 'react'
import { CalendarDays, ChevronDown, LogOut, Menu, Stethoscope, UserRound, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();

  const { token, setToken,userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {

    setToken(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Doctors', to: '/doctors' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' }
  ]

  return (
    <header className='sticky top-0 z-40 border-b border-[#dfe9e7] bg-white/95 backdrop-blur'>
      <div className='mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8'>
        <button onClick={() => navigate('/')} className='flex items-center gap-2.5' aria-label='MedBook home'>
          <span className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white'><Stethoscope className='h-5 w-5' /></span>
          <span className='text-xl font-semibold text-ink'>Med<span className='text-primary'>Book</span></span>
        </button>

        <nav className='hidden items-center gap-8 md:flex'>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `relative px-1 py-3 text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-600 hover:text-ink'}`}>
              {({ isActive }) => <>{item.label}{isActive && <span className='absolute inset-x-0 bottom-1 h-0.5 rounded bg-accent' />}</>}
            </NavLink>
          ))}
        </nav>

        <div className='flex items-center gap-3'>
          {token && userData ? (
            <div className='group relative'>
              <button className='flex h-11 items-center gap-2 rounded-lg border border-[#dfe9e7] bg-white px-2.5 hover:border-[#9dcac4]'>
                <img className='h-8 w-8 rounded-full object-cover' src={userData.image} alt={userData.name} />
                <span className='hidden max-w-28 truncate text-sm font-medium text-ink sm:block'>{userData.name}</span>
                <ChevronDown className='h-4 w-4 text-gray-400' />
              </button>
              <div className='invisible absolute right-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100'>
                <div className='w-56 rounded-lg border border-[#dfe9e7] bg-white p-2 shadow-xl'>
                  <button onClick={() => navigate('/my-profile')} className='flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-mist hover:text-ink'><UserRound className='h-4 w-4' /> My profile</button>
                  <button onClick={() => navigate('/my-appointments')} className='flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-mist hover:text-ink'><CalendarDays className='h-4 w-4' /> My appointments</button>
                  <button onClick={logout} className='flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50'><LogOut className='h-4 w-4' /> Log out</button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className='hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#0b625b] md:block'>Create account</button>
          )}
          <button onClick={() => setShowMenu(true)} className='flex h-10 w-10 items-center justify-center rounded border border-[#dfe9e7] text-ink md:hidden' aria-label='Open menu'><Menu className='h-5 w-5' /></button>
        </div>
      </div>

      <div className={`${showMenu ? 'translate-x-0' : 'translate-x-full'} fixed inset-0 z-50 bg-white transition-transform md:hidden`}>
        <div className='flex h-[72px] items-center justify-between border-b border-[#dfe9e7] px-5'>
          <div className='flex items-center gap-2.5'><span className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white'><Stethoscope className='h-5 w-5' /></span><span className='text-xl font-semibold text-ink'>Med<span className='text-primary'>Book</span></span></div>
          <button onClick={() => setShowMenu(false)} className='flex h-10 w-10 items-center justify-center rounded border border-[#dfe9e7]' aria-label='Close menu'><X className='h-5 w-5' /></button>
        </div>
        <nav className='flex flex-col gap-2 p-5'>
          {navItems.map((item) => <NavLink key={item.to} onClick={() => setShowMenu(false)} to={item.to} className='mobile-nav-label rounded px-4 py-3 text-base font-medium text-gray-700'>{item.label}</NavLink>)}
          {!token && <button onClick={() => { setShowMenu(false); navigate('/login') }} className='mt-3 rounded-lg bg-primary px-5 py-3 text-white'>Create account</button>}
        </nav>
      </div>
    </header>
  )
};

export default Navbar;
