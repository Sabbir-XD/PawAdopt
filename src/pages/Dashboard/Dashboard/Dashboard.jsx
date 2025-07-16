import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "@/components/StatCard/StatCard";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();

  // ✅ Get role-based stats
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard-stats?email=${user?.email}`);
      return res.data;
    },
  });

  // ✅ Admin: pets by category
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

  // ✅ Admin: adoption summary
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

  // ✅ User: donations by campaign
  const {
    data: myDonationBreakdown,
    isLoading: donationLoading,
  } = useQuery({
    queryKey: ["user-donations-breakdown", user?.email],
    enabled: stats.role === "user",
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/user-donations-breakdown?email=${user.email}`
      );
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading dashboard...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome to Dashboard</h1>

      {/* ✅ ADMIN STATS */}
      {stats.role === "admin" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.totalUsers} />
            <StatCard title="Total Pets" value={stats.totalPets} />
            <StatCard title="Total Campaigns" value={stats.totalCampaigns} />
            <StatCard title="Total Donations" value={`$${stats.totalDonationAmount}`} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Adoption Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Requests" value={adoptionSummary.total || 0} />
              <StatCard title="Pending" value={adoptionSummary.pending || 0} />
              <StatCard title="Accepted" value={adoptionSummary.accepted || 0} />
              <StatCard title="Rejected" value={adoptionSummary.rejected || 0} />
            </div>
          </div>

          {/* ✅ Admin Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Pets by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={petCategoryData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ✅ USER STATS */}
      {stats.role === "user" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <StatCard title="My Pets" value={stats.myPets} />
            <StatCard title="My Campaigns" value={stats.myCampaigns} />
            <StatCard title="My Donations" value={`$${stats.myDonations}`} />
          </div>

          {/* ✅ User Chart */}
          {donationLoading ? (
            <p className="text-center text-gray-500 mt-6">Loading chart...</p>
          ) : myDonationBreakdown?.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">My Donations by Campaign</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={myDonationBreakdown}>
                  <XAxis dataKey="campaign" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6">No donation data to display.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
