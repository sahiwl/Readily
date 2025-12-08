import React from 'react'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa"

export const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 px-4 relative overflow-hidden">
            {/* Geometric background elements */}
            <div className="absolute top-0 left-0 w-full h-4 bg-primary"></div>
            <div className="absolute top-4 right-10 w-20 h-20 bg-accent brutal-border border-white transform rotate-45"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-neon brutal-border border-white transform -rotate-12"></div>
            
            <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                    <div>
                        <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tight mb-4">
                            <a href="https://readily.sahiwl.live/" className="text-white hover:text-primary transition-colors">
                                Readily
                            </a>
                        </h1>
                        <p className="font-bold text-sm uppercase tracking-wider text-gray-300">
                            Your Next Chapter Awaits
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                        <a 
                            href="https://www.linkedin.com/in/sahilkr04" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="brutal-border border-white bg-white text-black p-3 brutal-shadow-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group"
                        >
                            <FaLinkedin className='group-hover:scale-110 transition-transform' size={20} />
                        </a>

                        <a 
                            href="https://github.com/sahiwl" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="brutal-border border-white bg-white text-black p-3 brutal-shadow-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group"
                        >
                            <FaGithub className='group-hover:scale-110 transition-transform' size={20} />
                        </a>

                        <a 
                            href="https://twitter.com/sahilwithocd" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="brutal-border border-white bg-white text-black p-3 brutal-shadow-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group"
                        >
                            <FaTwitter className='group-hover:scale-110 transition-transform' size={20} />
                        </a>
                        
                       
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="brutal-border-t border-white pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-black uppercase text-sm">
                        &copy; Sahil Kumar Ray 2024 All Rights Reserved
                    </p>
                  
                </div>
            </div>
        </footer>
    )
}

