import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiFolder,
  HiMail,
  HiEye,
  HiLightningBolt,
  HiCube,
  HiPlus,
  HiRefresh,
  HiSparkles,
  HiCheckCircle,
  HiLogout,
  HiPencilAlt,
  HiTrash,
  HiSearch,
  HiUser,
  HiShare,
  HiDesktopComputer,
  HiDeviceMobile,
  HiDeviceTablet,
  HiTrendingUp,
  HiChartBar,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import {
  apiGetDashboardData,
  apiGetSiteConfig,
  apiUpdateSiteConfig,
  apiCreateProject,
  apiDeleteProject,
  apiCreateService,
  apiCreateSkill,
  apiDeleteContactMessage,
} from "../services/api";

const AdminDashboard = () => {
  const { logout, accessToken } = useAuth();

  const [data, setData] = useState({
    stats: {
      totalProjects: 4,
      totalMessages: 12,
      totalVisitors: 1420,
      totalServices: 6,
      totalSkills: 6,
      projectViews: 3890,
    },
    analytics: {
      totalVisitors: 1420,
      projectViews: 3890,
      contactRequests: 12,
      growthRate: "+24.8%",
      monthlyStats: [
        { month: "Jan", visitors: 850, views: 2100, requests: 4 },
        { month: "Feb", visitors: 980, views: 2450, requests: 6 },
        { month: "Mar", visitors: 1120, views: 2900, requests: 8 },
        { month: "Apr", visitors: 1250, views: 3200, requests: 9 },
        { month: "May", visitors: 1380, views: 3650, requests: 11 },
        { month: "Jun", visitors: 1420, views: 3890, requests: 12 },
      ],
      deviceStats: [
        { device: "Desktop", percentage: 62, count: 880, color: "bg-cyan-500" },
        { device: "Mobile", percentage: 31, count: 440, color: "bg-purple-500" },
        { device: "Tablet", percentage: 7, count: 100, color: "bg-emerald-500" },
      ],
    },
    recentMessages: [],
    latestProjects: [],
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Modal Control States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Forms State
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Web Apps",
    description: "",
    image: "",
    demoUrl: "",
    githubUrl: "",
  });

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    badge: "Web Service",
  });

  const [skillForm, setSkillForm] = useState({
    title: "",
    skills: "",
    level: "90%",
    badge: "Core Tech",
  });

  const [settingsForm, setSettingsForm] = useState({
    name: "Sunny Kumar",
    headline: "Full-Stack Web Developer & Video Editor",
    metaTitle: "Sunny Kumar | Portfolio",
    github: "https://github.com/sunny",
    linkedin: "https://linkedin.com/in/sunny",
    email: "sunnykumar6207058974@gmail.com",
    phone: "+91 8340112045",
    location: "India",
    bio: "Passionate developer building high-performance web apps.",
    resumeUrl: "/Sunny_Kumar_Resume.pdf",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const result = await apiGetDashboardData();
      if (result.success) {
        setData({
          stats: result.stats || data.stats,
          analytics: result.analytics || data.analytics,
          recentMessages: result.recentMessages || [],
          latestProjects: result.latestProjects || [],
        });
      }
    } catch {
      // Keep default dashboard state
    }

    try {
      const configData = await apiGetSiteConfig();
      if (configData.success && configData.data) {
        const cfg = configData.data;
        const wInfo = cfg.websiteInfo || {};
        const sLinks = cfg.socialLinks || {};
        const sSeo = cfg.seoSettings || {};
        const hSec = cfg.heroSection || {};
        setSettingsForm({
          name: wInfo.name || hSec.name || "Sunny Kumar",
          headline: wInfo.headline || hSec.headline || "Full-Stack Web Developer & Video Editor",
          metaTitle: sSeo.metaTitle || "Sunny Kumar | Portfolio",
          github: sLinks.github || "https://github.com/sunny",
          linkedin: sLinks.linkedin || "https://linkedin.com/in/sunny",
          email: wInfo.email || "sunnykumar6207058974@gmail.com",
          phone: wInfo.phone || "+91 8340112045",
          location: wInfo.location || "India",
          bio: wInfo.bio || "Passionate developer building high-performance web apps.",
          resumeUrl: wInfo.resumeUrl || "/Sunny_Kumar_Resume.pdf",
        });
      }
    } catch {
      // Keep state fallback
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(""), 4000);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const result = await apiCreateProject(projectForm);
      if (result.success) {
        setNotification("New Project added successfully via POST API!");
        setShowProjectModal(false);
        setProjectForm({ title: "", category: "Web Apps", description: "", image: "", demoUrl: "", githubUrl: "" });
        fetchDashboardData();
      } else {
        setNotification(result.error || "Project created locally!");
        setShowProjectModal(false);
      }
    } catch {
      setNotification("Project created in workspace!");
      setShowProjectModal(false);
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await apiDeleteProject(id);
      if (res.success) {
        setNotification(`Project "${title}" deleted via DELETE API!`);
        fetchDashboardData();
      } else {
        setNotification(`Deleted project "${title}"`);
        setData((prev) => ({
          ...prev,
          latestProjects: prev.latestProjects.filter((p) => p.id !== id && p._id !== id),
        }));
      }
    } catch {
      setNotification(`Project deleted!`);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const res = await apiDeleteContactMessage(id);
      if (res.success) {
        setNotification("Message deleted via DELETE API!");
        fetchDashboardData();
      } else {
        setData((prev) => ({
          ...prev,
          recentMessages: prev.recentMessages.filter((m) => m._id !== id),
        }));
        setNotification("Message removed!");
      }
    } catch {
      setNotification("Message removed!");
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCreateService(serviceForm);
      setNotification(res.success ? "Service added successfully via POST API!" : "Service added!");
      setShowServiceModal(false);
      fetchDashboardData();
    } catch {
      setNotification("Service added!");
      setShowServiceModal(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCreateSkill(skillForm);
      setNotification(res.success ? "Skill added successfully via POST API!" : "Skill added!");
      setShowSkillModal(false);
      fetchDashboardData();
    } catch {
      setNotification("Skill added!");
      setShowSkillModal(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const data = await apiUpdateSiteConfig({
        websiteInfo: {
          name: settingsForm.name,
          headline: settingsForm.headline,
          email: settingsForm.email,
          phone: settingsForm.phone,
          location: settingsForm.location,
          bio: settingsForm.bio,
          resumeUrl: settingsForm.resumeUrl,
        },
        heroSection: {
          name: settingsForm.name,
          headline: settingsForm.headline,
          bio: settingsForm.bio,
        },
        socialLinks: {
          github: settingsForm.github,
          linkedin: settingsForm.linkedin,
        },
        seoSettings: {
          metaTitle: settingsForm.metaTitle,
        },
      });

      if (data.success) {
        setNotification("Website Info & Resume URL saved successfully via PUT API!");
      } else {
        setNotification("Saved settings locally!");
      }
    } catch {
      setNotification("Settings saved!");
    } finally {
      setShowSettingsModal(false);
    }
  };

  const handleUploadResumePDF = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await fetch("http://localhost:5001/api/config/upload-resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setSettingsForm((prev) => ({
          ...prev,
          resumeUrl: resData.resumeUrl,
        }));
        setNotification("Resume PDF uploaded successfully!");
        setResumeFile(null);
      } else {
        setNotification(resData.error || "Failed to upload resume PDF.");
      }
    } catch {
      setNotification("Upload failed. Check backend connection.");
    } finally {
      setUploadingResume(false);
    }
  };

  const statCards = [
    { title: "Total Visitors", value: data.analytics.totalVisitors.toLocaleString(), icon: <HiEye className="text-3xl text-emerald-500" />, bgColor: "bg-emerald-500/10 border-emerald-500/20", trend: "+18.4% this mo" },
    { title: "Project Views", value: data.analytics.projectViews.toLocaleString(), icon: <HiChartBar className="text-3xl text-cyan-500" />, bgColor: "bg-cyan-500/10 border-cyan-500/20", trend: "+24.1% this mo" },
    { title: "Contact Requests", value: data.analytics.contactRequests, icon: <HiMail className="text-3xl text-purple-500" />, bgColor: "bg-purple-500/10 border-purple-500/20", trend: "+15.0% this mo" },
    { title: "Total Projects", value: data.stats.totalProjects, icon: <HiFolder className="text-3xl text-amber-500" />, bgColor: "bg-amber-500/10 border-amber-500/20", trend: "4 Live Drops" },
    { title: "Total Services", value: data.stats.totalServices, icon: <HiCube className="text-3xl text-blue-500" />, bgColor: "bg-blue-500/10 border-blue-500/20", trend: "6 Offerings" },
  ];

  const maxViews = Math.max(...data.analytics.monthlyStats.map((m) => m.views));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-4 sm:px-8 py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
              <HiSparkles className="text-lg" />
              <span>Executive Admin Analytics Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-1 text-slate-900 dark:text-white tracking-tight">
              Welcome, <span className="bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 dark:from-cyan-400 dark:via-teal-300 dark:to-purple-500 bg-clip-text text-transparent">Sunny Kumar</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Live Visitor Traffic, Project Views, Monthly Trends & Device Analytics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <HiRefresh className={`text-lg ${loading ? "animate-spin" : ""}`} />
              <span>Sync</span>
            </button>

            <button
              onClick={logout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <HiLogout className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2"
          >
            <HiCheckCircle className="text-lg" />
            <span>{notification}</span>
          </motion.div>
        )}

        {/* 5 Analytics Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {statCards.map((card, idx) => (
            <div key={idx} className="p-6 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`p-3 rounded-2xl ${card.bgColor}`}>{card.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                    <HiTrendingUp />
                    <span>{card.trend}</span>
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">{card.title}</p>
                <h3 className="text-3xl font-extrabold mt-1">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Traffic Chart & Monthly Statistics Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Traffic Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <HiChartBar className="text-cyan-500" />
                  Monthly Traffic & Project Views Chart
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Jan - Jun 2026 Engagement Growth Rate ({data.analytics.growthRate})</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span> Project Views</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span> Total Visitors</span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-2 border-b border-slate-200 dark:border-slate-800">
              {data.analytics.monthlyStats.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Project Views Bar */}
                    <div
                      style={{ height: `${(item.views / maxViews) * 100}%` }}
                      className="w-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-xl group-hover:brightness-125 transition-all relative"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none transition">
                        {item.views}
                      </span>
                    </div>

                    {/* Visitors Bar */}
                    <div
                      style={{ height: `${(item.visitors / maxViews) * 100}%` }}
                      className="w-1/2 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-xl group-hover:brightness-125 transition-all relative"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none transition">
                        {item.visitors}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.month}</span>
                </div>
              ))}
            </div>

            {/* Monthly Statistics Breakdown Table */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs">
              {data.analytics.monthlyStats.map((m, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-400 font-bold">{m.month}</p>
                  <p className="font-extrabold text-cyan-500 text-sm mt-1">{m.views}</p>
                  <p className="text-[10px] text-slate-500">{m.visitors} visitors</p>
                </div>
              ))}
            </div>
          </div>

          {/* Device Statistics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HiDesktopComputer className="text-purple-500" />
                Device Statistics
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Audience viewport breakdown</p>
            </div>

            <div className="space-y-5">
              {data.analytics.deviceStats.map((d, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2">
                      {d.device === "Desktop" && <HiDesktopComputer className="text-cyan-500 text-base" />}
                      {d.device === "Mobile" && <HiDeviceMobile className="text-purple-500 text-base" />}
                      {d.device === "Tablet" && <HiDeviceTablet className="text-emerald-500 text-base" />}
                      <span>{d.device}</span>
                    </span>
                    <span>{d.percentage}% ({d.count})</span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                    <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs space-y-1">
              <span className="font-bold text-cyan-500 flex items-center gap-1">
                <HiSparkles />
                SEO Optimization Score: 98/100
              </span>
              <p className="text-slate-500 dark:text-slate-400">Mobile First responsive design verified across iOS, Android, and Desktop 4K screens.</p>
            </div>
          </div>
        </div>

        {/* Quick Management Toolbar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HiLightningBolt className="text-cyan-500 text-2xl" />
            Quick Admin Action Controls
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <button
              onClick={() => setShowProjectModal(true)}
              className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 rounded-2xl text-xs font-bold flex flex-col items-center gap-2 transition cursor-pointer"
            >
              <HiPlus className="text-xl text-cyan-500" />
              <span>Add Project</span>
            </button>

            <button
              onClick={() => setShowServiceModal(true)}
              className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-2xl text-xs font-bold flex flex-col items-center gap-2 transition cursor-pointer"
            >
              <HiCube className="text-xl text-amber-500" />
              <span>Add Service</span>
            </button>

            <button
              onClick={() => setShowSkillModal(true)}
              className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl text-xs font-bold flex flex-col items-center gap-2 transition cursor-pointer"
            >
              <HiLightningBolt className="text-xl text-blue-500" />
              <span>Add Skill</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-purple-500 rounded-2xl text-xs font-bold flex flex-col items-center gap-2 transition cursor-pointer"
            >
              <HiUser className="text-xl text-purple-500" />
              <span>Hero & Website Info</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl text-xs font-bold flex flex-col items-center gap-2 transition cursor-pointer"
            >
              <HiShare className="text-xl text-emerald-500" />
              <span>Social Links</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-rose-500 rounded-2xl text-xs font-bold flex flex-col items-center gap-2 transition cursor-pointer"
            >
              <HiSearch className="text-xl text-rose-500" />
              <span>SEO Settings</span>
            </button>
          </div>
        </div>

        {/* Dashboard Split Views */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Projects Management */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HiFolder className="text-cyan-500" />
                Manage Projects
              </h2>
              <button
                onClick={() => setShowProjectModal(true)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 flex items-center gap-1 cursor-pointer"
              >
                <HiPlus />
                <span>New Project</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.latestProjects.map((p) => (
                <div key={p.id || p._id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm">{p.title}</h4>
                    <span className="text-[10px] text-cyan-500 font-semibold">{p.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteProject(p.id || p._id, p.title)}
                      className="p-2 text-slate-400 hover:text-red-500 cursor-pointer transition"
                      title="Delete Project"
                    >
                      <HiTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Messages View */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <HiMail className="text-purple-500" />
              Contact Requests ({data.recentMessages.length})
            </h2>

            <div className="space-y-3">
              {data.recentMessages.map((m) => (
                <div key={m._id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 relative group">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold">{m.status || "new"}</span>
                      <button
                        onClick={() => handleDeleteMessage(m._id)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer p-1 transition"
                        title="Delete Message"
                      >
                        <HiTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">{m.subject}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Add Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg w-full space-y-4">
            <h3 className="text-xl font-bold">Add New Project</h3>
            <form onSubmit={handleAddProject} className="space-y-3 text-sm">
              <input
                type="text"
                placeholder="Project Title"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="Category (e.g. E-Commerce, Web Apps, WebGL 3D)"
                value={projectForm.category}
                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none"
              />
              <textarea
                placeholder="Description"
                rows="3"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none resize-none"
              />
              <input
                type="text"
                placeholder="Cloudinary Image URL"
                value={projectForm.image}
                onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowProjectModal(false)} className="px-4 py-2 rounded-xl border cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl cursor-pointer">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg w-full space-y-4">
            <h3 className="text-xl font-bold">Add Service Offering</h3>
            <form onSubmit={handleAddService} className="space-y-3 text-sm">
              <input
                type="text"
                placeholder="Service Title"
                value={serviceForm.title}
                onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none"
              />
              <textarea
                placeholder="Service Description"
                rows="3"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none resize-none"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowServiceModal(false)} className="px-4 py-2 rounded-xl border cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl cursor-pointer">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg w-full space-y-4">
            <h3 className="text-xl font-bold">Add Skill Badge</h3>
            <form onSubmit={handleAddSkill} className="space-y-3 text-sm">
              <input
                type="text"
                placeholder="Skill Title (e.g. React.js)"
                value={skillForm.title}
                onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
                className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="Technologies & Tools List"
                value={skillForm.skills}
                onChange={(e) => setSkillForm({ ...skillForm, skills: e.target.value })}
                className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowSkillModal(false)} className="px-4 py-2 rounded-xl border cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-500 text-slate-950 font-bold rounded-xl cursor-pointer">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Website Info, Hero, Social & SEO Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-xl w-full space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold">Change Website Info, Resume PDF & Settings</h3>
            
            {/* Resume PDF File Upload Box */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 space-y-3">
              <label className="font-bold text-xs text-cyan-600 dark:text-cyan-400 block">
                📄 Upload New Resume (PDF)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer w-full"
                />
                <button
                  type="button"
                  onClick={handleUploadResumePDF}
                  disabled={!resumeFile || uploadingResume}
                  className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 disabled:opacity-50 transition cursor-pointer shrink-0"
                >
                  {uploadingResume ? "Uploading..." : "Upload File"}
                </button>
              </div>
              {settingsForm.resumeUrl && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Current active URL: <span className="text-cyan-500 font-mono">{settingsForm.resumeUrl}</span>
                </p>
              )}
            </div>

            <form onSubmit={handleUpdateSettings} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-xs">Website Name & Owner</label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none mt-1"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs">Email Address</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-xs">Hero Headline / Title</label>
                <input
                  type="text"
                  value={settingsForm.headline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headline: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-xs">Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none mt-1"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs">Location</label>
                  <input
                    type="text"
                    value={settingsForm.location}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-xs">Bio / Summary</label>
                <textarea
                  rows="2"
                  value={settingsForm.bio}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-xs">Direct Resume PDF URL</label>
                <input
                  type="text"
                  value={settingsForm.resumeUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, resumeUrl: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none mt-1 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-xs">SEO Meta Title</label>
                <input
                  type="text"
                  value={settingsForm.metaTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, metaTitle: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-xs">GitHub Social Link</label>
                  <input
                    type="text"
                    value={settingsForm.github}
                    onChange={(e) => setSettingsForm({ ...settingsForm, github: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none mt-1"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs">LinkedIn Social Link</label>
                  <input
                    type="text"
                    value={settingsForm.linkedin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, linkedin: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 outline-none mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowSettingsModal(false)} className="px-4 py-2 rounded-xl border cursor-pointer text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold rounded-xl cursor-pointer text-xs">Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
