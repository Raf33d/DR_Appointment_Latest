import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
const SpecialityMenu = () => {
  return (
    <section className='py-20' id='speciality'>
      <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div><p className='section-kicker'>Browse care</p><h2 className='page-title mt-2'>Find the right specialist</h2></div>
        <p className='max-w-md text-sm leading-6 text-gray-500'>Choose a speciality to see available doctors and appointment times.</p>
      </div>
      <div className='flex gap-3 overflow-x-auto pb-3'>
        {specialityData.map((item,index)=>(
            <Link onClick={()=>scrollTo(0,0)} className='group flex min-w-36 flex-1 flex-col items-center rounded-lg border border-[#dfe9e7] bg-white px-4 py-5 text-center shadow-sm hover:border-[#9dcac4]' key={index} to={`/doctors/${item.speciality}`}>
                <span className='flex h-16 w-16 items-center justify-center rounded-full bg-mist'><img className='h-12 w-12' src={item.image} alt="" /></span>
                <p className='mt-3 text-sm font-medium text-ink'>{item.speciality}</p>
            </Link>
        ))}
      </div>
    </section>
  )
}

export default SpecialityMenu
