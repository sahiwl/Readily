import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../redux/features/auth/useAuthStore.js';

export const Login = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { loginWithFirebase, loginWithGoogle } = useAuthStore();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await loginWithFirebase(data.email, data.password);
            setLoading(false);
            alert("Login successful!");
            navigate("/")
        } catch (error) {
            setLoading(false);
            setMessage("Please provide a valid email and password.")
            console.log("Error faced: ", error)
        }
    }

    const handleGoogleSignin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            setLoading(false);
            alert("Login successful!")
            navigate("/")
        } catch (error) {
            setLoading(false);
            alert("Google signin failed.")
            console.log("Error during google signin: ", error)
        }
    }

    return (
        <div className='h-[calc(100vh-120px)] flex justify-center items-center bg-white'>
            <div className="w-full max-w-sm mx-auto bg-white brutal-border brutal-shadow px-8 pt-6 pb-8 mb-4">
                <h2 className='text-3xl font-black mb-6 uppercase tracking-tight' style={{ color: 'var(--color-secondary)' }}>Please Login</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <label className='block text-sm font-black mb-2 uppercase tracking-wide' htmlFor="email" style={{ color: 'var(--color-secondary)' }}>Email</label>
                        <input type="email"
                            {...register("email", { required: true })} name="email" id="email" placeholder="Email Address" className='brutal-input w-full focus:outline-none' />

                    </div>
                    <div className="mb-6">
                        <label className='block text-sm font-black mb-2 uppercase tracking-wide' htmlFor="password" style={{ color: 'var(--color-secondary)' }}>Password</label>
                        <input type="password"
                            {...register("password", { required: true })}
                            name="password" id="password" placeholder="Enter password" className='brutal-input w-full focus:outline-none' />
                    </div>

                    {
                        message && <p className='text-red-500 text-xs italic mb-3 '>{message}</p>
                    }

                    <div className="">
                        <button
                            disabled={loading}
                            className={`brutal-button w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>

                </form>
                <p className='font-bold mt-6 text-sm'>Don't have an account?
                    <Link to='/register' className='font-black underline' style={{ color: 'var(--color-accent)' }}> Register here</Link> </p>

                {/* {google signin} */}
                <div className="mt-6">
                    <button
                        onClick={handleGoogleSignin}
                        disabled={loading}
                        className={`brutal-button-secondary w-full flex flex-wrap gap-2 items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <FaGoogle />
                        {loading ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                </div>
                <p className='mt-6 text-center font-bold text-xs' style={{ color: 'var(--color-secondary)' }}>&copy;2024 Book Store. All rights reserved</p>
            </div>
        </div>
    )
}
