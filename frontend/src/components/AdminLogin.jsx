import React, { useState } from 'react'
import {useForm} from 'react-hook-form';
import axios from "axios";
import { getBaseUrl } from '../utils/baseURL';
import { useNavigate } from 'react-router-dom';

export const AdminLogin = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const[message, setMessage] = useState("");
    const navigate = useNavigate();
    const onSubmit = async (data) =>
        {
            console.log(data);
            try {
                const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
                    headers: {
                        'Content-type': 'application/json',
                    }
                })
                const auth = response.data;
                console.log(auth)
                // navigate("/")
                if(auth.token){
                    localStorage.setItem('token', auth.token);
                    setTimeout(()=>{
                        localStorage.removeItem('token')
                        alert('Token has expired, please login again!')
                        navigate("/")
                    }, 3600*1000)
                }

                alert("Admin Login Successful!")
                navigate("/dashboard")
            } catch (error) {
                setMessage("Please provide a valid email and password.")
                console.log("Error faced: ", error)  
                
            }
        }

  return (
    <div className='h-screen flex justify-center items-center'>
        <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className='text-xl font-semibold mb-4'>Admin Dashboard Login</h2>


            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label  className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Username</label>
                    <input type="text" 
                    {...register("username", { required: true })} name="username" id="username" placeholder="username" className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
                    
                </div>
                <div className="mb-4">
                    <label  className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
                    <input type="password"
                    {...register("password", { required: true })}
                    name="password" id="password" placeholder="Enter password" className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
                </div>

                {
                    message && <p className='text-red-500 text-xs italic mb-3 '>{message}</p>
                }

                <div className="w-full">
                    <button className='w-full bg-blue-500 hover:bg-blue-700 font-bold text-white px-8 py-2 rounded focus:outline-none'>Login</button>
                </div>
            
            </form>

                 
                   <p className='mt-5 text-center text-gray-500 text-xs'>&copy;2024 Book Store. All rights reserved</p>
        </div>
    </div>
  )
}
