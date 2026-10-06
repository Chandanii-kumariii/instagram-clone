"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, CreditCard, Activity, Search, Trash2, LayoutDashboard, Database, ShieldAlert, LogOut } from "lucide-react";
import axiosInstance from "@/lib/axios";
import useAuthStore from "@/store/authStore";

export default function AdminDashboard() {
  const { user, logout } = useAuthStore() as any;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  
  // Users Table State
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Audit Logs State
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // If not logged in or not admin, redirect
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "Admin") {
      router.push("/");
      return;
    }

    fetchStats();
    fetchAuditLogs();
  }, [user, router]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, page, search, filterPlan]);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/stats");
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`/api/admin/users?page=${page}&limit=10&search=${search}&plan=${filterPlan}`);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/audit-logs");
      setLogs(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`);
      fetchUsers();
      fetchStats();
      fetchAuditLogs();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  if (!user || user.role !== "Admin") return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-blue-500" /> Admin Panel
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
          >
            <Users size={18} /> Manage Users
          </button>
          <button 
            onClick={() => setActiveTab("logs")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'logs' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
          >
            <Database size={18} /> Audit Logs
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => { logout(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-8">
          <h2 className="text-lg font-semibold capitalize">{activeTab.replace("-", " ")}</h2>
        </header>

        <main className="p-8">
          {activeTab === "overview" && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center"><Users size={24} /></div>
                  <div><p className="text-gray-500 text-sm">Total Users</p><p className="text-2xl font-bold">{stats.totalUsers}</p></div>
                </div>
                <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 flex items-center justify-center"><Activity size={24} /></div>
                  <div><p className="text-gray-500 text-sm">Total Posts</p><p className="text-2xl font-bold">{stats.totalPosts}</p></div>
                </div>
                <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center"><CreditCard size={24} /></div>
                  <div><p className="text-gray-500 text-sm">Active Subs</p><p className="text-2xl font-bold">{stats.totalSubscriptions}</p></div>
                </div>
                <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center">₹</div>
                  <div><p className="text-gray-500 text-sm">Total Revenue</p><p className="text-2xl font-bold">₹{stats.totalRevenue}</p></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex gap-4 bg-gray-50 dark:bg-[#1a1a1a]">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by username or email..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-sm focus:outline-none focus:border-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select 
                  className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-4 py-2 text-sm focus:outline-none"
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                >
                  <option value="">All Plans</option>
                  <option value="Free">Free</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 uppercase tracking-wider font-semibold text-xs border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Plan</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={u.profilePic || `https://placehold.co/40x40?text=${u.username[0]}`} className="w-8 h-8 rounded-full" alt="" />
                          <span className="font-medium">{u.username}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.subscriptionPlan === 'Gold' ? 'bg-yellow-100 text-yellow-700' : u.subscriptionPlan === 'Silver' ? 'bg-gray-200 text-gray-700' : u.subscriptionPlan === 'Bronze' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {u.subscriptionPlan}
                          </span>
                        </td>
                        <td className="px-6 py-4">{u.role}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={u.role === 'Admin'}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a]">
                <span className="text-sm text-gray-500">Page {page} of {totalPages || 1}</span>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p=>p-1)} className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm disabled:opacity-50 bg-white dark:bg-black">Prev</button>
                  <button disabled={page >= totalPages} onClick={() => setPage(p=>p+1)} className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm disabled:opacity-50 bg-white dark:bg-black">Next</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 uppercase tracking-wider font-semibold text-xs border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Admin</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Target Model</th>
                      <th className="px-6 py-4">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {logs.map(log => (
                      <tr key={log._id}>
                        <td className="px-6 py-4 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium">{log.adminId?.email}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">{log.action}</span></td>
                        <td className="px-6 py-4">{log.targetModel}</td>
                        <td className="px-6 py-4 font-mono text-xs">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
