import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext.jsx'
import { ArrowRight, LockKeyhole, ShieldCheck, Stethoscope } from 'lucide-react'

const Login = () => {
  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const { setAToken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)

  const onSubmitHandler = async (event) => {

    event.preventDefault()

    try {

      if (state === 'Admin') {

        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        console.log(data) // <--- Add this line
        if (data.success) {

          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          console.log(data.token)
        } else {
          toast.error(data.message || 'Login failed')

        }


      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {

          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          console.log(data.token)
        } else {
          toast.error(data.message || 'Login failed')

        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to connect to the server')
    }

  }






  return (
    <main className='grid min-h-screen bg-mist lg:grid-cols-[0.95fr_1.05fr]'>
      <section className='hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14'>
        <div className='flex items-center gap-2.5'><span className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'><Stethoscope className='h-5 w-5' /></span><span className='text-xl font-semibold'>MedBook</span></div>
        <div><p className='text-xs font-semibold uppercase text-[#76c7bd]'>Clinic workspace</p><h1 className='mt-4 max-w-lg text-4xl font-semibold leading-tight'>Care operations, organized in one place.</h1><p className='mt-5 max-w-md leading-7 text-white/65'>Manage doctors, appointments, availability, and patient visits from a focused local dashboard.</p></div>
        <p className='flex items-center gap-2 text-sm text-white/60'><ShieldCheck className='h-4 w-4 text-[#76c7bd]' /> Local demo environment</p>
      </section>

      <form onSubmit={onSubmitHandler} className='flex items-center justify-center p-5 sm:p-8'>
        <div className='admin-panel w-full max-w-md p-6 sm:p-8'>
          <div className='mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-mist text-primary'><LockKeyhole className='h-5 w-5' /></div>
          <h2 className='text-2xl font-semibold text-ink'>Staff sign in</h2>
          <p className='mt-2 text-sm text-gray-500'>Choose your workspace and enter your credentials.</p>

          <div className='mt-6 grid grid-cols-2 rounded-lg bg-mist p-1'>
            {['Admin', 'Doctor'].map(role => <button key={role} type='button' onClick={() => setState(role)} className={`rounded-md py-2 text-sm font-medium ${state === role ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>{role}</button>)}
          </div>

          <div className='mt-6 space-y-4 text-sm'>
            <div><label className='font-medium text-ink'>Email</label><input onChange={(e) => setEmail(e.target.value)} value={email} type='email' required className='mt-1.5 w-full rounded border border-[#cddbd8] px-3 py-2.5' /></div>
            <div><label className='font-medium text-ink'>Password</label><input onChange={(e) => setPassword(e.target.value)} value={password} type='password' required className='mt-1.5 w-full rounded border border-[#cddbd8] px-3 py-2.5' /></div>
            <button className='flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-white hover:bg-[#0b625b]'>Sign in as {state.toLowerCase()} <ArrowRight className='h-4 w-4' /></button>
          </div>
        </div>
      </form>
    </main>
  )
}

export default Login
