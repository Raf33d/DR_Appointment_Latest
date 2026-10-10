import React from 'react'
import { HeartHandshake, ScanSearch, TimerReset } from 'lucide-react'
import { assets } from '../assets/assets'

const values = [
  { icon: TimerReset, title: 'Efficient', text: 'Book a suitable doctor and time without calling or waiting in a queue.' },
  { icon: ScanSearch, title: 'Clear', text: 'See specialties, fees, experience, and availability before making a choice.' },
  { icon: HeartHandshake, title: 'Personal', text: 'Keep your profile and appointments together for a smoother care experience.' },
]

const About = () => (
  <div className='pb-10 pt-10 sm:pt-14'>
    <p className='section-kicker'>About MedBook</p>
    <div className='mt-3 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]'>
      <img className='aspect-[4/3] w-full rounded-lg object-cover' src={assets.about_image} alt='Healthcare professional speaking with a patient' />
      <div>
        <h1 className='page-title max-w-xl'>Good care starts with an easier way to reach it.</h1>
        <div className='mt-6 space-y-4 text-sm leading-7 text-gray-600 sm:text-base'>
          <p>MedBook brings appointment scheduling, trusted doctor profiles, and patient records into one focused local system.</p>
          <p>Our goal is practical: help patients make informed choices and give clinic teams a reliable way to manage each visit from booking to completion.</p>
        </div>
        <div className='mt-8 grid grid-cols-3 border-y border-[#dfe9e7] py-5 text-center'>
          <div><p className='text-2xl font-semibold text-ink'>7 days</p><p className='mt-1 text-xs text-gray-500'>Booking view</p></div>
          <div className='border-x border-[#dfe9e7]'><p className='text-2xl font-semibold text-ink'>30 min</p><p className='mt-1 text-xs text-gray-500'>Time slots</p></div>
          <div><p className='text-2xl font-semibold text-ink'>Local</p><p className='mt-1 text-xs text-gray-500'>Demo data</p></div>
        </div>
      </div>
    </div>

    <section className='mt-16 border-t border-[#dfe9e7] pt-10'>
      <p className='section-kicker'>Why patients choose us</p>
      <div className='mt-6 grid gap-px overflow-hidden rounded-lg border border-[#dfe9e7] bg-[#dfe9e7] md:grid-cols-3'>
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className='bg-white p-6 sm:p-8'>
            <Icon className='h-6 w-6 text-primary' />
            <h2 className='mt-5 text-lg font-semibold text-ink'>{title}</h2>
            <p className='mt-2 text-sm leading-6 text-gray-500'>{text}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
)

export default About
