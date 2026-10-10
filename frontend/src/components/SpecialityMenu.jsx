import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const SpecialityMenu = () => {
  return (
    <section className='py-12 sm:py-16' id='speciality'>
      <div className='mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div><p className='section-kicker'>Explore by speciality</p><h2 className='page-title mt-2'>Start with what you need</h2></div>
        <Link to='/doctors' onClick={() => scrollTo(0, 0)} className='inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-[#0b625b]'>All doctors <ArrowUpRight className='h-4 w-4' /></Link>
      </div>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'>
        {specialityData.map((item) => (
            <Link onClick={() => scrollTo(0, 0)} className='group flex min-h-36 flex-col justify-between border border-[#dfe9e7] bg-white p-4 transition-colors hover:border-[#9dcac4] hover:bg-[#f2f7f5]' key={item.speciality} to={`/doctors/${item.speciality}`}>
                <span className='flex h-12 w-12 items-center justify-center rounded-md bg-[#e8f2ef]'><img className='h-9 w-9' src={item.image} alt='' /></span>
                <span className='mt-5 flex items-end justify-between gap-2 text-sm font-semibold text-ink'><span>{item.speciality}</span><ArrowUpRight className='h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-primary' /></span>
            </Link>
        ))}
      </div>
    </section>
  )
}

export default SpecialityMenu
