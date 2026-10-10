import React from 'react'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { assets } from '../assets/assets'

const Contact = () => (
  <div className='pb-12 pt-10 sm:pt-14'>
    <p className='section-kicker'>Contact</p>
    <h1 className='page-title mt-3'>We are here to help.</h1>
    <p className='mt-3 max-w-2xl text-gray-500'>Questions about an appointment or your account? Reach the clinic team using the details below.</p>

    <div className='mt-10 grid overflow-hidden rounded-lg border border-[#dfe9e7] bg-white lg:grid-cols-2'>
      <img className='h-full min-h-[360px] w-full object-cover' src={assets.contact_image} alt='MedBook clinic office' />
      <div className='flex flex-col justify-center p-7 sm:p-10 lg:p-12'>
        <h2 className='text-xl font-semibold text-ink'>MedBook Clinic</h2>
        <div className='mt-7 space-y-5 text-sm text-gray-600'>
          <div className='flex gap-3'><MapPin className='mt-0.5 h-5 w-5 shrink-0 text-primary' /><p>Plot 81, Block E, Bashundhara R/A<br />Dhaka 1229, Bangladesh</p></div>
          <div className='flex gap-3'><Phone className='h-5 w-5 shrink-0 text-primary' /><p>12345678911</p></div>
          <div className='flex gap-3'><Mail className='h-5 w-5 shrink-0 text-primary' /><p>hello@medbook.local</p></div>
          <div className='flex gap-3'><Clock3 className='h-5 w-5 shrink-0 text-primary' /><p>Saturday to Thursday, 9:00 AM to 9:00 PM</p></div>
        </div>
        <a href='mailto:hello@medbook.local' className='mt-8 inline-flex w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-primary'>Email the clinic</a>
      </div>
    </div>
  </div>
)

export default Contact
