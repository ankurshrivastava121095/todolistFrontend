/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const GuestGuard = () => {

    const navigate = useNavigate()

    useEffect(()=>{
        const isUserLoggedIn = localStorage.getItem('userData')

        if (isUserLoggedIn) {
            navigate('/task')
        }
    },[])

    return (
        <></>
    )
}

export default GuestGuard
