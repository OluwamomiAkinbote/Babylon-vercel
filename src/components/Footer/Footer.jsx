import React from 'react';
import { API_URL } from '../config';

const Footer = () => {
    return (
        <footer className="bg-gray-200 text-gray-800 py-10 border-t font-futura">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <img
                            src={`${API_URL}/static/images/logoheader.png`}
                            alt="Scodynate Logo"
                            className="h-12 w-auto md:h-16 lg:h-20 object-contain mb-4"
                        />
                        <p className="text-sm text-gray-600">
                            Newstropy is your go-to source for updates in politics, sports, global news, and more.
                        </p>
                    </div>

                    {/* Highlights Section */}
                    <div>
                        <h3 className="text-green-600 font-semibold mb-4">Focus Areas</h3>
                        <p className="text-sm text-gray-600">
                            We deliver insightful coverage on key topics — from Nigeria to global happenings, sports, and business trends.
                        </p>
                    </div>

                    {/* Links + Social */}
                    <div>
                        <h3 className="text-green-600 font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 mb-6">
                            <li>
                                <a href="/privacy-policy" className="text-sm text-gray-600 hover:text-green-600">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="/" className="text-sm text-gray-600 hover:text-green-600">
                                    Home
                                </a>
                            </li>
                        </ul>

                        {/* Social Icons */}
                        <h4 className="text-gray-700 mb-3 font-medium">Follow Us</h4>
                        <div className="flex space-x-3">
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
                </div>

                {/* Footer Bottom */}
                <div className="mt-10 border-t border-gray-500 pt-4 text-center text-sm text-gray-500">
                    © 2024 - {new Date().getFullYear()} Newstropy. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
