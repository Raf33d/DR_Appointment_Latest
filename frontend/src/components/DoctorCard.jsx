import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import SpecialtyMark from './SpecialtyMark'

const DoctorCard = ({ doctor, onClick }) => {
  return (
    <button onClick={onClick} className='doctor-card group w-full text-left'>
      <SpecialtyMark name={doctor.name} speciality={doctor.speciality} className='transition-transform duration-300 group-hover:scale-[1.02]' />
      <div className='p-4'>
        <div className={`mb-2 flex items-center gap-2 text-xs font-medium ${doctor.available ? 'text-primary' : 'text-gray-500'}`}>
          <span className={`h-2 w-2 rounded-full ${doctor.available ? 'bg-primary' : 'bg-gray-400'}`} />
          {doctor.available ? 'Available today' : 'Currently unavailable'}
        </div>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <p className='truncate text-lg font-semibold text-ink'>{doctor.name}</p>
            <p className='mt-0.5 text-sm text-gray-500'>{doctor.speciality}</p>
          </div>
          <ArrowUpRight className='mt-1 h-5 w-5 flex-none text-gray-400 transition-colors group-hover:text-primary' />
        </div>
      </div>
    </button>
  )
}

export default DoctorCard
