import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiCheckCircle,
  HiClock,
  HiLightningBolt,
  HiExternalLink,
  HiSearch,
  HiSparkles,
  HiShieldCheck,
  HiPaperAirplane,
  HiCalendar,
  HiUser,
  HiCode,
  HiRefresh,
  HiInformationCircle,
  HiChevronRight,
  HiChatAlt2,
} from "react-icons/hi";
import { apiGetTrackerByCode } from "../services/api";

const ClientTrackerPage = () => {
  const { trackingCode } = useParams();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState(trackingCode || "");
  const [tracker, setTracker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Load tracker whenever trackingCode in URL changes
  useEffect(() => {
    if (trackingCode) {
      fetchTracker(trackingCode);
    } else {
      setTracker(null);
      setError("");
    }
  }, [trackingCode]);

  const fetchTracker = async (code) => {
    if (!code || !code.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await apiGetTrackerByCode(code.trim());
      if (res.success && res.data) {
        setTracker(res.data);
      } else {
        setError(res.error || "No project found with this tracking code.");
        setTracker(null);
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
      setTracker(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    navigate(`/track/${inputCode.trim().toUpperCase()}`);
  };

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    // Format WhatsApp message to Sunny
    const message = `Hi Sunny, regarding project "${tracker.projectName}" (Code: ${tracker.trackingCode}):\n\n${feedbackText}`;
    const whatsappUrl = `https://wa.me/916207058974?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setFeedbackSent(true);
    setFeedbackText("");
    setTimeout(() => setFeedbackSent(false), 5000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-semibold mb-4"
        >
          <HiSparkles className="text-cyan-400" />
          Client Portal • Real-Time Work Progress
        </motion.div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Live Project{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
            Status Tracker
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
          Track real-time development progress, completed milestones, daily feature changelogs, and live staging previews.
        </p>

        {/* Search / Passcode Input */}
        <div className="mt-8 max-w-md mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-4 text-slate-400">
              <HiSearch className="text-xl" />
            </div>
            <input
              type="text"
              placeholder="Enter Project Code (e.g. UT-2026)"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-lg text-sm font-mono tracking-wider uppercase transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:opacity-90 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track Live"}
            </button>
          </form>

          {/* Quick Demo Tag */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span>Quick Test:</span>
            <button
              type="button"
              onClick={() => {
                setInputCode("UT-2026");
                navigate("/track/UT-2026");
              }}
              className="text-cyan-600 dark:text-cyan-400 hover:underline font-mono font-semibold"
            >
              UT-2026 (UrbanThread)
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm text-center mb-8 flex items-center justify-center gap-2"
        >
          <HiInformationCircle className="text-lg flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Fetching live project telemetry...</p>
        </div>
      )}

      {/* Tracker Content (When loaded) */}
      {!loading && tracker && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Top Overview Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent pointer-events-none rounded-full blur-3xl"></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                    CODE: {tracker.trackingCode}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      tracker.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : tracker.status === "Testing / QA"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    {tracker.status}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {tracker.projectName}
                </h2>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <HiUser className="text-cyan-500" />
                    <span>Client: <strong className="text-slate-800 dark:text-slate-200">{tracker.clientName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiCalendar className="text-purple-500" />
                    <span>Started: <strong>{tracker.startDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiClock className="text-amber-500" />
                    <span>Target Delivery: <strong className="text-slate-800 dark:text-slate-200">{tracker.estimatedDelivery}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {tracker.livePreviewUrl && (
                  <a
                    href={tracker.livePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs sm:text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition active:scale-95"
                  >
                    <HiExternalLink className="text-base" />
                    Open Live Staging Preview
                  </a>
                )}
                <a
                  href={`https://wa.me/916207058974?text=Hi%20Sunny,%20regarding%20my%20project%20${encodeURIComponent(tracker.projectName)}%20(Code:%20${tracker.trackingCode})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition"
                >
                  <HiChatAlt2 className="text-base text-emerald-500" />
                  Chat with Sunny
                </a>
              </div>
            </div>

            {/* Big Progress Bar Section */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                    Overall Completion Status
                  </span>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <HiLightningBolt className="text-cyan-500" />
                    <span>Current Focus: <strong>{tracker.currentPhase}</strong></span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">
                    {tracker.progress}%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">COMPLETED</span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tracker.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-md relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
              </div>

              {/* Progress Milestones Tick */}
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span>0% Kickoff</span>
                <span>25% Design</span>
                <span>50% Core Dev</span>
                <span>75% Integration</span>
                <span>100% Launch</span>
              </div>
            </div>
          </div>

          {/* 100% Delivered Celebration Banner */}
          {tracker.progress >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-emerald-500/30">
                  🎉
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    Project 100% Completed & Successfully Delivered!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    All planned milestones, features, payment systems, and performance audits have been fully tested and delivered.
                  </p>
                </div>
              </div>
              {tracker.livePreviewUrl && (
                <a
                  href={tracker.livePreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 whitespace-nowrap shadow-lg transition active:scale-95"
                >
                  <HiExternalLink className="text-base" />
                  Visit Live Production
                </a>
              )}
            </motion.div>
          )}

          {/* Grid Layout: Milestones (Left) & Activity Log (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Cols: Milestones Stepper & Scope */}
            <div className="lg:col-span-7 space-y-8">
              {/* Project Milestones */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <HiShieldCheck className="text-cyan-500 text-2xl" />
                      Project Milestones
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Step-by-step phases of your project lifecycle
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tracker.milestones?.filter((m) => m.status === "completed").length || 0} /{" "}
                    {tracker.milestones?.length || 0} Done
                  </span>
                </div>

                <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {tracker.milestones?.map((milestone, idx) => {
                    const isDone = milestone.status === "completed";
                    const isInProgress = milestone.status === "in-progress";

                    return (
                      <div key={milestone._id || idx} className="relative pl-10">
                        {/* Step Marker */}
                        <div
                          className={`absolute left-0 top-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 transition ${
                            isDone
                              ? "bg-emerald-500 border-emerald-400 text-white"
                              : isInProgress
                              ? "bg-cyan-500 border-cyan-400 text-white animate-pulse"
                              : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400"
                          }`}
                        >
                          {isDone ? (
                            <HiCheckCircle className="text-lg" />
                          ) : isInProgress ? (
                            <HiLightningBolt className="text-sm" />
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>

                        {/* Content */}
                        <div
                          className={`p-4 rounded-2xl border transition ${
                            isInProgress
                              ? "bg-cyan-500/5 border-cyan-500/30"
                              : "bg-slate-50/50 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                              {milestone.title}
                            </h4>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                isDone
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : isInProgress
                                  ? "bg-cyan-500/10 text-cyan-400"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {isDone ? `Completed ${milestone.completedDate ? `(${milestone.completedDate})` : ""}` : isInProgress ? "Active Work" : "Upcoming"}
                            </span>
                          </div>
                          {milestone.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                              {milestone.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Agreed Scope Deliverables Card */}
              {tracker.scope && tracker.scope.length > 0 && (
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xl">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <HiCode className="text-purple-500 text-xl" />
                    Agreed Project Scope & Features
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Deliverables included in this development contract
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {tracker.scope.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 font-medium"
                      >
                        <HiCheckCircle className="text-cyan-500 text-base flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 Cols: "What Was Added" Changelog & Feedback Box */}
            <div className="lg:col-span-5 space-y-8">
              {/* Activity / Changelog Feed */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <HiSparkles className="text-amber-500 text-2xl" />
                      What's New & Added
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live daily work log posted by Sunny
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {tracker.activityLog && tracker.activityLog.length > 0 ? (
                    tracker.activityLog.map((log, idx) => {
                      const logDate = log.date
                        ? new Date(log.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent";

                      return (
                        <div
                          key={log._id || idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 hover:border-cyan-500/30 transition group"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                log.tag === "Payment"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : log.tag === "Bug Fix"
                                  ? "bg-rose-500/10 text-rose-400"
                                  : log.tag === "UI / Design"
                                  ? "bg-purple-500/10 text-purple-400"
                                  : "bg-cyan-500/10 text-cyan-400"
                              }`}
                            >
                              {log.tag || "Feature"}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {logDate}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {log.title}
                          </h4>

                          {log.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                              {log.description}
                            </p>
                          )}

                          {log.previewUrl && (
                            <a
                              href={log.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold mt-2.5 hover:underline"
                            >
                              <HiExternalLink />
                              Preview Feature Live
                            </a>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-500">
                      No updates logged yet. Check back soon!
                    </div>
                  )}
                </div>
              </div>

              {/* Direct Feedback / Question Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 border border-cyan-500/20 shadow-xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                  <HiChatAlt2 className="text-cyan-500 text-lg" />
                  Have Feedback or Changes?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  Type your feedback or question below. It will send directly to Sunny's WhatsApp.
                </p>

                <form onSubmit={handleSendFeedback} className="space-y-3">
                  <textarea
                    rows="3"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="e.g. Looks great! Could we adjust the button size on mobile?"
                    className="w-full p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition"
                  >
                    <HiPaperAirplane className="transform rotate-90" />
                    Send Feedback to Sunny
                  </button>

                  {feedbackSent && (
                    <p className="text-xs text-emerald-500 text-center font-medium">
                      Redirecting to WhatsApp to send message!
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClientTrackerPage;
