import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarCheck2, Check, Clock3 } from 'lucide-react'

const Banner = () => {
    const navigate = useNavigate()
  return (
    <section className='my-14 grid gap-8 border-y border-[#dfe9e7] bg-[#f1f6f3] px-5 py-9 sm:px-8 md:grid-cols-[1fr_auto] md:items-center md:px-10 md:py-12'>
        <div className='max-w-2xl'>
          <p className='section-kicker'>Your care, organized</p>
          <h2 className='mt-3 text-3xl font-semibold leading-tight text-ink'>Keep your next visit close.</h2>
          <p className='mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base'>Your appointments, profile details, and demo payments stay together in one place.</p>
          <button onClick={()=>{navigate('/login'); scrollTo(0,0)}} className='mt-6 flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-[#244752]'>Open your account <ArrowRight className='h-4 w-4' /></button>
        </div>
        <div className='flex items-center gap-5 border-t border-[#d6e3de] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0'>
          <span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-white text-primary'><CalendarCheck2 className='h-7 w-7' /></span>
          <div className='space-y-2 text-sm text-ink'>
            <p className='flex items-center gap-2'><Check className='h-4 w-4 text-primary' />Appointment status</p>
            <p className='flex items-center gap-2'><Clock3 className='h-4 w-4 text-accent' />Upcoming visit times</p>
          </div>
        </div>
    </section>
  )
}

export default Banner
