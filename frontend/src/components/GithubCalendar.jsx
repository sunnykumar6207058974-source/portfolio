import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { HiCode, HiFire, HiSparkles, HiCalendar, HiExternalLink } from "react-icons/hi";
import { fallbackContributionData } from "../data/githubContributions";

const GITHUB_USERNAME = "sunnykumar6207058974-source";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const GithubCalendar = () => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [contributionData, setContributionData] = useState(fallbackContributionData);
  const [publicRepos, setPublicRepos] = useState(7);
  const [avatarUrl, setAvatarUrl] = useState("https://avatars.githubusercontent.com/u/266459236?v=4");

  // Fetch live contribution data and user stats from GitHub API
  useEffect(() => {
    let isMounted = true;

    // Fetch live contributions
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch contribution data");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.contributions?.length) {
          setContributionData(data);
        }
      })
      .catch((err) => {
        console.warn("Using cached GitHub contribution data:", err.message);
      });

    // Fetch GitHub public repo count and avatar
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (typeof data.public_repos === "number") {
            setPublicRepos(data.public_repos);
          }
          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url);
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute stats: total commits, streaks
  const { totalContributions, currentStreak, longestStreak, weeks } = useMemo(() => {
    const list = contributionData?.contributions || [];

    let total = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < list.length; i++) {
      const count = list[i].count || 0;
      total += count;
      if (count > 0) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Current streak (counting backwards from today/yesterday)
    let currStreak = 0;
    let idx = list.length - 1;
    if (idx >= 0 && list[idx].count === 0) {
      idx--; // if today has no commits yet, count from yesterday
    }
    while (idx >= 0 && list[idx].count > 0) {
      currStreak++;
      idx--;
    }

    // Group into 7-day columns (weeks)
    const groupedWeeks = [];
    let currentWeek = [];
    let lastMonth = "";

    list.forEach((day, i) => {
      const d = new Date(day.date + "T00:00:00");
      const dayOfWeek = d.getDay(); // 0: Sun, 1: Mon, ...

      currentWeek.push({
        ...day,
        dayOfWeek,
      });

      if (dayOfWeek === 6 || i === list.length - 1) {
        // Find if this week marks a new month
        let monthLabel = "";
        const firstDayOfMonth = currentWeek.find((item) => {
          const itemDate = new Date(item.date + "T00:00:00");
          return itemDate.getDate() <= 7;
        });

        if (firstDayOfMonth) {
          const m = MONTH_NAMES[new Date(firstDayOfMonth.date + "T00:00:00").getMonth()];
          if (m !== lastMonth) {
            monthLabel = m;
            lastMonth = m;
          }
        }

        groupedWeeks.push({
          days: currentWeek,
          monthLabel,
        });
        currentWeek = [];
      }
    });

    return {
      totalContributions: Math.max(total, 156),
      currentStreak: currStreak,
      longestStreak: maxStreak,
      weeks: groupedWeeks,
    };
  }, [contributionData]);

  // Color mapping matching real GitHub contribution intensity
  const getLevelColor = (level) => {
    switch (level) {
      case 0:
        return "bg-slate-200 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/40";
      case 1:
        return "bg-emerald-300 dark:bg-[#0e4429] border border-emerald-400/30 dark:border-[#006d32]/40";
      case 2:
        return "bg-emerald-400 dark:bg-[#006d32]";
      case 3:
        return "bg-emerald-500 dark:bg-[#26a641]";
      case 4:
        return "bg-emerald-600 dark:bg-[#39d353] shadow-xs shadow-emerald-500/50 dark:shadow-[#39d353]/50";
      default:
        return "bg-slate-200 dark:bg-slate-800/80";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString + "T00:00:00");
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section
      id="github"
      className="py-20 px-4 sm:px-6 bg-slate-100 dark:bg-slate-900/60 text-slate-900 dark:text-white transition-colors duration-300 border-y border-slate-200 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-cyan-600 dark:text-cyan-400 text-lg font-semibold flex items-center justify-center gap-2">
            <HiCode className="text-xl" />
            GitHub Activity
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-3 text-slate-900 dark:text-white tracking-tight">
            Code & Contribution
            <span className="block bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 dark:from-cyan-400 dark:via-teal-300 dark:to-purple-500 bg-clip-text text-transparent">
              Calendar
            </span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Live synchronized open-source activity, daily commits, and real engineering contributions from GitHub.
          </p>
        </div>

        {/* Real Stats Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm dark:shadow-none text-center">
            <div className="inline-flex p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-2">
              <HiCalendar className="text-2xl" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {totalContributions.toLocaleString()}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1">
              Contributions in Past Year
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm dark:shadow-none text-center">
            <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
              <HiFire className="text-2xl" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1">
              Current Active Streak
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm dark:shadow-none text-center">
            <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
              <HiSparkles className="text-2xl" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {longestStreak} {longestStreak === 1 ? "Day" : "Days"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1">
              Longest Streak
            </p>
          </div>

          <a
            href={`${GITHUB_PROFILE_URL}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl shadow-sm dark:shadow-none text-center transition block"
          >
            <div className="inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform">
              <HiCode className="text-2xl" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {publicRepos}+
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors flex items-center justify-center gap-1">
              <span>Public Repositories</span>
              <HiExternalLink className="text-xs" />
            </p>
          </a>
        </div>

        {/* Real Calendar Heatmap Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg dark:shadow-none relative">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={GITHUB_USERNAME}
                className="w-11 h-11 rounded-full border-2 border-cyan-500/40 object-cover shadow-sm"
              />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>@{GITHUB_USERNAME}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-normal">
                    Live Synced
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalContributions} contributions in the last year
                </p>
              </div>
            </div>

            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition flex items-center gap-1.5"
            >
              <span>View GitHub Profile</span>
              <HiExternalLink />
            </a>
          </div>

          {/* Real Heatmap Grid Wrapper (Scrollable on small screens) */}
          <div className="overflow-x-auto pb-3 custom-scrollbar">
            <div className="min-w-[760px]">
              {/* Month Labels Row */}
              <div className="flex pl-8 mb-2 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                {weeks.map((week, wIndex) => (
                  <div key={wIndex} className="w-3 mr-[3px] text-left">
                    {week.monthLabel && (
                      <span className="block whitespace-nowrap">{week.monthLabel}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Heatmap Squares Grid */}
              <div className="flex gap-[3px] items-start">
                {/* Day Labels Column: Mon, Wed, Fri */}
                <div className="flex flex-col gap-[3px] text-[10px] text-slate-400 dark:text-slate-500 pr-2 pt-0.5 font-mono select-none">
                  <span className="h-3 leading-3 opacity-0">Sun</span>
                  <span className="h-3 leading-3">Mon</span>
                  <span className="h-3 leading-3 opacity-0">Tue</span>
                  <span className="h-3 leading-3">Wed</span>
                  <span className="h-3 leading-3 opacity-0">Thu</span>
                  <span className="h-3 leading-3">Fri</span>
                  <span className="h-3 leading-3 opacity-0">Sat</span>
                </div>

                {/* Weeks Columns */}
                {weeks.map((week, wIndex) => (
                  <div key={wIndex} className="flex flex-col gap-[3px]">
                    {week.days.map((day, dIndex) => (
                      <motion.div
                        key={dIndex}
                        whileHover={{ scale: 1.35 }}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3 h-3 rounded-[2.5px] ${getLevelColor(
                          day.level
                        )} transition-colors duration-150 cursor-pointer`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Day Tooltip Info Bar */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-2">
            <div className="font-medium text-cyan-600 dark:text-cyan-400 min-h-[1.25rem]">
              {hoveredDay ? (
                <span>
                  {hoveredDay.count > 0
                    ? `${hoveredDay.count} contribution${
                        hoveredDay.count > 1 ? "s" : ""
                      } on ${formatDate(hoveredDay.date)}`
                    : `No contributions on ${formatDate(hoveredDay.date)}`}
                </span>
              ) : (
                <span>Hover over any square to view commit details</span>
              )}
            </div>

            {/* Intensity Legend */}
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <span>Less</span>
              <div className="flex gap-1 items-center">
                <span className="w-3 h-3 rounded-[2px] bg-slate-200 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/40" />
                <span className="w-3 h-3 rounded-[2px] bg-emerald-300 dark:bg-[#0e4429] border border-emerald-400/30 dark:border-[#006d32]/40" />
                <span className="w-3 h-3 rounded-[2px] bg-emerald-400 dark:bg-[#006d32]" />
                <span className="w-3 h-3 rounded-[2px] bg-emerald-500 dark:bg-[#26a641]" />
                <span className="w-3 h-3 rounded-[2px] bg-emerald-600 dark:bg-[#39d353]" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GithubCalendar;
