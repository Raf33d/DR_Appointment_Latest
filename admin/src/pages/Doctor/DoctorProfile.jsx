import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import SpecialtyMark from '../../components/SpecialtyMark'

const DoctorProfile = () => {

  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      }

      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })
      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  }

  useEffect(() => {

    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  return profileData && (
    <div className='admin-page'>
      <p className='text-xs font-semibold uppercase text-primary'>Account</p><h1 className='mb-6 mt-1 text-2xl font-semibold text-ink'>Doctor profile</h1>
      <div className='grid gap-5 lg:grid-cols-[280px_1fr]'>

        <div>
          <SpecialtyMark name={profileData.name} speciality={profileData.speciality} className='admin-panel aspect-square w-full' />
        </div>
        <div className='admin-panel flex-1 p-6 sm:p-8'>

          {/*doc info*/}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
              {profileData.about}
            </p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment Fees: <span className='text-gray-800'>{currency} {isEdit ? <input type='number' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} /> : profileData.fees}</span>
          </p>

          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              {isEdit ? <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} /> : profileData.address.line1}
              <br />
              {isEdit ? <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} /> : profileData.address.line2}
            </p>
          </div>

          <div className='flex gap-1 pt-2'>
            <input onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} type="checkbox" name='' id="" />
            <label htmlFor="">Available for Appointment</label>
          </div>

          {
            isEdit
              ? <button onClick={updateProfile} className='mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white'>Save changes</button>
              : <button onClick={() => setIsEdit(true)} className='mt-6 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white'>Edit profile</button>
          }


        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
