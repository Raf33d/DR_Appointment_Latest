import React from 'react'
import { assets } from '../../assets/assets'
import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import SpecialtyMark from '../../components/SpecialtyMark'


const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='admin-page'>
      <div className='mb-6'><p className='text-xs font-semibold uppercase text-primary'>Overview</p><h1 className='mt-1 text-2xl font-semibold text-ink'>Clinic dashboard</h1></div>
      <div className='flex flex-wrap gap-3'>

        <div className='admin-panel flex min-w-52 flex-1 items-center gap-3 p-5'>
          <img className='w-14' src={assets.doctor_icon} alt='' />
          <div>
            <p className='text-2xl font-semibold text-ink'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='admin-panel flex min-w-52 flex-1 items-center gap-3 p-5'>
          <img className='w-14' src={assets.appointments_icon} alt='' />
          <div>
            <p className='text-2xl font-semibold text-ink'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='admin-panel flex min-w-52 flex-1 items-center gap-3 p-5'>
          <img className='w-14' src={assets.patients_icon} alt='' />
          <div>
            <p className='text-2xl font-semibold text-ink'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>

      </div>

      <div className='admin-panel mt-8 overflow-hidden'>

        <div className='flex items-center gap-2.5 border-b border-[#e5ecea] px-5 py-4'>
          <img src={assets.list_icon} alt='' />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='py-2'>
          {
            //dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <SpecialtyMark name={item.docData.name} speciality={item.docData.speciality} className='h-10 w-10 shrink-0 rounded-lg text-base [&>span]:text-sm [&>div:nth-of-type(2)]:hidden [&>div:nth-of-type(3)]:hidden' />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                  <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                </div>
                {
                  item.cancelled
                    ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                    : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                }
              </div>
            ))
            /*(
              <div className='p-4 text-center text-gray-400'>No Appointments</div>
            )*/
          }
        </div>


      </div>

    </div>
  )
}

export default Dashboard
