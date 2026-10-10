import React,{useContext, useState} from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { HeartPulse } from 'lucide-react'


const AddDoctor = () => {

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [experience,setExperience] = useState('1 Year')
    const [fees,setFees] = useState('')
    const [about,setAbout] = useState('')
    const [speciality,setSpeciality] = useState('General physician')
    const [degree,setDegree] = useState('')
    const [address1,setAddress1] = useState('')
    const [address2,setAddress2] = useState('')

    const {backendUrl, aToken} = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
      event.preventDefault()

      try {
        
        const doctorData = {
          name,
          email,
          password,
          experience,
          fees: Number(fees),
          about,
          speciality,
          degree,
          address: JSON.stringify({ line1: address1, line2: address2 })
        }
        const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', doctorData, { headers: { aToken } })

        if(data.success){

          toast.success(data.message)
          setName('')
          setEmail('')
          setPassword('')
          setFees('')
          setAbout('')
          setDegree('')
          setAddress1('')
          setAddress2('')

        } else {
          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      }

    }

    


  return (
    <form onSubmit={onSubmitHandler} className='admin-page'>
      <p className='text-xs font-semibold uppercase text-primary'>Team</p><h1 className='mb-6 mt-1 text-2xl font-semibold text-ink'>Add a doctor</h1>
      <div className='admin-panel w-full max-w-4xl p-6 sm:p-8'>
        <div className='mb-8 flex items-center gap-4 rounded-lg border border-[#dfe9e7] bg-mist p-4 text-gray-600'>
          <span className='flex h-12 w-12 items-center justify-center rounded-lg bg-white text-primary'><HeartPulse className='h-6 w-6' /></span>
          <div><p className='font-medium text-ink'>A doctor identity is created automatically</p><p className='mt-1 text-sm'>Their initials and specialty will appear in the clinic directory. No photo upload needed.</p></div>
        </div>
        {/* Two-column grid for fields */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 text-gray-600'>
          {/* Left column */}
          <div className='flex flex-col gap-4'>
            <div>
              <p>Doctor name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2 w-full' type="text" placeholder='Name' required />
            </div>
            <div>
              <p>Doctor Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2 w-full' type="email" placeholder='Email' required />
            </div>
            <div>
              <p>Doctor Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2 w-full' type="password" placeholder='Password' required />
            </div>
            <div>
              <p>Experience</p>
              <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2 w-full'>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>
            <div>
              <p>Fees</p>
              <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2 w-full' type="number" placeholder='Fees' required />
            </div>
          </div>
          {/* Right column */}
          <div className='flex flex-col gap-4'>
            <div>
              <p>Speciality</p>
              <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2 w-full'>
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div>
              <p>Education</p>
              <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2 w-full' type="text" placeholder='Education' required />
            </div>
            <div>
              <p>Address</p>
              <div className='flex flex-col gap-2'>
                <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2 w-full' type="text" placeholder='Address 1' required />
                <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2 w-full' type="text" placeholder='Address 2'  />
              </div>
            </div>
          </div>
        </div>
        {/* About Doctor and Button - spans both columns */}
        <div className='mt-6'>
          <p>About Doctor</p>
          <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 py-2 border rounded mb-4' placeholder='Write about doctor' rows={4}  />
          <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-white hover:bg-[#0b625b]">Add doctor</button>
        </div>
      </div>
    </form>
  )
}

export default AddDoctor
