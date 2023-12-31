/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import MiniLoader from '../Components/Loader/MiniLoader'

const Register = () => {

    const fields = {
        name: '',
        email: '',
        password: '',
    }

    const [data, setData] = useState(fields)
    const [isLoading, setIsLoading] = useState(false)
    const [resStatus, setResStatus] = useState(false)
    const [resMsg, setResMsg] = useState('')
    const [resMsgColor, setResMsgColor] = useState('')
    const [togglePasswordType, setTogglePasswordType] = useState(false)

    const handleInput = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)

        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/register`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then((res) => {
            setIsLoading(false)
            setResStatus(true)
            setResMsg(res?.message)
            if (res?.status == 'success') {
                setResMsgColor('success')
            } else {
                setResMsgColor('danger')  
            }
        })
        .catch(err => console.log('err', err))
    }

    useEffect(()=>{
        document.title = "Sign Up | To Do List";
    },[])

    return (
        <>
            <div className='guest-form-base px-4'>
                <center>
                    <img src="/todo-pngImage.png" className='w-100' alt="" />
                </center>
                <div className="row w-100">
                    <div className="col-md-12">
                        <div className='mb-3'>
                            <input 
                                type="text"
                                name='name'
                                className='form-control'
                                placeholder='Name'
                                value={data?.name}
                                onChange={handleInput}
                            />
                        </div>
                        <div className='mb-3'>
                            <input 
                                type="text"
                                name='email'
                                className='form-control'
                                placeholder='Email'
                                value={data?.email}
                                onChange={handleInput} 
                            />
                        </div>
                        <div className='mb-3'>
                            <input 
                                type={togglePasswordType ? 'text' : 'password'}
                                name='password'
                                className='form-control w-100'
                                placeholder='Password'
                                value={data?.password}
                                onChange={handleInput} 
                            />
                            {
                                togglePasswordType ?
                                    <small onClick={()=>setTogglePasswordType(!togglePasswordType)}><i className="fa-regular fa-eye-slash"></i> Hide Password</small>
                                :
                                    <small onClick={()=>setTogglePasswordType(!togglePasswordType)}><i className="fa-regular fa-eye"></i> Show Password</small>
                            }
                        </div>
                        {
                            !isLoading ?
                                <button type='button' className='btn btn-custom w-100' onClick={handleSubmit}>Signup</button>
                            :
                                <MiniLoader />
                        }
                        {
                            resStatus &&
                            <div className={`text-center fs-5 text-${resMsgColor}`}>{resMsg}</div>
                        }
                        <div className='text-center mt-2'>Already have Account ? <br /> <Link to='/'>Click here</Link> to Sign in.</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register