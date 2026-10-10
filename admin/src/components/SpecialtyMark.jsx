import React from 'react'
import { Baby, Brain, HeartPulse, Microscope, ScanFace, Stethoscope, Venus } from 'lucide-react'

const markTypes = [
  { match: 'pediatric', icon: Baby, bg: 'bg-[#fff0eb]', color: 'text-accent', label: 'Children’s health' },
  { match: 'neurolog', icon: Brain, bg: 'bg-[#e8eef8]', color: 'text-[#476a9b]', label: 'Neurology' },
  { match: 'gyne', icon: Venus, bg: 'bg-[#f9edf0]', color: 'text-[#a84d69]', label: 'Women’s health' },
  { match: 'dermat', icon: ScanFace, bg: 'bg-[#f4f0e6]', color: 'text-[#96743b]', label: 'Skin health' },
  { match: 'gastro', icon: Microscope, bg: 'bg-[#e9f2ec]', color: 'text-[#477a58]', label: 'Digestive health' },
  { match: 'general', icon: HeartPulse, bg: 'bg-[#e7f3f1]', color: 'text-primary', label: 'Primary care' },
]

const SpecialtyMark = ({ name = 'Doctor', speciality = 'General physician', className = '' }) => {
  const mark = markTypes.find(({ match }) => speciality.toLowerCase().includes(match)) || {
    icon: Stethoscope, bg: 'bg-[#e7f3f1]', color: 'text-primary', label: 'Specialist'
  }
  const Icon = mark.icon
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()

  return (
    <div role='img' aria-label={`${name}, ${speciality}`} className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden ${mark.bg} ${className}`}>
      <div className='absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/80'><Icon className={`h-5 w-5 ${mark.color}`} strokeWidth={1.8} /></div>
      <span className='select-none text-7xl font-semibold leading-none text-ink/75'>{initials}</span>
      <div className='absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white/85 px-3 py-2 text-xs font-medium text-ink'><span className={`h-2 w-2 rounded-full ${mark.color.replace('text-', 'bg-')}`} />{mark.label}</div>
      <div className='absolute bottom-5 left-5 flex gap-1.5' aria-hidden='true'>
        {['opacity-30', 'opacity-40', 'opacity-50', 'opacity-60'].map(opacity => <span key={opacity} className={`h-1.5 w-1.5 rounded-sm ${mark.color.replace('text-', 'bg-')} ${opacity}`} />)}
      </div>
    </div>
  )
}

export default SpecialtyMark
