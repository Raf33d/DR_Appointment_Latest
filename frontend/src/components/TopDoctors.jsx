import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { ArrowRight } from 'lucide-react'
import DoctorCard from './DoctorCard'

const TopDoctors = () => {
        const navigate = useNavigate()
  const {doctors} = useContext(AppContext)

  return (
    <section className='py-10 sm:py-16'>
        <div className='mb-8 flex items-end justify-between gap-4'>
          <div><p className='section-kicker'>Available now</p><h2 className='page-title mt-2'>Doctors patients trust</h2></div>
          <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className='hidden items-center gap-2 text-sm font-semibold text-primary hover:text-[#0b625b] sm:flex'>View all <ArrowRight className='h-4 w-4' /></button>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {doctors.slice(0,5).map((item,index)=>(
              <DoctorCard key={item._id || index} doctor={item} onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0,0)}} />
            ))}
        </div>
        <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className='mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#cddbd8] bg-white px-5 py-3 text-sm font-semibold text-primary sm:hidden'>View all doctors <ArrowRight className='h-4 w-4' /></button>
    </section>
  )
}

export default TopDoctors
