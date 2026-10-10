import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import DoctorCard from './DoctorCard'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()
  const [relDoc, setRelDocs] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
      setRelDocs(doctorsData)
    }
  }, [doctors, speciality, docId])


  return (
    <section className='py-16'>
      <p className='section-kicker'>More options</p>
      <h2 className='page-title mt-2'>Related doctors</h2>
      <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {relDoc.slice(0, 5).map((item, index) => (
          <DoctorCard key={item._id || index} doctor={item} onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} />
        ))}
      </div>
    </section>
  )
}

export default RelatedDoctors
