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

  const getAvailableSlots = async () => {
    if (!docInfo) return

    setDocSlots([]);
    // ...existing code...

    // ...existing code...


    //getting current date
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      //setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1 // Months are zero-based in JavaScript
        let year = currentDate.getFullYear()

        const slotDate = day + '-' + month + '-' + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          // addslot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })

        }



        // increment current time by 30 minute
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setDocSlots(prev => ([...prev, timeSlots]))

    }
  }


  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment")
      return navigate('/login')
    }

    if (!slotTime || !docSlots[slotIndex]?.[0]) {
      return toast.warn('Please choose an available time')
    }

    try {

      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1 // Months are zero-based in JavaScript
      let year = date.getFullYear()

      const slotDate = day + '-' + month + '-' + year

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
          {
            docSlots.length && docSlots.map((item, index) => (
              <button onClick={() => { setSlotIndex(index); setSlotTime('') }} className={`min-w-[76px] rounded-lg border px-3 py-3 text-center text-sm ${slotIndex === index ? 'border-primary bg-primary text-white' : 'border-[#dfe9e7] bg-white text-gray-600 hover:border-primary'}`} key={index}>
                <span className='block text-xs'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</span>
                <span className='mt-1 block text-lg font-semibold'>{item[0] && item[0].datetime.getDate()}</span>
              </button>
            ))
          }
        </div>
        <div className='mt-4 flex w-full items-center gap-2 overflow-x-auto pb-2'>
          {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
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
