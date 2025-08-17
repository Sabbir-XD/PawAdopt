import React, { Fragment, useState, useEffect } from "react";
import { NavLink } from "react-router";
import { Menu, Transition } from "@headlessui/react";
import {
  FaChevronDown,
  FaPaw,
  FaBars,
  FaTimes,
  FaHome,
  FaDog,
  FaSignOutAlt,
} from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { motion, AnimatePresence } from "framer-motion";
import Dark from "@/components/Dark/Dark";

const Navbar = () => {
  const { user, handleLogoutUser } = UseAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const baseLinks = [
    { name: "Home", to: "/", icon: <FaHome className="mr-2" /> },
    {
      name: "Pet Listing",
      to: "/pet-listing",
      icon: <FaDog className="mr-2" />,
    },
    {
      name: "Donation Campaigns",
      to: "/donation-campaigns",
      icon: <GiCash className="mr-2" />,
    },
  ];

  const userLinks = user
    ? [
        { name: "Dashboard", to: "/dashboard", icon: <FaPaw className="mr-2" /> },
        {
          name: "Logout",
          to: "#",
          icon: <FaSignOutAlt className="mr-2" />,
          onClick: handleLogoutUser,
        },
      ]
    : [];

  const allLinks = [...baseLinks, ...userLinks];

  const baseLinkClass =
    "flex items-center py-2 px-3 rounded-lg font-medium transition-all duration-300";
  const activeClass = "bg-white/20 text-white shadow-lg dark:bg-white/30";
  const inactiveClass = "text-white/90 hover:text-white hover:bg-white/10 dark:hover:bg-white/20";

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-teal-700 to-cyan-700 shadow-xl dark:from-teal-800 dark:to-cyan-800"
          : "bg-gradient-to-r from-teal-700 to-cyan-700 dark:to-cyan-800"
      }`}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo & Mobile Toggle */}
          <div className="flex items-center">
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 dark:hover:bg-white/30"
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
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all dark:bg-gray-800">
                  <FaPaw className="text-teal-600 text-xl dark:text-teal-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-amber-400 rounded-full border-2 border-white dark:border-gray-800" />
              </motion.div>
              <span className="text-white text-xl font-bold hidden md:inline">
                <span className="text-amber-400 dark:text-amber-300">Paw</span>Adopt
              </span>
            </NavLink>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex space-x-1">
            {allLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={link.onClick}
                className={({ isActive }) =>
                  `${baseLinkClass} ${
                    isActive ? activeClass : inactiveClass
                  } ${link.onClick ? "cursor-pointer" : ""}`
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
            {/* Dark mode toggle */}
            <div className="flex items-center">
              <Dark />
            </div>
            
            {!user ? (
              <>
                <NavLink
                  to="/register"
                  className="hidden sm:inline-flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all dark:hover:bg-white/20"
                >
                  Register
                </NavLink>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink
                    to="/login"
                    className="bg-white text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg flex items-center font-bold shadow-md hover:shadow-lg transition-all dark:bg-gray-800 dark:text-teal-400 dark:hover:bg-gray-700"
                  >
                    <FaPaw className="mr-2" />
                    Login
                  </NavLink>
                </motion.div>
              </>
            ) : (
              <Menu as="div" className="relative md:hidden">
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
                          className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-md bg-gray-200 dark:border-gray-700"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-profile.png";
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-400 rounded-full border-2 border-white dark:border-gray-800" />
                      </motion.div>
                    </Menu.Button>
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
            className="md:hidden bg-gradient-to-b from-teal-700 to-cyan-700 shadow-xl overflow-hidden dark:from-teal-800 dark:to-cyan-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {allLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {link.onClick ? (
                    <button
                      onClick={() => {
                        link.onClick();
                        setMobileMenuOpen(false);
                      }}
                      className={`block w-full rounded-xl px-4 py-3 text-lg font-medium ${inactiveClass} flex items-center`}
                    >
                      {link.icon}
                      {link.name}
                    </button>
                  ) : (
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-lg font-medium ${
                          isActive
                            ? "bg-white/20 text-white shadow-md dark:bg-white/30"
                            : "text-white/90 hover:text-white hover:bg-white/10 dark:hover:bg-white/20"
                        } flex items-center`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.name}
                    </NavLink>
                  )}
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
                      className="block bg-white text-teal-600 px-4 py-3 rounded-xl text-lg font-bold flex items-center justify-center shadow-md dark:bg-gray-800 dark:text-teal-400"
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
                      className="block text-white px-4 py-3 rounded-xl text-lg font-medium text-center hover:bg-white/10 dark:hover:bg-white/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Account
                    </NavLink>
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