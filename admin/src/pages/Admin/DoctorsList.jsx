import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import SpecialtyMark from '../../components/SpecialtyMark'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='admin-page'>
      <p className='text-xs font-semibold uppercase text-primary'>Team</p><h1 className='mt-1 text-2xl font-semibold text-ink'>All doctors</h1>

      <div className='grid w-full gap-4 pt-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {
          doctors.map((item, index) =>
            <div
              className='admin-panel group flex min-h-[320px] flex-col overflow-hidden'
              key={index}
            >
              <SpecialtyMark name={item.name} speciality={item.speciality} />
              <div className='px-3 py-2 w-full flex-1 flex flex-col justify-between'>
                <p className='font-semibold text-ink'>{item.name}</p>
                <p className='text-sm text-gray-500'>{item.speciality}</p>
                <div className='flex items-center gap-2 mt-2'>
                  <input onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                    className="accent-green-600"
                  />
                  <p className='text-xs'>Available</p>
                </div>
              </div>
            </div>
          )
        }
      </div>

    </div>
  )
}

export default DoctorsList
