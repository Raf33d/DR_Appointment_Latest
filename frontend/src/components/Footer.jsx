import React from 'react'
import { Mail, MapPin, Phone, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='mt-20 border-t border-[#dfe9e7] bg-white'>
        <div className='mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8'>
          <div>
            <div className='flex items-center gap-2.5'><span className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white'><Stethoscope className='h-5 w-5' /></span><span className='text-xl font-semibold text-ink'>Med<span className='text-primary'>Book</span></span></div>
            <p className='mt-4 max-w-sm text-sm leading-6 text-gray-500'>Simple local appointment management for patients, doctors, and clinic teams.</p>
          </div>
          <div>
            <p className='text-sm font-semibold text-ink'>Explore</p>
            <div className='mt-4 flex flex-col gap-2 text-sm text-gray-500'><Link to='/doctors'>Find doctors</Link><Link to='/about'>About us</Link><Link to='/contact'>Contact</Link></div>
          </div>
          <div>
            <p className='text-sm font-semibold text-ink'>Clinic</p>
            <div className='mt-4 flex flex-col gap-3 text-sm text-gray-500'><span className='flex gap-2'><MapPin className='h-4 w-4 text-primary' /> Dhaka, Bangladesh</span><span className='flex gap-2'><Phone className='h-4 w-4 text-primary' /> 12345678911</span><span className='flex gap-2'><Mail className='h-4 w-4 text-primary' /> hello@medbook.local</span></div>
          </div>
        </div>
        <div className='border-t border-[#edf2f1] px-4 py-5 text-center text-xs text-gray-400'>Copyright 2026 MedBook. Local demo system.</div>
    </footer>
  )
}

export default Footer
