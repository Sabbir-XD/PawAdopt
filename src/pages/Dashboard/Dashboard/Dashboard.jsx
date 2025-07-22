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
} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaPaw } from "react-icons/fa";

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
};

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();

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
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400">
          Dashboard Overview
        </h1>
        <div className="text-sm text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
          {stats.role === "admin" ? "Administrator" : "User"} Dashboard
        </div>
      </div>

      {/* ADMIN STATS */}
      {stats.role === "admin" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<FiUsers className="text-teal-500" size={24} />}
              color="bg-teal-50 dark:bg-teal-900/20"
            />
            <StatCard
              title="Total Pets"
              value={stats.totalPets}
              icon={<FaPaw className="text-teal-500" size={24} />}
              color="bg-teal-50 dark:bg-teal-900/20"
            />
            <StatCard
              title="Total Campaigns"
              value={stats.totalCampaigns}
              icon={<FiActivity className="text-teal-500" size={24} />}
              color="bg-teal-50 dark:bg-teal-900/20"
            />
            <StatCard
              title="Total Donations"
              value={`$${stats.totalDonationAmount}`}
              icon={<FiDollarSign className="text-teal-500" size={24} />}
              color="bg-teal-50 dark:bg-teal-900/20"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300">
              Adoption Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Requests"
                value={adoptionSummary.total || 0}
                icon={<FiHeart className="text-teal-500" size={20} />}
                trend="up"
              />
              <StatCard
                title="Pending"
                value={adoptionSummary.pending || 0}
                icon={<FiClock className="text-amber-500" size={20} />}
                trend="neutral"
              />
              <StatCard
                title="Accepted"
                value={adoptionSummary.accepted || 0}
                icon={<FiCheckCircle className="text-green-500" size={20} />}
                trend="up"
              />
              <StatCard
                title="Rejected"
                value={adoptionSummary.rejected || 0}
                icon={<FiXCircle className="text-red-500" size={20} />}
                trend="down"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-teal-50 dark:border-teal-900/30">
              <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
                Pets by Category
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={petCategoryData}>
                  <XAxis
                    dataKey="category"
                    stroke="#64748b"
                    strokeWidth={0.5}
                  />
                  <YAxis stroke="#64748b" strokeWidth={0.5} />
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

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-teal-50 dark:border-teal-900/30">
              <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
                Adoption Status Distribution
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
                    <Cell fill={COLORS.teal[300]} />
                    <Cell fill={COLORS.teal[700]} />
                  </Pie>
                  <Legend />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="My Pets"
              value={stats.myPets}
              icon={<FaPaw className="text-teal-500" size={24} />}
              color="bg-teal-50 dark:bg-teal-900/20"
            />
            <StatCard
              title="My Campaigns"
              value={stats.myCampaigns}
              icon={<FiActivity className="text-teal-500" size={24} />}
              color="bg-teal-50 dark:bg-teal-900/20"
            />
            <StatCard
              title="My Donations"
              value={`$${stats.myDonations}`}
              icon={<FiDollarSign className="text-teal-500" size={24} />}
              color="bg-teal-50 dark:bg-teal-900/20"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-teal-50 dark:border-teal-900/30">
              <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
                My Adoption Requests
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {userAdoptionStats.total || 0}
                  </div>
                  <div className="text-sm text-teal-700 dark:text-teal-300">
                    Total
                  </div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {userAdoptionStats.pending || 0}
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Pending
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {userAdoptionStats.accepted || 0}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Accepted
                  </div>
                </div>
              </div>
            </div>

            {donationLoading ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-teal-50 dark:border-teal-900/30">
                <Skeleton height={300} />
              </div>
            ) : myDonationBreakdown?.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-teal-50 dark:border-teal-900/30">
                <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
                  My Donations by Campaign
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={myDonationBreakdown}>
                    <XAxis
                      dataKey="campaign"
                      stroke="#64748b"
                      strokeWidth={0.5}
                    />
                    <YAxis stroke="#64748b" strokeWidth={0.5} />
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
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-teal-50 dark:border-teal-900/30 flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  No donation data to display.
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
