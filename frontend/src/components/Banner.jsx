import React from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Banner = () => {
    const navigate = useNavigate()
  return (
    <section className='relative my-20 overflow-hidden rounded-lg bg-[#dfeeea] px-6 sm:px-10 lg:px-14'>
        <div className='relative z-10 max-w-2xl py-12 sm:py-16 lg:py-20'>
          <p className='section-kicker'>Your care, organized</p>
          <h2 className='mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl'>Ready to make healthcare feel easier?</h2>
          <p className='mt-4 max-w-lg text-gray-600'>Create your patient account and keep appointments, profile details, and demo payments together.</p>
          <button onClick={()=>{navigate('/login'); scrollTo(0,0)}} className='mt-7 flex items-center gap-2 rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-[#244752]'>Create account <ArrowRight className='h-4 w-4' /></button>
        </div>
        <img className='absolute bottom-0 right-0 hidden h-[95%] w-auto md:block' src={assets.appointment_img} alt='Doctor' />
    </section>
  )
}

export default Banner
