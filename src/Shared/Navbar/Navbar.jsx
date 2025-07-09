import React, { Fragment, useState } from "react";
import { NavLink } from "react-router";
import { Menu, Transition } from "@headlessui/react";
import { FaChevronDown, FaPaw, FaBars, FaTimes, FaHeart, FaHome, FaDog } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { motion } from "framer-motion";


const Navbar = () => {
  const { user, handleLogoutUser } = UseAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Home", to: "/", icon: <FaHome className="mr-2" /> },
    { name: "Pet Listing", to: "/pets", icon: <FaDog className="mr-2" /> },
    {
      name: "Donation Campaigns",
      to: "/donate",
      icon: <GiCash className="mr-2" />,
    },
    {
      name: "Success Stories",
      to: "/success",
      icon: <FaHeart className="mr-2" />,
    },
  ];

  const baseLinkClass =
    "flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300";
  const activeClass = "bg-white/20 text-white shadow-lg";
  const inactiveClass = "text-white/90 hover:text-white hover:bg-white/10";

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-cyan-600 shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Left: Logo & Mobile Toggle */}
          <div className="flex items-center">
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/20 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
            <NavLink
              to="/"
              className="flex items-center ml-4 md:ml-0 space-x-2 group"
            >
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="relative"
              >
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                  <FaPaw className="text-teal-600 text-2xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full border-2 border-white" />
              </motion.div>
              <span className="text-white text-2xl font-bold">
                <span className="text-yellow-300">Paw</span>Adopt
              </span>
            </NavLink>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex space-x-2">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <NavLink
                  to="/register"
                  className="hidden sm:inline text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="bg-white text-teal-600 hover:bg-teal-50 px-6 py-2 rounded-lg flex items-center font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <FaPaw className="mr-2" />
                  Login
                </NavLink>
              </>
            ) : (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center space-x-2 focus:outline-none group">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <img
                      src={user.photoURL || "https://github.com/shadcn.png"}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-md bg-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-profile.png";
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-400 rounded-full border-2 border-white" />
                  </motion.div>
                  <FaChevronDown className="w-4 h-4 text-white/80 group-hover:text-white transition" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50 focus:outline-none overflow-hidden">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-teal-600">Signed in as</p>
                        <p className="text-sm truncate text-gray-700">{user.email}</p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink
                            to="/dashboard"
                            className={`${
                              active
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700"
                            } block px-4 py-3 text-sm font-medium flex items-center`}
                          >
                            <FaPaw className="mr-2 text-teal-600" />
                            Dashboard
                          </NavLink>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink
                            to="/profile"
                            className={`${
                              active
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700"
                            } block px-4 py-3 text-sm font-medium flex items-center`}
                          >
                            <FaPaw className="mr-2 text-teal-600" />
                            My Profile
                          </NavLink>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-100"></div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogoutUser}
                            className={`${
                              active
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700"
                            } block w-full px-4 py-3 text-left text-sm font-medium flex items-center`}
                          >
                            <FaPaw className="mr-2 text-teal-600" />
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={mobileMenuOpen}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 -translate-y-4"
        enterTo="transform opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 translate-y-0"
        leaveTo="transform opacity-0 -translate-y-4"
        className="md:hidden bg-gradient-to-b from-teal-700 to-cyan-700 shadow-xl"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-lg font-medium ${
                  isActive
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                } flex items-center`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
          {!user && (
            <div className="pt-4 border-t border-white/20 space-y-2">
              <NavLink
                to="/login"
                className="block bg-white text-teal-600 px-4 py-3 rounded-xl text-lg font-bold flex items-center justify-center shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaPaw className="mr-2" />
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="block text-white px-4 py-3 rounded-xl text-lg font-medium text-center hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Account
              </NavLink>
            </div>
          )}
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;