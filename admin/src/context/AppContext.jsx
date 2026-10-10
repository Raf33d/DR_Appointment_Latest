import React, { createContext, useState } from 'react';
// ...existing code...
export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = '৳'

    const calculateAge = (dob) => {
        if (!dob || dob === 'Not Selected') return '—'

        const birthDate = new Date(dob)
        if (Number.isNaN(birthDate.getTime())) return '—'

        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const birthdayHasNotPassed = today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())

        if (birthdayHasNotPassed) age -= 1
        return age >= 0 ? age : '—'
    }

    const months = [" ", 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('-')
        return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
    }

    const value = {
        calculateAge, // Add your context values here
        slotDateFormat,
        currency
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
            
        </AppContext.Provider>
    )

}

export default AppContextProvider
