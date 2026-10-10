import React, { useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { Stethoscope, X } from 'lucide-react'

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='admin-page'>
      <p className='text-xs font-semibold uppercase text-primary'>Schedule</p><h1 className='mb-6 mt-1 text-2xl font-semibold text-ink'>All appointments</h1>
      <div className='admin-panel min-h-[60vh] overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[760px] table-fixed text-left text-sm'>
            <thead className='border-b border-[#dfe9e7] bg-[#f8fbfa] text-xs font-semibold uppercase text-gray-500'>
              <tr>
                <th className='w-12 px-4 py-3'>#</th>
                <th className='w-[19%] px-3 py-3'>Patient</th>
                <th className='w-[8%] px-3 py-3'>Age</th>
                <th className='w-[22%] px-3 py-3'>Date &amp; time</th>
                <th className='w-[21%] px-3 py-3'>Doctor</th>
                <th className='w-[10%] px-3 py-3'>Fees</th>
                <th className='w-[120px] px-3 py-3'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#edf2f1] text-gray-600'>
              {appointments.length ? appointments.map((item, index) => (
                <tr className='transition-colors hover:bg-[#f8fbfa]' key={item._id}>
                  <td className='px-4 py-4 text-gray-400'>{index + 1}</td>
                  <td className='px-3 py-4'>
                    <div className='flex min-w-0 items-center gap-2.5'>
                      <img className='h-8 w-8 shrink-0 rounded-full bg-[#eef2ff] object-cover' src={item.userData.image} alt='' />
                      <span className='truncate font-medium text-ink'>{item.userData.name}</span>
                    </div>
                  </td>
                  <td className='px-3 py-4'>{calculateAge(item.userData.dob)}</td>
                  <td className='px-3 py-4'>
                    <span className='block'>{slotDateFormat(item.slotDate)}</span>
                    <span className='mt-0.5 block text-xs text-gray-400'>{item.slotTime}</span>
                  </td>
                  <td className='px-3 py-4'>
                    <div className='flex min-w-0 items-center gap-2'>
                      <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e7f3f1] text-primary'><Stethoscope className='h-4 w-4' /></span>
                      <span className='truncate font-medium text-ink'>{item.docData?.name || 'Doctor'}</span>
                    </div>
                  </td>
                  <td className='px-3 py-4 whitespace-nowrap'>{currency}{item.amount}</td>
                  <td className='px-3 py-4'>
                    {item.cancelled
                      ? <span className='inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600'>Cancelled</span>
                      : item.isCompleted
                        ? <span className='inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700'>Completed</span>
                        : <button onClick={() => cancelAppointment(item._id)} className='inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dfe9e7] px-2.5 text-xs font-medium text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600' aria-label={`Cancel appointment for ${item.userData.name}`} title='Cancel appointment'><X className='h-3.5 w-3.5' />Cancel</button>
                    }
                  </td>
                </tr>
              )) : (
                <tr><td colSpan='7' className='px-5 py-12 text-center text-sm text-gray-500'>No appointments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AllAppointments
