import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import {assets} from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Camera, Check, Pencil, UserRound } from 'lucide-react'


const MyProfile = () => {
  
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {

    try {

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const {data} = await axios.post(backendUrl + "/api/user/update-profile", formData,{headers: { token }});

      if (data.success) {
        toast.success("Profile updated successfully");
        
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }




  }


  const inputClass = 'w-full rounded border border-[#cddbd8] bg-white px-3 py-2.5 text-sm text-ink'

  return userData && (
    <div className='py-10 sm:py-14'>
      <div className='mb-8'>
        <p className='section-kicker'>Account</p>
        <h1 className='page-title mt-3'>My profile</h1>
      </div>

      <div className='grid gap-6 lg:grid-cols-[280px_1fr]'>
        <aside className='surface p-6'>
          {isEdit ? (
            <label htmlFor='image' className='group relative block cursor-pointer'>
              <img className='aspect-square w-full rounded-lg object-cover' src={image ? URL.createObjectURL(image) : userData.image} alt={userData.name} />
              <span className='absolute inset-0 flex items-center justify-center rounded-lg bg-ink/50 text-white opacity-0 transition group-hover:opacity-100'><Camera className='h-6 w-6' /></span>
              <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
            </label>
          ) : (
            <img className='aspect-square w-full rounded-lg object-cover' src={userData.image} alt={userData.name} />
          )}
          <div className='mt-5'>
            <p className='text-lg font-semibold text-ink'>{userData.name}</p>
            <p className='mt-1 text-sm text-gray-500'>{userData.email}</p>
          </div>
        </aside>

        <section className='surface p-6 sm:p-8'>
          <div className='flex items-center justify-between border-b border-[#e5ecea] pb-5'>
            <div className='flex items-center gap-3'><span className='flex h-10 w-10 items-center justify-center rounded-lg bg-mist text-primary'><UserRound className='h-5 w-5' /></span><div><h2 className='font-semibold text-ink'>Personal information</h2><p className='text-xs text-gray-500'>Your contact and basic details</p></div></div>
            {!isEdit && <button onClick={() => setIsEdit(true)} className='flex items-center gap-2 rounded-lg border border-[#cddbd8] px-3 py-2 text-sm font-medium text-ink hover:border-primary hover:text-primary'><Pencil className='h-4 w-4' /> Edit</button>}
          </div>

          <div className='mt-6 grid gap-5 sm:grid-cols-2'>
            <div><label className='text-xs font-semibold uppercase text-gray-500'>Full name</label>{isEdit ? <input className={`${inputClass} mt-1.5`} value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} /> : <p className='mt-2 text-sm text-ink'>{userData.name}</p>}</div>
            <div><label className='text-xs font-semibold uppercase text-gray-500'>Email</label><p className='mt-2 text-sm text-ink'>{userData.email}</p></div>
            <div><label className='text-xs font-semibold uppercase text-gray-500'>Phone</label>{isEdit ? <input className={`${inputClass} mt-1.5`} value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} /> : <p className='mt-2 text-sm text-ink'>{userData.phone || 'Not provided'}</p>}</div>
            <div><label className='text-xs font-semibold uppercase text-gray-500'>Gender</label>{isEdit ? <select className={`${inputClass} mt-1.5`} onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}><option value='Male'>Male</option><option value='Female'>Female</option></select> : <p className='mt-2 text-sm text-ink'>{userData.gender || 'Not provided'}</p>}</div>
            <div><label className='text-xs font-semibold uppercase text-gray-500'>Birthday</label>{isEdit ? <input className={`${inputClass} mt-1.5`} type='date' onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} /> : <p className='mt-2 text-sm text-ink'>{userData.dob || 'Not provided'}</p>}</div>
            <div className='sm:col-span-2'><label className='text-xs font-semibold uppercase text-gray-500'>Address</label>{isEdit ? <div className='mt-1.5 grid gap-2 sm:grid-cols-2'><input className={inputClass} onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} placeholder='Address line 1' /><input className={inputClass} onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} placeholder='Address line 2' /></div> : <p className='mt-2 text-sm text-ink'>{[userData.address.line1, userData.address.line2].filter(Boolean).join(', ') || 'Not provided'}</p>}</div>
          </div>

          {isEdit && <div className='mt-8 flex justify-end gap-3 border-t border-[#e5ecea] pt-5'><button onClick={() => setIsEdit(false)} className='rounded-lg border border-[#cddbd8] px-4 py-2.5 text-sm font-medium text-gray-600'>Cancel</button><button onClick={updateUserProfileData} className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white'><Check className='h-4 w-4' /> Save information</button></div>}
        </section>
      </div>
    </div>
  )
}

export default MyProfile
