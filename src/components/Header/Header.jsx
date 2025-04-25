import { useEffect, useState } from "react";
import axios from "axios";
import { FaBars, FaTimes, FaSearch, FaUser, FaUserPlus } from "react-icons/fa";
import StoryView from "./Story/StoryView";
import { API_URL } from "../config";

const Header = () => {
  const [navbarCategories, setNavbarCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const categoryLimit = 5;

  useEffect(() => {
    axios
      .get(`${API_URL}/header`)
      .then((response) => setNavbarCategories(response.data.navbar_categories))
      .catch((error) => console.error("Error fetching header data:", error));
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white border-b border-green-600 shadow-sm z-50 font-robotoCondensed">
        <div className="container mx-auto flex justify-between items-center p-4 md:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <img
                src={`${API_URL}/static/images/logoheader.png`}
                alt="Newstropy Logo"
                className="h-10"
              />
            </a>

            {/* Auth Centered */}
            <div className="flex flex-col items-center justify-center flex-grow">
              <div className="flex space-x-3">
                <a href="/signin" className="flex flex-col items-center text-green-600">
                  <FaUser size={20} />
                  <span className="text-xs text-gray-700">Sign In</span>
                </a>
                <a href="/register" className="flex flex-col items-center text-green-600">
                  <FaUserPlus size={20} />
                  <span className="text-xs text-gray-700">Register</span>
                </a>
              </div>
            </div>

            {/* Search & Menu */}
            <div className="flex space-x-4 items-center">
              <button className="text-green-600">
                <FaSearch size={20} />
              </button>
              <button className="text-green-600" onClick={() => setMenuOpen(!menuOpen)}>
                <FaBars size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center px-4 py-2">
          {/* Logo */}
          <a href="/">
            <img
              src={`${API_URL}/static/images/logoheader.png`}
              alt="Newstropy Logo"
              className="h-12"
            />
          </a>

          {/* Categories */}
          <nav className="flex items-center space-x-6 uppercase font-bold text-sm">
            {navbarCategories.slice(0, categoryLimit).map((category, index) => (
              <a
                key={index}
                href={`/category/${category.toLowerCase()}`}
                className="text-gray-800 hover:underline"
              >
                {category}
              </a>
            ))}
            {navbarCategories.length > categoryLimit && (
              <div className="relative group">
                <button className="text-gray-800 hover:underline">More</button>
                <div className="absolute left-0 bg-white border mt-2 shadow-lg rounded hidden group-hover:block">
                  {navbarCategories.slice(categoryLimit).map((category, index) => (
                    <a
                      key={index}
                      href={`/category/${category.toLowerCase()}`}
                      className="block px-4 py-2 text-green-600 hover:bg-gray-100"
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center">
              <a href="/signin" className="text-green-600">
                <FaUser size={24} />
              </a>
              <p className="text-gray-800 text-sm">Sign In</p>
            </div>
            <div className="flex flex-col items-center">
              <a href="/register" className="text-green-600">
                <FaUserPlus size={24} />
              </a>
              <p className="text-gray-800 text-sm">Register</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-1 space-x-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent focus:outline-none text-gray-800"
            />
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50">
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => setMenuOpen(false)}
            >
              <FaTimes size={30} />
            </button>

            {/* Auth Buttons in Mobile Menu */}
            <div className="sm: hidden flex space-x-6 mt-6">
              <div className="flex flex-col items-center">
                <a href="/signin" className="text-white">
                  <FaUser size={30} />
                </a>
                <p className="text-white text-sm mt-2">Sign In</p>
              </div>
              <div className="flex flex-col items-center">
                <a href="/register" className="text-white">
                  <FaUserPlus size={30} />
                </a>
                <p className="text-white text-sm mt-2">Register</p>
              </div>
            </div>

            {/* Navigation Links */}
            <ul className="space-y-4 text-lg font-semibold mt-10">
              {navbarCategories.map((category, index) => (
                <li key={index}>
                  <a
                    href={`/category/${category.toLowerCase()}`}
                    className="hover:underline"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Stories */}
      <StoryView />
    </>
  );
};

export default Header;
