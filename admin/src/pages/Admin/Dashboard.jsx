import React from 'react'
import { assets } from '../../assets/assets'
import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { CalendarDays, Clock3, Stethoscope, X } from 'lucide-react'


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

        <div className='divide-y divide-[#edf2f1]'>
          {dashData.latestAppointments?.length ? dashData.latestAppointments.map((item) => (
            <div className='flex min-w-0 items-center gap-3 px-4 py-4 transition-colors hover:bg-[#f8fbfa] sm:px-5' key={item._id}>
              <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e7f3f1] text-primary'>
                <Stethoscope className='h-5 w-5' aria-hidden='true' />
              </span>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold text-ink'>{item.docData?.name || 'Doctor'}</p>
                <div className='mt-1 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500'>
                  <span className='inline-flex items-center gap-1.5'><CalendarDays className='h-3.5 w-3.5 shrink-0' />{slotDateFormat(item.slotDate)}</span>
                  <span className='inline-flex items-center gap-1.5'><Clock3 className='h-3.5 w-3.5 shrink-0' />{item.slotTime}</span>
                </div>
              </div>
              {item.cancelled
                ? <span className='shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600'>Cancelled</span>
                : <button onClick={() => cancelAppointment(item._id)} className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600' aria-label={`Cancel appointment with ${item.docData?.name || 'doctor'}`} title='Cancel appointment'><X className='h-4 w-4' /></button>
              }
            </div>
          )) : (
            <p className='px-5 py-10 text-center text-sm text-gray-500'>No appointments yet.</p>
          )}
        </div>


      </div>

    </div>
  )
}

export default Dashboard
