import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CalendarClock, CreditCard, MapPin, X } from 'lucide-react'
import SpecialtyMark from '../components/SpecialtyMark'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData, currencySymbol } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const [paymentAppointment, setPaymentAppointment] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('bkash')
  const [walletNumber, setWalletNumber] = useState('')
  const [walletPin, setWalletPin] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const months = [" ", 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('-')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {

        setAppointments(data.appointments.reverse())
        console.log(data.appointments)

      }


    } catch (error) {

      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  const openPayment = (appointment) => {
    setPaymentAppointment(appointment)
    setPaymentMethod('bkash')
    setWalletNumber('')
    setWalletPin('')
    setCardName('')
    setCardNumber('')
    setCardExpiry('')
    setCardCvc('')
  }

  const confirmPayment = async (event) => {
    event.preventDefault()

    if (paymentMethod === 'card' && (!cardName || cardNumber.replace(/\s/g, '').length < 12 || !cardExpiry || cardCvc.length < 3)) {
      return toast.error('Please complete the demo card details')
    }
    if (paymentMethod !== 'card' && (!/^01\d{9}$/.test(walletNumber) || !/^\d{4,6}$/.test(walletPin))) {
      return toast.error('Enter an 11-digit demo mobile number and a 4-6 digit demo PIN')
    }

    try {
      setIsPaying(true)
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-demo',
        { appointmentId: paymentAppointment._id, paymentMethod },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(`${data.message}. Reference: ${data.reference}`)
        setPaymentAppointment(null)
        await getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsPaying(false)
    }
  }

  const paymentLabel = (method) => ({ bkash: 'bKash', nagad: 'Nagad', card: 'Card' }[method] || method)



  useEffect(() => {
    if (token) {
      getUserAppointments()
      getDoctorsData()
    }

  }, [token])

  return (
    <div className='py-10 sm:py-14'>
      <p className='section-kicker'>Your care</p>
      <h1 className='page-title mt-3'>My appointments</h1>
      <p className='mt-2 text-sm text-gray-500'>Review bookings, complete a demo payment, or cancel an upcoming visit.</p>
      <div className='mt-8 space-y-4'>
        {appointments.length === 0 && <div className='surface py-16 text-center'><CalendarClock className='mx-auto h-9 w-9 text-primary' /><p className='mt-4 font-medium text-ink'>No appointments yet</p><p className='mt-1 text-sm text-gray-500'>Your booked visits will appear here.</p></div>}
        {appointments.map((item, index) => (
          <div className='surface grid gap-5 p-4 sm:grid-cols-[128px_1fr_auto] sm:items-center sm:p-5' key={index}>
            <SpecialtyMark name={item.docData.name} speciality={item.docData.speciality} className='aspect-square w-full max-w-32 rounded-lg [&>span]:text-3xl [&>div:first-child]:left-2 [&>div:first-child]:top-2 [&>div:first-child]:h-7 [&>div:first-child]:w-7 [&>div:first-child_svg]:h-4 [&>div:first-child_svg]:w-4 [&>div:nth-of-type(2)]:hidden [&>div:nth-of-type(3)]:hidden' />
            <div className='text-sm text-gray-500'>
              <p className='text-lg font-semibold text-ink'>{item.docData.name}</p>
              <p className='mt-0.5 text-primary'>{item.docData.speciality}</p>
              <p className='mt-4 flex items-center gap-2'><CalendarClock className='h-4 w-4 text-primary' /> {slotDateFormat(item.slotDate)} at {item.slotTime}</p>
              <p className='mt-2 flex items-start gap-2'><MapPin className='mt-0.5 h-4 w-4 shrink-0 text-primary' /> {[item.docData.address.line1, item.docData.address.line2].filter(Boolean).join(', ')}</p>
            </div>
            <div className='flex flex-col gap-2 sm:min-w-48'>
              {!item.cancelled && item.payment && <div className='rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700'>
                <p>Paid{item.paymentMethod ? ` via ${paymentLabel(item.paymentMethod)}` : ''}</p>
                {item.paymentReference && <p className='mt-0.5 text-xs text-green-600'>{item.paymentReference}</p>}
              </div>}
              {!item.cancelled && !item.payment && <button onClick={() => openPayment(item)} className='flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0b625b]'><CreditCard className='h-4 w-4' /> Pay demo</button>}
              {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='rounded-lg border border-[#d7e2df] px-4 py-2.5 text-sm text-gray-600 hover:border-red-300 hover:text-red-600'>Cancel appointment</button>}
              {item.cancelled && !item.isCompleted && <span className='rounded-lg bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600'>Cancelled</span>}
              {item.isCompleted && <span className='rounded-lg bg-emerald-50 px-4 py-2.5 text-center text-sm font-medium text-emerald-700'>Completed</span>}
            </div>

          </div>
        ))}
      </div>
      {paymentAppointment && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <form onSubmit={confirmPayment} className='w-full max-w-md rounded-lg bg-white shadow-xl'>
            <div className='flex items-start justify-between border-b px-5 py-4'>
              <div>
                <div className='flex items-center gap-2'>
                  <h2 className='text-lg font-semibold text-gray-900'>Demo checkout</h2>
                  <span className='rounded bg-[#fff0eb] px-2 py-0.5 text-xs font-medium text-accent'>DEMO</span>
                </div>
                <p className='mt-1 text-sm text-gray-500'>{paymentAppointment.docData.name}</p>
              </div>
              <button type='button' aria-label='Close checkout' onClick={() => setPaymentAppointment(null)} className='flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-mist hover:text-gray-900'><X className='h-4 w-4' /></button>
            </div>

            <div className='space-y-5 p-5'>
              <div className='flex items-center justify-between border-b pb-4'>
                <span className='text-sm text-gray-500'>Appointment fee</span>
                <span className='text-xl font-semibold text-gray-900'>{currencySymbol} {paymentAppointment.amount}</span>
              </div>

              <div className='grid grid-cols-3 gap-1 rounded border bg-gray-50 p-1'>
                {['bkash', 'nagad', 'card'].map((method) => (
                  <button
                    key={method}
                    type='button'
                    onClick={() => setPaymentMethod(method)}
                    className={`h-9 rounded text-sm font-medium ${paymentMethod === method ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                  >
                    {paymentLabel(method)}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' ? (
                <div className='space-y-3'>
                  <div>
                    <label className='mb-1 block text-sm text-gray-600'>Demo cardholder name</label>
                    <input value={cardName} onChange={(event) => setCardName(event.target.value)} className='w-full rounded border px-3 py-2 outline-primary' placeholder='Test User' autoComplete='off' />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm text-gray-600'>Demo card number</label>
                    <input value={cardNumber} onChange={(event) => setCardNumber(event.target.value.replace(/[^\d ]/g, '').slice(0, 19))} className='w-full rounded border px-3 py-2 outline-primary' placeholder='4242 4242 4242 4242' inputMode='numeric' autoComplete='off' />
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='mb-1 block text-sm text-gray-600'>Expiry</label>
                      <input value={cardExpiry} onChange={(event) => setCardExpiry(event.target.value.slice(0, 5))} className='w-full rounded border px-3 py-2 outline-primary' placeholder='12/30' autoComplete='off' />
                    </div>
                    <div>
                      <label className='mb-1 block text-sm text-gray-600'>Demo CVC</label>
                      <input value={cardCvc} onChange={(event) => setCardCvc(event.target.value.replace(/\D/g, '').slice(0, 4))} className='w-full rounded border px-3 py-2 outline-primary' placeholder='123' inputMode='numeric' autoComplete='off' />
                    </div>
                  </div>
                </div>
              ) : (
                <div className='space-y-3'>
                  <div>
                    <label className='mb-1 block text-sm text-gray-600'>Demo {paymentLabel(paymentMethod)} number</label>
                    <input value={walletNumber} onChange={(event) => setWalletNumber(event.target.value.replace(/\D/g, '').slice(0, 11))} className='w-full rounded border px-3 py-2 outline-primary' placeholder='01XXXXXXXXX' inputMode='numeric' autoComplete='off' />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm text-gray-600'>Demo PIN</label>
                    <input type='password' value={walletPin} onChange={(event) => setWalletPin(event.target.value.replace(/\D/g, '').slice(0, 6))} className='w-full rounded border px-3 py-2 outline-primary' placeholder='1234' inputMode='numeric' autoComplete='new-password' />
                  </div>
                </div>
              )}
            </div>

            <div className='flex gap-3 border-t px-5 py-4'>
              <button type='button' onClick={() => setPaymentAppointment(null)} className='flex-1 rounded border py-2.5 text-sm text-gray-600 hover:bg-gray-50'>Cancel</button>
              <button disabled={isPaying} type='submit' className='flex-1 rounded bg-primary py-2.5 text-sm text-white disabled:opacity-60'>
                {isPaying ? 'Processing...' : `Pay ${currencySymbol} ${paymentAppointment.amount}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div >
  )
}

export default MyAppointments
