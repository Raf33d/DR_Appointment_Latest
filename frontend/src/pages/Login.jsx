import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, ShieldCheck, Stethoscope } from 'lucide-react'


const Login = () => {

  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')


  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {

      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message || "Something went wrong")
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          toast.success(data.message)
          localStorage.setItem('token', data.token) // <-- Add this line
          setToken(data.token)
        } else {
          toast.error(data.message || "Something went wrong")
        }
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Unable to connect to the server")
    }
    



  }


  useEffect(() => {

    if (token) {
      navigate('/')
    }

  }, [token])

  return (
    <div className='grid min-h-[calc(100vh-72px)] items-stretch py-8 lg:grid-cols-[1fr_1.05fr] lg:gap-8'>
      <div className='hidden rounded-lg bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between'>
        <div className='flex items-center gap-2.5'><span className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'><Stethoscope className='h-5 w-5' /></span><span className='text-xl font-semibold'>MedBook</span></div>
        <div><p className='section-kicker'>Patient access</p><h1 className='mt-4 max-w-lg text-4xl font-semibold leading-tight'>Your appointments and care details, in one secure place.</h1><p className='mt-5 max-w-md leading-7 text-white/65'>Book trusted doctors, manage your profile, and follow every appointment without the paperwork.</p></div>
        <div className='flex items-center gap-2 text-sm text-white/60'><ShieldCheck className='h-4 w-4 text-[#76c7bd]' /> Local and private demo data</div>
      </div>
      <form onSubmit={onSubmitHandler} className='flex items-center justify-center'>
      <div className='surface w-full max-w-md p-6 sm:p-8'>
        <div className='mb-7 flex h-11 w-11 items-center justify-center rounded-lg bg-mist text-primary'><LockKeyhole className='h-5 w-5' /></div>
        <h2 className='text-2xl font-semibold text-ink'>{state === 'Sign Up' ? 'Create your account' : 'Welcome back'}</h2>
        <p className='mt-2 text-sm text-gray-500'>{state === 'Sign Up' ? 'Start booking and managing appointments.' : 'Sign in to continue to your care dashboard.'}</p>
        <div className='mt-7 flex flex-col gap-4 text-sm text-gray-600'>
        {
          state === "Sign Up" && <div className='w-full'>
            <label className='font-medium text-ink'>Full name</label>
            <input className='mt-1.5 w-full rounded border border-[#cddbd8] bg-white px-3 py-2.5' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
          </div>
        }

        <div className='w-full'>
          <label className='font-medium text-ink'>Email</label>
          <input className='mt-1.5 w-full rounded border border-[#cddbd8] bg-white px-3 py-2.5' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
        </div>
        <div className='w-full'>
          <label className='font-medium text-ink'>Password</label>
          <input className='mt-1.5 w-full rounded border border-[#cddbd8] bg-white px-3 py-2.5' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
        </div>
        <button type='submit' className='mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-[#0b625b]'>{state === 'Sign Up' ? 'Create account' : 'Sign in'} <ArrowRight className='h-4 w-4' /></button>
        {
          state === "Sign Up"
            ? <p className='text-center text-gray-500'>Already registered? <button type='button' onClick={() => setState('Login')} className='font-semibold text-primary'>Sign in</button></p>
            : <p className='text-center text-gray-500'>New to MedBook? <button type='button' onClick={() => setState('Sign Up')} className='font-semibold text-primary'>Create an account</button></p>
        }
        </div>
      </div>
      </form>
    </div>
  )
}

export default Login
