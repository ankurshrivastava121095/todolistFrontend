/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AuthGuard from '../Components/AuthGuard'
import { useNavigate } from 'react-router-dom'
import MiniLoader from '../Components/Loader/MiniLoader'
import LargeLoader from '../Components/Loader/LargeLoader'

const Task = () => {

    const navigate = useNavigate()

    const fields = {
        userId: '',
        title: '',
    }

    const [data, setData] = useState(fields)
    const [isLoading, setIsLoading] = useState(true)
    const [list, setList] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [loggedInUser, setLoggedInUser] = useState()
    const [toggleInputField, setToggleInputField] = useState(false)
    const [resStatus, setResStatus] = useState(false)
    const [resMsg, setResMsg] = useState('')
    const [resMsgColor, setResMsgColor] = useState('')
    const [isUpdate, setIsUpdate] = useState(false)
    const [taskId, setTaskId] = useState('')

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const filteredList = list.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInput = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (isUpdate) {
            fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/update-task/${taskId}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then((res) => {
                if (res?.status == 'success') {
                    setData({
                        ...data,
                        title: ''
                    })
                    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/fetch-all-task/${data?.userId}`)
                    .then(response => response.json())
                    .then((res) => {
                        setList(res?.data)
                        setIsLoading(false)
                    });
                    setToggleInputField(false)
                } else {
                    setIsLoading(false)
                    setResMsg(res?.message)
                    setResMsgColor('danger') 
                    setResStatus(true)
                }
            })
            .catch(err => console.log('err', err))
        } else {
            fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/add-task`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then((res) => {
                if (res?.status == 'success') {
                    setData({
                        ...data,
                        title: ''
                    })
                    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/fetch-all-task/${data?.userId}`)
                    .then(response => response.json())
                    .then((res) => {
                        setList(res?.data)
                        setIsLoading(false)
                    });
                    setToggleInputField(false)
                } else {
                    setIsLoading(false)
                    setResMsg(res?.message)
                    setResMsgColor('danger') 
                    setResStatus(true)
                }
            })
            .catch(err => console.log('err', err))
        }
    }

    const handleEdit = (taskId) => {
        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/fetch-task/${taskId}`)
        .then(response => response.json())
        .then((res) => {
            setData({
                ...data,
                title: res?.data?.title
            })
            setTaskId(taskId)
            setIsUpdate(true)
            setToggleInputField(true)
        });
    }

    const cancelEdit = () => {
        setData({
            ...data,
            title: ''
        })
        setTaskId('')
        setIsUpdate(false)
        setToggleInputField(false)
    }

    const handleDelete = (task_id) => {
        const shouldLogout = window.confirm("Are you sure you want to Delete this Task?")

        if (shouldLogout) {
            setIsLoading(true)
    
            fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/delete-task/${task_id}`)
            .then(response => response.json())
            .then((res) => {
                   fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/fetch-all-task/${data?.userId}`)
                    .then(response => response.json())
                    .then((res) => {
                        setList(res?.data)
                        setIsLoading(false)
                    });
            });
        }
    }

    const handleLogout = (e) => {
        const shouldLogout = window.confirm("Are you sure you want to Sign out?");
        if (shouldLogout) {
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    useEffect(()=>{
        const user = localStorage.getItem('userData')
        const userObj = JSON.parse(user)
        setLoggedInUser(userObj)

        setData({
            ...data,
            userId: userObj?._id
        })

        document.title = `${userObj?.name?.split(' ')[0]}'s List | To Do List`

        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/fetch-all-task/${userObj?._id}`)
        .then(response => response.json())
        .then((res) => {
            setList(res?.data)
            setIsLoading(false)
        });
    },[])

    return (
        <>
            <AuthGuard />
            <div className='px-4 py-5'>
                <div className="row">
                    <div className="col-md-12">
                        <div className='d-flex align-items-center justify-content-between'>
                            <i className="fa-solid fa-bars-staggered fs-4 text-secondary" onClick={()=>setToggleInputField(!toggleInputField)}></i>
                            <img src="/todo-pngImage.png" className='w-50' alt="" />
                            <i className="fa-solid fa-arrow-right-from-bracket fs-4 text-secondary" onClick={handleLogout}></i>
                        </div>
                        {
                            toggleInputField &&
                            <div className='my-3'>
                                <textarea
                                    name='title'
                                    rows='3'
                                    className='form-control'
                                    placeholder='Add New Task'
                                    value={data?.title}
                                    onChange={handleInput}
                                ></textarea>
                                {
                                    !isLoading ?
                                    <div className='d-flex align-items-center justify-content-center gap-4 mt-3'>
                                        <button type='button' className='btn btn-custom' onClick={handleSubmit}>
                                            {
                                                !isUpdate ?
                                                    <i className="fa-solid fa-plus"></i>
                                                :
                                                    <i className="fa-solid fa-check"></i>
                                            }
                                        </button>
                                        {
                                            isUpdate &&
                                            <button type='button' className='btn btn-danger' onClick={cancelEdit}>
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        }
                                    </div>
                                    :
                                        <MiniLoader />
                                }
                                {
                                    resStatus &&
                                    <div className={`text-center fs-6 text-${resMsgColor}`}>{resMsg}</div>
                                }
                            </div>
                        }
                        <h1 className='fw-bold fst-italic my-4'>What&apos;s up, {loggedInUser?.name?.split(' ')[0]}</h1>

                        {
                            !isLoading ?
                            <>
                                <div className='my-3'>
                                    <input 
                                        type="search"
                                        name='title'
                                        className='form-control'
                                        placeholder='Search Task'
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <div className='text-secondary my-3'>Your Task</div>
                                <div className='overflowY-auto h-45vh'>
                                    {
                                        filteredList?.length > 0 ?
                                        Array?.isArray(filteredList) && filteredList?.map((val,key)=>(
                                            <div key={key} className='mb-4 text-justify'><i className="fa-solid fa-circle-xmark text-danger" onClick={() => handleDelete(val?._id)}></i> <span onClick={() => handleEdit(val?._id)}>{val?.title}</span></div>
                                        ))
                                        :
                                        <><center><div className='text-secondary'>No Task</div></center></>
                                    }
                                </div>
                            </>
                            :
                                <>
                                    <br /><br /><br /><br /><br />
                                    <LargeLoader />
                                </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Task