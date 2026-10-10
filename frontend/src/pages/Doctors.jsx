import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { SlidersHorizontal } from 'lucide-react'
import DoctorCard from '../components/DoctorCard'


const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  const navigate = useNavigate()
  const { doctors, getDoctorsData } = useContext(AppContext)
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }
  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])
  useEffect(() => {
    getDoctorsData()
  }, [])
  const specialities = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']
  return (
    <div className='py-10 sm:py-14'>
      <p className='section-kicker'>Our clinical team</p>
      <div className='mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div><h1 className='page-title'>Find your doctor</h1><p className='mt-3 text-gray-500'>{filterDoc.length} specialist{filterDoc.length === 1 ? '' : 's'} available to browse</p></div>
        <button className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium sm:hidden ${showFilter ? 'border-primary bg-primary text-white' : 'border-[#cddbd8] bg-white text-ink'}`} onClick={() => setShowFilter(prev => !prev)}><SlidersHorizontal className='h-4 w-4' /> Filters</button>
      </div>
      <div className='mt-8 flex flex-col items-start gap-6 sm:flex-row'>
        <aside className={`${showFilter ? 'flex' : 'hidden'} surface w-full flex-col p-2 sm:sticky sm:top-24 sm:flex sm:w-60 sm:flex-none`}>
          <button onClick={() => navigate('/doctors')} className={`rounded px-4 py-3 text-left text-sm ${!speciality ? 'bg-primary text-white' : 'text-gray-600 hover:bg-mist'}`}>All specialities</button>
          {specialities.map((item) => <button key={item} onClick={() => navigate(speciality === item ? '/doctors' : `/doctors/${item}`)} className={`rounded px-4 py-3 text-left text-sm ${speciality === item ? 'bg-primary text-white' : 'text-gray-600 hover:bg-mist'}`}>{item}</button>)}
        </aside>
        <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filterDoc.map((item, index) => <DoctorCard key={item._id || index} doctor={item} onClick={() => navigate(`/appointment/${item._id}`)} />)}
          {filterDoc.length === 0 && <div className='surface col-span-full px-6 py-14 text-center text-gray-500'>No doctors found in this speciality yet.</div>}
        </div>
      </div>
    </div>
  )
}

export default Doctors
