import React from 'react';
import { API_URL } from '../config';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 border-t font-futura">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center space-y-4">
                    {/* Logo and Small Text */}
                    <img
                        src={`${API_URL}/static/images/logoheader.png`}
                        alt="Scodynate Logo"
                        className="h-12 w-auto object-contain"
                    />
                    <p className="text-xs text-gray-400 text-center max-w-xs">
                        Newstropy brings you updates on politics, sports, global news, and more.
                    </p>

                    {/* Privacy Policy */}
                    <a
                        href="/privacy-policy"
                        className="text-xs text-gray-400 hover:text-green-400 mt-2"
                    >
                        Privacy Policy
                    </a>

                    {/* Social Links */}
                    <div className="flex space-x-4 mt-4">
                        <a
                            href="https://www.facebook.com/profile.php?id=61566210926783"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-green-500 w-8 h-8 flex items-center justify-center hover:bg-green-600 transition"
                        >
                            <i className="fab fa-facebook-f text-white text-sm"></i>
                        </a>
                        <a
                            href="https://x.com/ScodynateNews"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-green-500 w-8 h-8 flex items-center justify-center hover:bg-green-600 transition"
                        >
                            <i className="fab fa-x-twitter text-white text-sm"></i>
                        </a>
                        <a
                            href="mailto:newsscodynate@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-green-500 w-8 h-8 flex items-center justify-center hover:bg-green-600 transition"
                        >
                            <i className="fas fa-envelope text-white text-sm"></i>
                        </a>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
                    © 2024 - {new Date().getFullYear()} Newstropy. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
