import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa";
import {useForm} from 'react-hook-form';

export const Login = () => {
    const[message, setMessage] = useState("");
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

    const handleGoogleSigin = ()=>{
        
    }
  return (
    <div className='h-[calc(100vh-120px)] flex justify-center items-center'>
        <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className='text-xl font-semibold mb-4'>Please Login</h2>


            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label  className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
                    <input type="email" 
                    {...register("email", { required: true })} name="email" id="email" placeholder="Email Address" className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
                    
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

                <div className="">
                    <button className='bg-blue-500 hover:bg-blue-700 font-bold text-white px-8 py-2 rounded focus:outline-none'>Login</button>
                </div>
            
            </form>
            <p className='font-medium mt-4 text-sm'>Don't have an account? 
                   <Link to='/register' className='text-blue-500 hover:text-blue-700'>Register here</Link> </p>

                   {/* {google signin} */}
                   <div className="mt-4">
                        <button 
                        onClick={handleGoogleSigin}
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
