import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FaChevronDown, FaPaw, FaBars, FaTimes } from "react-icons/fa";
import { HiOutlineHeart } from "react-icons/hi";

const Navbar = ({ user,onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const user = {
//     name: "Sabbir Islam",
//     photoURL: "https://randomuser.me/api/portraits/men/32.jpg",
//   };

  const links = [
    { name: "Home", href: "/", icon: <FaPaw className="mr-2" /> },
    { name: "Pet Listing", href: "/pets", icon: <FaPaw className="mr-2" /> },
    {
      name: "Donation Campaigns",
      href: "/donate",
      icon: <HiOutlineHeart className="mr-2" />,
    },
  ];

  return (
    <nav className="bg-teal-600 shadow-lg sticky top-0 z-50">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <a href="/" className="flex items-center space-x-2 ml-4 md:ml-0">
              <div className="relative">
                <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <FaPaw className="h-6 w-6 text-teal-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-teal-300 rounded-full"></div>
              </div>
              <span className="text-white font-bold text-xl select-none">
                <span className="text-teal-100">Paw</span>Adopt
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white hover:text-teal-100 transition-colors duration-200 font-medium flex items-center px-3 py-2 rounded-md hover:bg-teal-700"
              >
                {link.icon}
                {link.name}
              </a>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <a
                  href="/register"
                  className="hidden sm:inline text-teal-100 hover:text-white font-medium transition"
                >
                  Register
                </a>
                <a
                  href="/login"
                  className="bg-teal-800 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium transition flex items-center"
                >
                  <FaPaw className="mr-2" />
                  Login
                </a>
              </>
            )}

            {user && (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center space-x-2 focus:outline-none group">
                  <div className="relative">
                    <img
                      src={user.photoURL || "/default-profile.png"}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-teal-100 shadow-md group-hover:border-teal-300 transition bg-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-profile.png";
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-teal-100"></div>
                  </div>
                  <FaChevronDown className="w-4 h-4 text-teal-100 group-hover:text-white transition" />
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
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <Menu.Item>
                        {({ isActive }) => (
                          <a
                            href="/dashboard"
                            className={`${
                              isActive
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700"
                            } block px-4 py-2 text-sm font-medium flex items-center`}
                          >
                            <HiOutlineHeart className="mr-2 text-teal-600" />
                            Dashboard
                          </a>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-100"></div>
                      <Menu.Item>
                        {({ isActive }) => (
                          <button
                            onClick={onLogout}
                            className={`${
                              isActive
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700"
                            } block w-full text-left px-4 py-2 text-sm font-medium flex items-center`}
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

      {/* Mobile menu */}
      <Transition
        show={mobileMenuOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="md:hidden bg-teal-700"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white hover:bg-teal-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.icon}
              {link.name}
            </a>
          ))}
          {!user && (
            <>
              <a
                href="/login"
                className="bg-teal-800 text-white block px-3 py-2 rounded-md text-base font-medium flex items-center mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaPaw className="mr-2" />
                Login
              </a>
              <a
                href="/register"
                className="text-teal-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Account
              </a>
            </>
          )}
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;
