import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa";
import {useForm} from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { getBaseUrl } from '../utils/baseURL';

export const UserLogin = () => {
    const[message, setMessage] = useState("");
    const {loginUser, signInWithGoogle} = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    
    // Regular Firebase login
    const onSubmitFirebase = async (data) => {
        try {
            await loginUser(data.email, data.password);
            alert("Login successful!");
            navigate("/")
        } catch (error) {
            setMessage("Please provide a valid email and password.")
            console.log("Error faced: ", error)  
        }
    };

    // Backend API login
    const onSubmitBackend = async (data) => {
        try {
            const response = await axios.post(`${getBaseUrl()}/api/auth/user`, data, {
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const auth = response.data;
            
            if(auth.token){
                localStorage.setItem('token', auth.token);
                setTimeout(()=>{
                    localStorage.removeItem('token')
                    alert('Token has expired, please login again!')
                    navigate("/")
                }, 3600*1000)
            }

            alert("Login Successful!");
            navigate("/");
        } catch (error) {
            setMessage("Please provide a valid username and password.")
            console.log("Error faced: ", error)  
        }
    };

    // Handle the appropriate login method
    const onSubmit = (data) => {
        // If email is provided, use Firebase
        if (data.email) {
            return onSubmitFirebase(data);
        } else {
            return onSubmitBackend(data);
        }
    };

    const handleGoogleSignin = async()=>{
        try {
            await signInWithGoogle();
            alert("Login successful!")
            navigate("/")
        } catch (error) {
            alert("Google signin failed.")
            console.log("Error during google signin: ", error)  
        }
    }

    return (
        <div className='h-[calc(100vh-120px)] flex justify-center items-center'>
            <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className='text-xl font-semibold mb-4'>User Login</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            {...register("username")} 
                            name="username" 
                            id="username" 
                            placeholder="Username" 
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' 
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
                        <input 
                            type="password"
                            {...register("password", { required: true })}
                            name="password" 
                            id="password" 
                            placeholder="Enter password" 
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' 
                        />
                    </div>

                    {
                        message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>
                    }

                    <div className="">
                        <button className='bg-blue-500 hover:bg-blue-700 font-bold text-white px-8 py-2 rounded focus:outline-none'>Login</button>
                    </div>
                </form>
                
                <p className='font-medium mt-4 text-sm'>Don't have an account? 
                    <Link to='/register' className='text-blue-500 hover:text-blue-700'> Register here</Link> 
                </p>

                {/* Google signin */}
                <div className="mt-4">
                    <button 
                        onClick={handleGoogleSignin}
                        className='w-full flex flex-wrap gap-1 items-center justify-center bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded outline-none'>
                        <FaGoogle/>
                        Sign in with Google
                    </button>
                </div>
                <p className='mt-5 text-center text-gray-500 text-xs'>&copy;2024 Book Store. All rights reserved</p>
            </div>
        </div>
    )
}