import React from 'react'
import footerLogo from "../assets/footer-logo.png"

import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa"

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 px-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <h1 className="font-Cinzel text-4xl text-gray-600">
               <a href="https://sahiwl-readily.vercel.app/">
                Readily
               </a>
                </h1>

            </div>
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-gray-700">
                <ul className="flex gap-6 mb-4 md:mb-0">
                    <p>
                        &copy;Sahil Kumar Ray 2024 All Rights Reserved</p>
                </ul>

                <div className="flex gap-6">
                    <a href="https://www.linkedin.com/in/sahilkr04" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className='text-gray-500 cursor-pointer hover: text-#00ADB5 hover:-translate-y-2 transition-all duration-200' size={24} />
                    </a>

                    <a href="https://github.com/sahiwl" target="_blank" rel="noopener noreferrer">
                        <FaGithub className='text-gray-500 cursor-pointer hover: text-#00ADB5 hover:-translate-y-2 transition-all duration-200' size={24} />
                    </a>

                    <a href="https://twitter.com/sahilwithocd" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                        <FaTwitter className='text-gray-500 cursor-pointer hover: text-#00ADB5 hover:-translate-y-2 transition-all duration-200' size={24} />
                    </a>
                    <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                        <FaInstagram className='text-gray-500 cursor-pointer hover: text-#00ADB5 hover:-translate-y-2 transition-all duration-200' size={24} />
                    </a>
                </div>
            </div>
        </footer>
    )
}

