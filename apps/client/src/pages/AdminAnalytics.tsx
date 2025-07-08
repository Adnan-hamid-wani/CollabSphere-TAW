import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Navbar from "../components/Navbar";

const COLORS = ["blue", "green", "red"];

function AdminAnalytics() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [average, setAverage] = useState<number | null>(null);

  // 🔒 Role check
  useEffect(() => {
    if (!user) return;
    if (user.role !== "ADMIN") {
      navigate("/");
    }
  }, [user]);

  // 📊 Fetch analytics data
  useEffect(() => {
    API.get("/admin-analytics")
      .then((res) => {
        setData(res.data);
        setAverage(res.data.averageCompletionHours); // ✅ use the combined data
      })
      .catch((err) => {
        console.error("Analytics API failed", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!user) return <div className="p-6">🔄 Loading user info...</div>;
  if (user.role !== "ADMIN") return null;
  if (loading) return <div className="p-6">📊 Loading analytics...</div>;
  if (!data)
    return <div className="p-6 text-red-600">❌ Failed to load analytics.</div>;

  const pieData = data.statusCounts.map((item: any) => ({
    name: item.status,
  value: item.count, // ✅
  }));

  return (
    <div className="p-6 space-y-10 min-h-screen bg-gradient-to-br from-blue-100 to-white">
  
  <Navbar/>
  <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-lg mb-6">
    📊 Admin Task Analytics
  </h1>

  {/* 📊 Graphs side by side */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* 📅 Task Trends */}
    <div className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-2xl p-4 shadow-xl">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">📅 Task Trends</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data.tasksOverTime}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="todo" stroke="#8884d8" />
          <Line type="monotone" dataKey="pending" stroke="#facc15" />
          <Line type="monotone" dataKey="completed" stroke="#34d399" />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* 🥧 Task Status Pie with Side Legend */}
<div className="flex flex-col lg:flex-row justify-between gap-4 bg-white/30 backdrop-blur-lg border border-white/30 rounded-2xl p-4 shadow-xl">
  <div className="flex-1">
    <h2 className="text-lg font-semibold text-gray-700 mb-2">🥧 Status Distribution</h2>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label
        >
          {pieData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* 🔵 Custom Side Legend */}
  <div className="flex flex-col justify-center gap-2 pr-4">
    {pieData.map((item, i) => (
      <div key={item.name} className="flex items-center gap-2 text-sm font-medium text-gray-800">
        <span
          className="w-4 h-4 rounded-sm"
          style={{ backgroundColor: COLORS[i % COLORS.length] }}
        />
        {item.name}: {item.value}
      </div>
    ))}
  </div>
</div>


    {/* 🏆 Performance */}
    <div className=" bg-white/30 backdrop-blur-lg border border-white/30 rounded-2xl p-4 shadow-xl">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        🏆 User-wise Completion
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data.performance}>
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completed" fill="violet" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-xl p-5 shadow-lg text-center ">
    <h3 className="text-lg font-semibold text-gray-700 mt-20">
      ⏱ Average Completion Time
    </h3>
    <p className="text-3xl font-bold text-indigo-700">
      {data.averageCompletionHours} hrs ({data.averageCompletionMinutes} mins)
    </p>
  </div>
  </div>

 

  {/* 📦 Summary Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[
      { label: "📌 Total Tasks", value: data.totalTasks, color: "text-blue-600" },
      { label: "✅ Completion Rate", value: `${data.completionRate}%`, color: "text-green-600" },
      { label: "🕓 Pending Approvals", value: data.pendingApprovals, color: "text-yellow-600" },
      { label: "📝 TODO Tasks", value: data.todoTasks, color: "text-gray-700" },
      { label: "🚧 In Progress", value: data.inProgressTasks, color: "text-orange-500" },
      { label: "👤 Total Users", value: data.totalUsers, color: "text-purple-600" },
      { label: "🟢 Active Users", value: data.activeUsers, color: "text-emerald-600" },
      { label: "⏱ Avg Completion", value: `${data.averageCompletionHours} hrs`, color: "text-indigo-600" },
    ].map((card, i) => (
      <div
        key={i}
        className="bg-white/30 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-lg text-center transition transform hover:scale-105 hover:shadow-xl"
      >
        <h3 className="text-sm text-gray-600">{card.label}</h3>
        <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
      </div>
    ))}
  </div>
</div>

   


  );
}

export default AdminAnalytics;
