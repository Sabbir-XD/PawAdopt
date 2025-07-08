import React, { Fragment, useState } from "react";
import { NavLink } from "react-router";
import { Menu, Transition } from "@headlessui/react";
import { FaChevronDown, FaPaw, FaBars, FaTimes } from "react-icons/fa";
import { HiOutlineHeart } from "react-icons/hi";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const Navbar = () => {
  const { user, handleLogoutUser } = UseAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Home", to: "/", icon: <FaPaw className="mr-2" /> },
    { name: "Pet Listing", to: "/pets", icon: <FaPaw className="mr-2" /> },
    {
      name: "Donation Campaigns",
      to: "/donate",
      icon: <HiOutlineHeart className="mr-2" />,
    },
  ];

  const baseLinkClass =
    "flex items-center px-3 py-2 rounded-md font-medium transition";
  const activeClass = "bg-teal-700 text-white";
  const inactiveClass = "text-white hover:text-teal-100 hover:bg-teal-700";

  return (
    <nav className="bg-teal-600 shadow-md sticky top-0 z-50">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Left: Logo & Mobile Toggle */}
          <div className="flex items-center">
            <button
              className="md:hidden text-white"
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
              className="flex items-center ml-4 md:ml-0 space-x-2"
            >
              <div className="relative">
                <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <FaPaw className="text-teal-600 text-xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-teal-300 rounded-full" />
              </div>
              <span className="text-white text-xl font-bold">
                <span className="text-teal-100">Paw</span>Adopt
              </span>
            </NavLink>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex space-x-6">
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
                  className="hidden sm:inline text-teal-100 hover:text-white transition font-medium"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="bg-teal-800 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center font-medium"
                >
                  <FaPaw className="mr-2" />
                  Login
                </NavLink>
              </>
            ) : (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center space-x-2 focus:outline-none group">
                  <div className="relative">
                    <img
                      src={user.photoURL || "https://github.com/shadcn.png"}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-teal-100 shadow-md bg-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-profile.png";
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-400 rounded-full border-2 border-white" />
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
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink
                            to="/dashboard"
                            className={`${
                              active
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700"
                            } block px-4 py-2 text-sm font-medium`}
                          >
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
                            } block w-full px-4 py-2 text-left text-sm font-medium`}
                          >
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
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="md:hidden bg-teal-700"
      >
        <div className="px-4 pt-4 pb-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-base font-medium ${
                  isActive
                    ? "bg-teal-800 text-white"
                    : "text-white hover:bg-teal-600"
                } flex items-center`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
          {!user && (
            <>
              <NavLink
                to="/login"
                className="block bg-teal-800 text-white px-3 py-2 rounded-md text-base font-medium flex items-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaPaw className="mr-2" />
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="block text-teal-100 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Account
              </NavLink>
            </>
          )}
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;
