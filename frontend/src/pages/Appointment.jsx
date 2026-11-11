import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'
import { BadgeCheck, CalendarDays, Clock3, MapPin } from 'lucide-react'
import SpecialtyMark from '../components/SpecialtyMark'

const Appointment = () => {

  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)

  }

  // Clinic hours: 30-minute slots from 10:00 until 21:00.
  const OPEN_HOUR = 10
  const CLOSE_HOUR = 21
  const DAYS_SHOWN = 7

  const toSlotDate = (date) => date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()

  // Builds the next 7 bookable days. A day whose opening hours have already
  // passed (e.g. today, late in the evening) is skipped so the list always
  // has 7 days. Fully booked days are kept, with an empty slot list.
  const getAvailableSlots = () => {
    if (!docInfo) return

    const now = new Date()
    const days = []
    const day = new Date(now)
    day.setHours(0, 0, 0, 0)

    while (days.length < DAYS_SHOWN) {
      const closing = new Date(day)
      closing.setHours(CLOSE_HOUR, 0, 0, 0)

      if (closing > now) {
        // First slot: opening time, or the next half hour that is at least 30 minutes away.
        const slot = new Date(day)
        slot.setHours(OPEN_HOUR, 0, 0, 0)
        while (slot < closing && slot.getTime() - now.getTime() < 30 * 60 * 1000) {
          slot.setMinutes(slot.getMinutes() + 30)
        }

        const slotDate = toSlotDate(day)
        const booked = docInfo.slots_booked?.[slotDate] || []
        const slots = []
        while (slot < closing) {
          const time = slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          if (!booked.includes(time)) slots.push({ datetime: new Date(slot), time })
          slot.setMinutes(slot.getMinutes() + 30)
        }

        days.push({ date: new Date(day), slots })
      }

      day.setDate(day.getDate() + 1)
    }

    setDocSlots(days)
    setSlotIndex((current) => (days[current]?.slots.length ? current : Math.max(0, days.findIndex((d) => d.slots.length))))
  }


  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment")
      return navigate('/login')
    }

    if (!slotTime || !docSlots[slotIndex]?.slots.length) {
      return toast.warn('Please choose an available time')
    }

    try {

      const slotDate = toSlotDate(docSlots[slotIndex].date)

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } });

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }


  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])
  return docInfo && (
    <div className='py-8 sm:py-12'>
      <div className='grid overflow-hidden rounded-lg border border-[#dfe9e7] bg-white lg:grid-cols-[340px_1fr]'>
        <div className='bg-mist'>
          <SpecialtyMark name={docInfo.name} speciality={docInfo.speciality} className='h-full min-h-[300px] aspect-auto' />
        </div>
        <div className='flex flex-col justify-center p-6 sm:p-9'>
          <div className='flex items-center gap-2'><h1 className='text-3xl font-semibold text-ink'>{docInfo.name}</h1><BadgeCheck className='h-5 w-5 text-primary' /></div>
          <p className='mt-2 text-sm text-gray-500'>{docInfo.degree} · {docInfo.speciality} · {docInfo.experience}</p>
          <p className='mt-6 max-w-3xl text-sm leading-7 text-gray-600'>{docInfo.about}</p>
          <div className='mt-7 flex flex-wrap gap-5 border-t border-[#e5ecea] pt-5 text-sm'>
            <span className='flex items-center gap-2 text-gray-600'><MapPin className='h-4 w-4 text-primary' /> {docInfo.address?.line1 || 'Clinic location'}</span>
            <span className='font-semibold text-ink'>Fee: {currencySymbol}{docInfo.fees}</span>
          </div>
        </div>
      </div>

      <section className='mt-8 rounded-lg border border-[#dfe9e7] bg-white p-5 sm:p-7'>
        <div className='flex items-center gap-3'><span className='flex h-10 w-10 items-center justify-center rounded-lg bg-mist text-primary'><CalendarDays className='h-5 w-5' /></span><div><h2 className='font-semibold text-ink'>Choose a time</h2><p className='text-xs text-gray-500'>Available 30-minute appointment slots</p></div></div>
        <div className='mt-6 flex w-full gap-2 overflow-x-auto pb-2'>
          {docSlots.map((item, index) => {
            const full = item.slots.length === 0
            const selected = slotIndex === index
            return (
              <button
                key={index}
                disabled={full}
                onClick={() => { setSlotIndex(index); setSlotTime('') }}
                title={full ? 'No free times on this day' : undefined}
                className={`min-w-[76px] rounded-lg border px-3 py-3 text-center text-sm ${full ? 'cursor-not-allowed border-[#eef2f1] bg-[#f6f8f8] text-gray-300' : selected ? 'border-primary bg-primary text-white' : 'border-[#dfe9e7] bg-white text-gray-600 hover:border-primary'}`}
              >
                <span className='block text-xs'>{daysOfWeek[item.date.getDay()]}</span>
                <span className='mt-1 block text-lg font-semibold'>{item.date.getDate()}</span>
                {full && <span className='mt-0.5 block text-[10px] font-medium uppercase tracking-wide'>Full</span>}
              </button>
            )
          })}
        </div>
        <div className='mt-4 flex w-full items-center gap-2 overflow-x-auto pb-2'>
          {docSlots[slotIndex]?.slots.map((item, index) => (
            <button onClick={() => setSlotTime(item.time)} className={`flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${item.time === slotTime ? 'border-ink bg-ink text-white' : 'border-[#dfe9e7] text-gray-600 hover:border-primary'}`} key={index}>
              <Clock3 className='h-3.5 w-3.5' />
              {item.time.toLowerCase()}
            </button>
          ))}
        </div>
        <button onClick={bookAppointment} className='mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-[#0b625b]'>Book appointment</button>
      </section>
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
