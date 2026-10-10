import React from 'react'
import {assets} from '../assets/assets'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

  return (
    <section className='relative mt-6 min-h-[520px] overflow-hidden rounded-lg bg-ink sm:mt-8'>
      <img className='absolute bottom-0 right-0 h-[86%] w-auto max-w-none object-contain opacity-45 md:h-[96%] md:opacity-100' src={assets.header_img} alt='Medical team' />
      <div className='absolute inset-0 bg-ink/55 md:w-[64%] md:bg-ink/90' />
      <div className='relative z-10 flex min-h-[520px] max-w-2xl flex-col justify-center px-6 py-14 sm:px-10 lg:px-14'>
        <p className='section-kicker mb-4'>Healthcare, made simpler</p>
        <h1 className='text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl'>The right doctor, right when you need one.</h1>
        <p className='mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg'>Browse trusted specialists, choose a convenient time, and manage every appointment from one calm place.</p>
        <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
          <button onClick={() => navigate('/doctors')} className='flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#0b625b]'>Find a doctor <ArrowRight className='h-4 w-4' /></button>
          <button onClick={() => navigate('/my-appointments')} className='rounded-lg border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/15'>View appointments</button>
        </div>
        <div className='mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70'>
          <span className='flex items-center gap-2'><ShieldCheck className='h-4 w-4 text-[#76c7bd]' /> Verified specialists</span>
          <span className='flex items-center gap-2'><CheckCircle2 className='h-4 w-4 text-[#f0a18e]' /> Simple booking</span>
        </div>
      </div>
    </section>
  )
}

export default Header
