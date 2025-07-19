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
  Settings,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { Badge } from "@/components/ui/badge";
import { ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { CardSkeleton } from "@/components/Loading/Loading";
import Dark from "@/components/Dark/Dark";

const userNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Add a Pet", href: "/dashboard/add-pet", icon: PlusCircle },
  { name: "My Pets", href: "/dashboard/my-pets", icon: PawPrint },
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

const adminExtraItems = [
  { name: "All Users", href: "/dashboard/all-users", icon: User },
  { name: "Manage Pets", href: "/dashboard/manage-pets", icon: PawPrint },
  {
    name: "Manage Donations",
    href: "/dashboard/manage-donations",
    icon: HandCoins,
  },
];

const DashboardLayout = () => {
  const { user, handleLogoutUser } = UseAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

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

  // Fetch user data
  const { data: dbUser = {}, isLoading } = useQuery({
    enabled: !!user?.email,
    queryKey: ["dashboardUser", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Fetch notifications count
  useQuery({
    enabled: !!user?.email,
    queryKey: ["notifications", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/notifications/unread-count?user=${user.email}`
      );
      setUnreadNotifications(res.data.count);
      return res.data;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return <CardSkeleton count={1} />;
  }

  const combinedNavItems =
    dbUser?.role === "admin"
      ? [...userNavItems, ...adminExtraItems]
      : userNavItems;

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
    >
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
        <div className="flex flex-col w-64 border-r bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center space-x-2">
              <PawPrint className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                PetAdopt
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="rounded-full hover:bg-teal-50 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {combinedNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-teal-600 dark:bg-teal-700 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 hover:text-teal-700 dark:hover:text-teal-400"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      location.pathname === item.href
                        ? "text-white"
                        : "text-teal-500 dark:text-teal-400"
                    )}
                  />
                  {item.name}
                  {item.badge && unreadNotifications > 0 && (
                    <Badge className="ml-auto bg-rose-500 dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-700">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-teal-50 dark:bg-gray-700">
              <Avatar className="h-10 w-10 border-2 border-teal-200 dark:border-teal-700">
                {dbUser?.photoURL ? (
                  <AvatarImage src={dbUser.photoURL} />
                ) : (
                  <AvatarFallback className="bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300">
                    {dbUser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {dbUser?.name || "User"}
                </p>
                <p className="text-xs text-teal-600 dark:text-teal-400 truncate">
                  {dbUser?.email || "user@example.com"}
                </p>
              </div>
              {/* dark mode */}
              <div>
                <Dark />
              </div>
            </div>
          </div>
        </div>
      </Transition>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center h-16 px-4 border-b dark:border-gray-700">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <PawPrint className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                PetAdopt
              </span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-2">
              {combinedNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-teal-600 dark:bg-teal-700 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 hover:text-teal-700 dark:hover:text-teal-400"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      location.pathname === item.href
                        ? "text-white"
                        : "text-teal-500 dark:text-teal-400"
                    )}
                  />
                  {item.name}
                  {item.badge && unreadNotifications > 0 && (
                    <Badge className="ml-auto bg-rose-500 dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-700">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-teal-50 dark:bg-gray-700">
              <Avatar className="h-10 w-10 border-2 border-teal-200 dark:border-teal-700">
                {dbUser?.photoURL ? (
                  <AvatarImage src={dbUser.photoURL} />
                ) : (
                  <AvatarFallback className="bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300">
                    {dbUser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {dbUser?.name || "User"}
                </p>
                <p className="text-xs text-teal-600 dark:text-teal-400 truncate">
                  {dbUser?.email || "user@example.com"}
                </p>
              </div>
              {/* dark mode */}
              <div>
                <Dark />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="flex items-center h-16 px-4 border-b bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-teal-50 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm ml-4">
            <Link
              to="/"
              className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <span className="text-gray-400 dark:text-gray-500">/</span>
            <span className="text-gray-600 dark:text-gray-300">
              {combinedNavItems.find((item) => item.href === location.pathname)
                ?.name || "Dashboard"}
            </span>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center space-x-4">
            {/* dark mode */}
            <div>
              <Dark />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative hover:bg-teal-50 dark:hover:bg-gray-700"
              onClick={() => navigate("/dashboard/notifications")}
            >
              <Bell className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 focus:outline-none group">
                <Avatar className="h-8 w-8 border-2 border-teal-200 dark:border-teal-700 group-hover:border-teal-300 dark:group-hover:border-teal-500 transition-colors">
                  {dbUser?.photoURL ? (
                    <AvatarImage src={dbUser.photoURL} />
                  ) : (
                    <AvatarFallback className="bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300">
                      {dbUser?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                {!isMobile && (
                  <div className="text-left">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {dbUser?.name || "User"}
                      </p>
                      <ChevronDown className="ml-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-xs text-teal-600 dark:text-teal-400 capitalize">
                      {dbUser?.role || "Member"}
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
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 z-50">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {dbUser?.name || "User"}
                    </p>
                    <p className="text-xs text-teal-600 dark:text-teal-400 truncate">
                      {dbUser?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard/profile"
                          className={cn(
                            active
                              ? "bg-teal-50 text-teal-700 dark:bg-gray-700 dark:text-teal-400"
                              : "text-gray-700 dark:text-gray-300",
                            "block px-4 py-2 text-sm flex items-center"
                          )}
                        >
                          <User className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
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
                              ? "bg-teal-50 text-teal-700 dark:bg-gray-700 dark:text-teal-400"
                              : "text-gray-700 dark:text-gray-300",
                            "block px-4 py-2 text-sm flex items-center"
                          )}
                        >
                          <Settings className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
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
                              ? "bg-teal-50 text-rose-600 dark:bg-gray-700 dark:text-rose-400"
                              : "text-gray-700 dark:text-gray-300",
                            "block w-full text-left px-4 py-2 text-sm flex items-center"
                          )}
                        >
                          <LogOut className="h-4 w-4 mr-2 text-rose-500 dark:text-rose-400" />
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
        <div className="flex-1 overflow-auto p-2 md:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="w-full mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
