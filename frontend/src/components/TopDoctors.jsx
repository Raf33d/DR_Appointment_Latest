import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { ArrowRight } from 'lucide-react'
import DoctorCard from './DoctorCard'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const availableDoctors = doctors.filter((doctor) => doctor.available).slice(0, 4)

  return (
    <section className='border-t border-[#dfe9e7] py-12 sm:py-16'>
        <div className='mb-7 flex items-end justify-between gap-4'>
          <div><p className='section-kicker'>The care team</p><h2 className='page-title mt-2'>Available doctors</h2></div>
          <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='hidden items-center gap-2 text-sm font-semibold text-primary hover:text-[#0b625b] sm:flex'>View all <ArrowRight className='h-4 w-4' /></button>
        </div>
        {availableDoctors.length ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {availableDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} onClick={() => { navigate(`/appointment/${doctor._id}`); scrollTo(0, 0) }} />
            ))}
          </div>
        ) : (
          <div className='border-y border-[#dfe9e7] py-10 text-sm text-gray-500'>No doctors are available right now. Check the full directory for updates.</div>
        )}
        <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-[#cddbd8] bg-white px-5 py-3 text-sm font-semibold text-primary hover:bg-mist sm:hidden'>View all doctors <ArrowRight className='h-4 w-4' /></button>
    </section>
  )
}

export default TopDoctors
