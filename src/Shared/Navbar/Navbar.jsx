import React, { Fragment, useState, useEffect } from "react";
import { NavLink } from "react-router";
import { Menu, Transition } from "@headlessui/react";
import {
  FaChevronDown,
  FaPaw,
  FaBars,
  FaTimes,
  FaHeart,
  FaHome,
  FaDog,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, handleLogoutUser } = UseAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  console.log(user);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const links = [
    { name: "Home", to: "/", icon: <FaHome className="mr-2" /> },
    { name: "Pet Listing", to: "/pet-listing", icon: <FaDog className="mr-2" /> },
    {
      name: "Donation Campaigns",
      to: "/donate",
      icon: <GiCash className="mr-2" />,
    },
    // {
    //   name: "Favorites",
    //   to: "/favorites",
    //   icon: <FaHeart className="mr-2" />,
    // },
  ];

  const baseLinkClass =
    "flex items-center py-2 px-3 rounded-lg font-medium transition-all duration-300";
  const activeClass = "bg-white/20 text-white shadow-lg";
  const inactiveClass = "text-white/90 hover:text-white hover:bg-white/10";

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-teal-700 to-cyan-700 shadow-xl"
          : "bg-gradient-to-r from-teal-600 to-cyan-600"
      }`}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo & Mobile Toggle */}
          <div className="flex items-center">
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
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
              aria-label="Home"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                  <FaPaw className="text-teal-600 text-xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-amber-400 rounded-full border-2 border-white" />
              </motion.div>
              <span className="text-white text-xl font-bold hidden md:inline">
                <span className="text-amber-300">Paw</span>Adopt
              </span>
            </NavLink>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex space-x-1">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
                }
                aria-label={link.name}
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!user ? (
              <>
                <NavLink
                  to="/register"
                  className="hidden sm:inline-flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all"
                >
                  Register
                </NavLink>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink
                    to="/login"
                    className="bg-white text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg flex items-center font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <FaPaw className="mr-2" />
                    Login
                  </NavLink>
                </motion.div>
              </>
            ) : (
              <Menu as="div" className="relative inline-block text-left">
                {({ open }) => (
                  <>
                    <Menu.Button className="flex items-center space-x-2 focus:outline-none group">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
                      <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaChevronDown className="w-4 h-4 text-white/80 group-hover:text-white transition" />
                      </motion.div>
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
                                <FaSignOutAlt className="mr-2 text-teal-600" />
                                Logout
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gradient-to-b from-teal-700 to-cyan-700 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {links.map((link) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <NavLink
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
                </motion.div>
              ))}
              {!user && (
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <NavLink
                      to="/login"
                      className="block bg-white text-teal-600 px-4 py-3 rounded-xl text-lg font-bold flex items-center justify-center shadow-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaPaw className="mr-2" />
                      Login
                    </NavLink>
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <NavLink
                      to="/register"
                      className="block text-white px-4 py-3 rounded-xl text-lg font-medium text-center hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Account
                    </NavLink>
                  </motion.div>
                </div>
              )}
              {user && (
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <NavLink
                      to="/dashboard"
                      className="block text-white px-4 py-3 rounded-xl text-lg font-medium flex items-center hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaPaw className="mr-2" />
                      Dashboard
                    </NavLink>
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <button
                      onClick={() => {
                        handleLogoutUser();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-white px-4 py-3 rounded-xl text-lg font-medium text-left flex items-center hover:bg-white/10"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
