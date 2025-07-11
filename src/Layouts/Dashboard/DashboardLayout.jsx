import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useMediaQuery } from "react-responsive";
import { Menu, Transition } from "@headlessui/react";
import {
  LayoutDashboard,
  PawPrint,
  HeartHandshake,
  HandCoins,
  ListChecks,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  PlusCircle,
  Home,
  Bell,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { Badge } from "@/components/ui/badge";
import { ToastContainer } from "react-toastify";




const DashboardLayout = () => {
  const { user, handleLogoutUser } = UseAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock data
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Add a Pet",
      href: "/dashboard/add-pet",
      icon: PlusCircle,
    },
    {
      name: "My Pets",
      href: "/dashboard/my-pets",
      icon: PawPrint,
    },
    {
      name: "Adoption Requests",
      href: "/dashboard/adoption-requests",
      icon: HeartHandshake,
      badge: true,
    },
    {
      name: "Create Donation",
      href: "/dashboard/create-donation",
      icon: HandCoins,
    },
    {
      name: "My Donations",
      href: "/dashboard/my-donations",
      icon: ListChecks,
    },
  ];
  

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-teal-50">
      <ToastContainer position="top-right" autoClose={1000} />
      {/* Mobile sidebar */}
      <Transition
        show={sidebarOpen}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
        className="fixed inset-y-0 z-50 flex w-64 md:hidden"
      >
        <div className="flex flex-col w-64 border-r bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <PawPrint className="h-6 w-6 text-teal-600" />
              <span className="text-xl font-bold text-teal-600">PetAdopt</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="rounded-full hover:bg-teal-50"
            >
              <X className="h-5 w-5 text-teal-600" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-teal-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-teal-100 hover:text-teal-700"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      location.pathname === item.href
                        ? "text-white"
                        : "text-teal-500"
                    )}
                  />
                  {item.name}
                  {item.badge && (
                    <Badge className="ml-auto bg-rose-500 hover:bg-rose-600">
                      3
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-teal-50">
              <Avatar className="h-10 w-10 border-2 border-teal-200">
                {user?.avatar_url ? (
                  <AvatarImage src={user.avatar_url} />
                ) : (
                  <AvatarFallback className="bg-teal-100 text-teal-600">
                    {user?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name || "User"}
                </p>
                <p className="text-xs text-teal-600 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogoutUser}
                className="text-gray-500 hover:text-rose-500 rounded-full"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Transition>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r bg-white shadow-sm">
          <div className="flex items-center h-16 px-4 border-b">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <PawPrint className="h-6 w-6 text-teal-600" />
              <span className="text-xl font-bold text-teal-600">PetAdopt</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-teal-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-teal-100 hover:text-teal-700"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      location.pathname === item.href
                        ? "text-white"
                        : "text-teal-500"
                    )}
                  />
                  {item.name}
                  {item.badge && (
                    <Badge className="ml-auto bg-rose-500 hover:bg-rose-600">
                      3
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-teal-50">
              <Avatar className="h-10 w-10 border-2 border-teal-200">
                {user?.avatar_url ? (
                  <AvatarImage src={user.avatar_url} />
                ) : (
                  <AvatarFallback className="bg-teal-100 text-teal-600">
                    <img src={user?.photoURL || "U"} alt="" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name || "User"}
                </p>
                <p className="text-xs text-teal-600 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogoutUser}
                className="text-gray-500 hover:text-rose-500 rounded-full"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="flex items-center h-16 px-4 border-b bg-white shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-teal-50"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-5 w-5 text-teal-600" />
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm ml-4">
            <Link
              to="/"
              className="text-teal-600 hover:text-teal-800 flex items-center"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">
              {navItems.find((item) => item.href === location.pathname)?.name ||
                "Dashboard"}
            </span>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative hover:bg-teal-50"
              onClick={() => navigate("/dashboard/notifications")}
            >
              <Bell className="h-5 w-5 text-teal-600" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-teal-50"
              onClick={() => navigate("/help-center")}
              title="Help Center"
            >
              <HelpCircle className="h-5 w-5 text-teal-600" />
            </Button>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                <Avatar className="h-8 w-8 border-2 border-teal-200">
                  {user?.avatar_url ? (
                    <AvatarImage src={user.avatar_url} />
                  ) : (
                    <AvatarFallback className="bg-teal-100 text-teal-600">
                      <img src={user?.photoURL || "U"} alt="" />
                    </AvatarFallback>
                  )}
                </Avatar>
                {!isMobile && (
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.full_name || "User"}
                    </p>
                    <p className="text-xs text-teal-600">
                      {user?.role || "Member"}
                    </p>
                  </div>
                )}
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 z-50">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.full_name || "User"}
                    </p>
                    <p className="text-xs text-teal-600 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard/profile"
                          className={cn(
                            active
                              ? "bg-teal-50 text-teal-700"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm flex items-center"
                          )}
                        >
                          <User className="h-4 w-4 mr-2 text-teal-600" />
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard/settings"
                          className={cn(
                            active
                              ? "bg-teal-50 text-teal-700"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm flex items-center"
                          )}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-teal-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogoutUser}
                          className={cn(
                            active
                              ? "bg-teal-50 text-rose-600"
                              : "text-gray-700",
                            "block w-full text-left px-4 py-2 text-sm flex items-center"
                          )}
                        >
                          <LogOut className="h-4 w-4 mr-2 text-rose-500" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto p-2 md:p-6 bg-gradient-to-b from-teal-50 to-white">
          <div className="w-full mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
