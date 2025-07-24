import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import StatCard from "@/components/StatCard/StatCard";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import {
  FiUsers,
  FiDollarSign,
  FiHeart,
  FiHome,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCalendar,
  FiAward,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaPaw, FaDonate, FaHandHoldingHeart } from "react-icons/fa";
import { format, parseISO, subDays } from "date-fns";
import { motion } from "framer-motion";

const COLORS = {
  teal: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
  },
  indigo: {
    500: "#6366f1",
    600: "#4f46e5",
  },
  rose: {
    500: "#f43f5e",
  },
  amber: {
    500: "#f59e0b",
  },
};

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();
  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE, MMMM do yyyy");
  const formattedTime = format(currentDate, "h:mm a");

  // Get role-based stats
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard-stats?email=${user?.email}`
      );
      return res.data;
    },
  });

  // Admin: pets by category
  const { data: petCategoryData = [] } = useQuery({
    queryKey: ["pets-by-category"],
    enabled: stats.role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/pets-by-category", {
        headers: { email: user.email },
      });
      return res.data;
    },
  });

  // Admin: adoption summary
  const { data: adoptionSummary = {} } = useQuery({
    queryKey: ["adoption-summary"],
    enabled: stats.role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/adoption-summary", {
        headers: { email: user.email },
      });
      return res.data;
    },
  });

  // Admin: recent activities
  const { data: recentActivities = [] } = useQuery({
    queryKey: ["recent-activities"],
    enabled: stats.role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/recent-activities", {
        headers: { email: user.email },
      });
      return res.data.map((activity) => ({
        ...activity,
        timestamp: format(parseISO(activity.timestamp), "MMM dd, h:mm a"),
      }));
    },
  });

  // User: donations by campaign
  const { data: myDonationBreakdown, isLoading: donationLoading } = useQuery({
    queryKey: ["user-donations-breakdown", user?.email],
    enabled: stats.role === "user",
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/user-donations-breakdown?email=${user.email}`
      );
      return res.data;
    },
  });

  // User: adoption status breakdown
  const { data: userAdoptionStats = {} } = useQuery({
    queryKey: ["user-adoption-stats", user?.email],
    enabled: stats.role === "user",
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/user-adoption-stats?email=${user.email}`
      );
      return res.data;
    },
  });

  // User: donation history
  const { data: donationHistory = [] } = useQuery({
    queryKey: ["user-donation-history", user?.email],
    enabled: stats.role === "user",
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/user-donation-history?email=${user.email}`
      );
      return res.data.map((donation) => ({
        ...donation,
        date: format(parseISO(donation.date), "MMM dd"),
      }));
    },
  });

  console.log(donationHistory);

  // Generate sample data for the last 7 days
  const generateWeeklyData = () => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(currentDate, 6 - i);
      return {
        date: format(date, "EEE"),
        pets: Math.floor(Math.random() * 10) + 5,
        adoptions: Math.floor(Math.random() * 5) + 1,
      };
    });
  };

  const weeklyData = generateWeeklyData();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton height={40} width={200} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={120} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with Date/Time */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {formattedDate} • {formattedTime}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full flex items-center gap-2">
            <FiCalendar size={14} />
            {format(currentDate, "MMMM yyyy")}
          </div>
          <div className="text-sm text-white bg-gradient-to-r from-teal-500 to-indigo-500 px-3 py-1 rounded-full">
            {stats.role === "admin" ? "Administrator" : "User"} Dashboard
          </div>
        </div>
      </motion.div>

      {/* ADMIN STATS */}
      {stats.role === "admin" && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<FiUsers className="text-indigo-500" size={24} />}
              color="bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-indigo-900/20 dark:to-teal-900/20"
              trend="up"
              trendValue="12%"
            />
            <StatCard
              title="Total Pets"
              value={stats.totalPets}
              icon={<FaPaw className="text-teal-500" size={24} />}
              color="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20"
              trend="up"
              trendValue="8%"
            />
            <StatCard
              title="Total Campaigns"
              value={stats.totalCampaigns}
              icon={<FiActivity className="text-amber-500" size={24} />}
              color="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
              trend="neutral"
            />
            <StatCard
              title="Total Donations"
              value={`$${stats.totalDonationAmount?.toLocaleString() || 0}`}
              icon={<FiDollarSign className="text-emerald-500" size={24} />}
              color="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20"
              trend="up"
              trendValue="24%"
            />
          </motion.div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-2">
              <FiTrendingUp className="text-teal-500" />
              Adoption Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Requests"
                value={adoptionSummary.total || 0}
                icon={<FiHeart className="text-rose-500" size={20} />}
                trend="up"
                trendValue="15%"
                compact
              />
              <StatCard
                title="Pending"
                value={adoptionSummary.pending || 0}
                icon={<FiClock className="text-amber-500" size={20} />}
                trend="up"
                trendValue="5%"
                compact
              />
              <StatCard
                title="Accepted"
                value={adoptionSummary.accepted || 0}
                icon={<FiCheckCircle className="text-emerald-500" size={20} />}
                trend="up"
                trendValue="10%"
                compact
              />
              <StatCard
                title="Rejected"
                value={adoptionSummary.rejected || 0}
                icon={<FiXCircle className="text-rose-500" size={20} />}
                trend="down"
                trendValue="3%"
                compact
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300">
                  Weekly Activity
                </h2>
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300 rounded">
                    Pets
                  </button>
                  <button className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded">
                    Adoptions
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    strokeWidth={0.5}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    strokeWidth={0.5}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: COLORS.teal[700],
                      borderColor: COLORS.teal[600],
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pets"
                    stackId="1"
                    stroke={COLORS.teal[500]}
                    fill={COLORS.teal[100]}
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="adoptions"
                    stackId="2"
                    stroke={COLORS.indigo[500]}
                    fill={COLORS.indigo[100]}
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
                Recent Activities
              </h2>
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        index % 2 === 0
                          ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300"
                          : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
                      }`}
                    >
                      {activity.type === "donation" ? (
                        <FaDonate size={16} />
                      ) : activity.type === "adoption" ? (
                        <FaHandHoldingHeart size={16} />
                      ) : (
                        <FiAward size={16} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent activities
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
                Pets by Category
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={petCategoryData}>
                  <XAxis
                    dataKey="category"
                    stroke="#64748b"
                    strokeWidth={0.5}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    strokeWidth={0.5}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: COLORS.teal[700],
                      borderColor: COLORS.teal[600],
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={COLORS.teal[500]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
                Adoption Status
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Accepted",
                        value: adoptionSummary.accepted || 0,
                      },
                      {
                        name: "Pending",
                        value: adoptionSummary.pending || 0,
                      },
                      {
                        name: "Rejected",
                        value: adoptionSummary.rejected || 0,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    <Cell fill={COLORS.teal[500]} />
                    <Cell fill={COLORS.amber[500]} />
                    <Cell fill={COLORS.rose[500]} />
                  </Pie>
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                      paddingLeft: "20px",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: COLORS.teal[700],
                      borderColor: COLORS.teal[600],
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* USER STATS */}
      {stats.role === "user" && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <StatCard
              title="My Pets"
              value={stats.myPets}
              icon={<FaPaw className="text-teal-500" size={24} />}
              color="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20"
              trend="up"
              trendValue="2 new"
            />
            <StatCard
              title="My Campaigns"
              value={stats.myCampaigns}
              icon={<FiActivity className="text-indigo-500" size={24} />}
              color="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
              trend="neutral"
            />
            <StatCard
              title="My Donations"
              value={`$${stats.myDonations?.toLocaleString() || 0}`}
              icon={<FiDollarSign className="text-emerald-500" size={24} />}
              color="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
              trend="up"
              trendValue="15%"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
                My Adoption Requests
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {userAdoptionStats.totalAdoptions || 0}
                  </div>
                  <div className="text-sm text-teal-700 dark:text-teal-300">
                    Total
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {userAdoptionStats.pendingAdoptions || 0}
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Pending
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                    {userAdoptionStats.rejectedAdoptions || 0}
                  </div>
                  <div className="text-sm text-rose-700 dark:text-rose-300">
                    Rejected
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {userAdoptionStats.SuccessAdoptions || 0}
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300">
                    Accepted
                  </div>
                </div>
              </div>
            </div>

            {donationLoading ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Skeleton height={300} />
              </div>
            ) : myDonationBreakdown?.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
                  My Donations by Campaign
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={myDonationBreakdown}>
                    <XAxis
                      dataKey="campaign"
                      stroke="#64748b"
                      strokeWidth={0.5}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      strokeWidth={0.5}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: COLORS.teal[700],
                        borderColor: COLORS.teal[600],
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar
                      dataKey="total"
                      fill={COLORS.teal[500]}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center h-full">
                <FaDonate
                  className="text-gray-300 dark:text-gray-600 mb-2"
                  size={48}
                />
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No donation data available. <br />
                  Start donating to see your impact!
                </p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
              Recent Donations
            </h2>

            {donationHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-left">
                      <th className="p-3 text-sm font-medium">Campaign</th>
                      <th className="p-3 text-sm font-medium">Date</th>
                      <th className="p-3 text-sm font-medium">Image</th>
                      <th className="p-3 text-sm font-medium text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.slice(0, 5).map((donation, index) => (
                      <tr
                        key={index}
                        className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {/* Campaign Name */}
                        <td className="p-3 text-gray-800 dark:text-gray-200">
                          {donation.campaignTitle}
                        </td>

                        {/* Date */}
                        <td className="p-3 text-gray-600 dark:text-gray-400">
                          {donation.date}
                        </td>

                        {/* Image */}
                        <td className="p-3">
                          <img
                            src={donation?.campaignImageUrl}
                            alt="campaign"
                            className="w-12 h-12 object-cover rounded border border-gray-200 dark:border-gray-600"
                          />
                        </td>

                        {/* Amount */}
                        <td className="p-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                          ${donation.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <FiDollarSign
                  className="text-gray-300 dark:text-gray-600 mb-2"
                  size={48}
                />
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No donation history yet. <br />
                  Your generosity can make a difference!
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
