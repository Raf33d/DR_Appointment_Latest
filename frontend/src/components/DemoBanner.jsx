import React, { useState } from 'react'
import { DEMO_ADMIN_EMAIL, DEMO_DOCTOR_EMAIL, DEMO_PASSWORD, DEMO_PATIENT_EMAIL, resetDemo } from '../../../demo/mockApi.js'

// Shown only in demo builds (VITE_DEMO_MODE=true): explains the demo and lists the logins.
const DemoBanner = () => {
  const [open, setOpen] = useState(false)
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return null

  const reset = () => {
    resetDemo()
    window.location.reload()
  }

  return (
    <div className='border-b border-amber-200 bg-amber-50 text-[13px] text-amber-900'>
      <div className='mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-6 lg:px-8'>
        <p><span className='font-semibold'>Demo version.</span> Everything runs in your browser with sample data, and changes are only saved on this device.</p>
        <div className='flex items-center gap-3'>
          <button type='button' onClick={() => setOpen(!open)} className='font-semibold underline underline-offset-2'>{open ? 'Hide logins' : 'Show demo logins'}</button>
          <button type='button' onClick={reset} className='rounded border border-amber-300 px-2 py-0.5 font-medium hover:bg-amber-100'>Reset demo</button>
        </div>
      </div>
      {open && (
        <div className='mx-auto grid max-w-[1280px] gap-1 px-4 pb-3 sm:grid-cols-3 sm:px-6 lg:px-8'>
          <p><span className='font-semibold'>Patient:</span> {DEMO_PATIENT_EMAIL}</p>
          <p><span className='font-semibold'>Admin (staff panel):</span> {DEMO_ADMIN_EMAIL}</p>
          <p><span className='font-semibold'>Doctor (staff panel):</span> {DEMO_DOCTOR_EMAIL}</p>
          <p className='sm:col-span-3'>Password for all of them: <span className='font-mono font-semibold'>{DEMO_PASSWORD}</span>. You can also create your own patient account.</p>
        </div>
      )}
    </div>
  )
}

export default DemoBanner
