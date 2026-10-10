import React, { useContext, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronRight, Clock3, Search, Stethoscope } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { specialityData } from '../assets/assets'

const Header = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [speciality, setSpeciality] = useState('')
  const availableDoctors = doctors.filter((doctor) => doctor.available)

  const browseDoctors = () => {
    navigate(speciality ? `/doctors/${encodeURIComponent(speciality)}` : '/doctors')
    scrollTo(0, 0)
  }

  return (
    <section className='grid gap-8 border-b border-[#dfe9e7] py-8 md:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12'>
      <div className='py-3 sm:py-6'>
        <p className='section-kicker mb-4'>A better way to book care</p>
        <h1 className='max-w-2xl text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl'>Book a doctor, on your schedule.</h1>
        <p className='mt-5 max-w-xl text-base leading-7 text-gray-600'>Find the right specialist, choose a time that works, and keep every visit together.</p>

        <div className='mt-8 flex flex-col gap-2 rounded-lg border border-[#dfe9e7] bg-white p-2 shadow-[0_12px_36px_rgba(23,49,59,0.06)] sm:flex-row'>
          <label className='flex min-w-0 flex-1 items-center gap-3 px-3'>
            <Search className='h-5 w-5 shrink-0 text-primary' aria-hidden='true' />
            <span className='sr-only'>Filter by speciality</span>
            <select value={speciality} onChange={(event) => setSpeciality(event.target.value)} className='h-12 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none'>
              <option value=''>All specialities</option>
              {specialityData.map((item) => <option key={item.speciality} value={item.speciality}>{item.speciality}</option>)}
            </select>
          </label>
          <button onClick={browseDoctors} className='flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-[#0b625b]'>Find a doctor <ArrowRight className='h-4 w-4' /></button>
        </div>

        <div className='mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500'>
          <span className='inline-flex items-center gap-2'><CalendarDays className='h-4 w-4 text-primary' />Flexible appointments</span>
          <span className='inline-flex items-center gap-2'><Clock3 className='h-4 w-4 text-accent' />Clear available times</span>
        </div>
      </div>

      <aside className='relative overflow-hidden rounded-lg border border-[#dfe9e7] bg-[#f0f6f3] p-5 sm:p-7' aria-label='Available doctors'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase text-gray-500'>Care directory</p>
            <h2 className='mt-1 text-xl font-semibold text-ink'>Ready when you are</h2>
          </div>
          <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-primary'><Stethoscope className='h-5 w-5' /></span>
        </div>
        <div className='mt-5 flex items-center gap-2 border-b border-[#d6e3de] pb-4 text-sm'>
          <span className='h-2.5 w-2.5 rounded-full bg-[#4c9475]' />
          <span className='font-semibold text-ink'>{availableDoctors.length}</span>
          <span className='text-gray-600'>of {doctors.length} doctors available</span>
        </div>

        {availableDoctors.length ? (
          <div className='divide-y divide-[#d6e3de]'>
            {availableDoctors.slice(0, 3).map((doctor) => {
              const initials = doctor.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
              return (
                <button key={doctor._id} onClick={() => navigate(`/appointment/${doctor._id}`)} className='flex w-full items-center gap-3 py-3 text-left hover:bg-white/50'>
                  <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-sm font-semibold text-primary'>{initials}</span>
                  <span className='min-w-0 flex-1'><span className='block truncate text-sm font-semibold text-ink'>{doctor.name}</span><span className='mt-0.5 block truncate text-xs text-gray-500'>{doctor.speciality}</span></span>
                  <ChevronRight className='h-4 w-4 shrink-0 text-gray-400' />
                </button>
              )
            })}
          </div>
        ) : (
          <p className='py-7 text-sm text-gray-600'>No doctors are listed yet.</p>
        )}
        <button onClick={browseDoctors} className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-[#0b625b]'>Browse all doctors <ArrowRight className='h-4 w-4' /></button>
      </aside>
    </section>
  )
}

export default Header
