import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { HiCode, HiFire, HiSparkles, HiCalendar } from "react-icons/hi";

const GithubCalendar = () => {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 52 weeks (364 days) of contribution data with realistic activity levels
  const weeks = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const generatedWeeks = [];

    let currentMonth = "";
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364);

    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (w * 7 + d));
        
        // Random contribution count with weighted distribution (favoring active days)
        const rand = Math.random();
        let count = 0;
        let level = 0;

        if (rand > 0.35) {
          count = Math.floor(Math.random() * 12) + 1;
          if (count <= 2) level = 1;
          else if (count <= 5) level = 2;
          else if (count <= 8) level = 3;
          else level = 4;
        }

        const dateStr = date.toISOString().split("T")[0];
        const monthName = months[date.getMonth()];

        if (d === 0 && monthName !== currentMonth) {
          currentMonth = monthName;
        }

        days.push({
          date: dateStr,
          count,
          level,
          dayOfWeek: d,
        });
      }

      generatedWeeks.push({
        days,
        monthLabel: w % 4 === 0 ? months[startDate.getMonth() % 12] : "",
      });
      startDate.setDate(startDate.getDate());
    }

    return generatedWeeks;
  }, []);

  // Level color mapping for light & dark mode
  const getLevelColor = (level) => {
    switch (level) {
      case 0:
        return "bg-slate-200 dark:bg-slate-800/60";
      case 1:
        return "bg-emerald-200 dark:bg-emerald-950/80 border border-emerald-400/30";
      case 2:
        return "bg-emerald-400 dark:bg-emerald-700";
      case 3:
        return "bg-emerald-500 dark:bg-emerald-500 shadow-xs shadow-emerald-500/50";
      case 4:
        return "bg-cyan-400 dark:bg-cyan-400 shadow-sm shadow-cyan-400/80 animate-pulse";
      default:
        return "bg-slate-200 dark:bg-slate-800";
    }
  };

  const totalCommits = 1482;
  const currentStreak = 18;
  const longestStreak = 42;

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
            Consistent open-source activity, daily commits, and continuous software engineering contributions.
          </p>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm dark:shadow-none text-center">
            <div className="inline-flex p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-2">
              <HiCalendar className="text-2xl" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {totalCommits.toLocaleString()}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1">
              Commits in Past Year
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm dark:shadow-none text-center">
            <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
              <HiFire className="text-2xl" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {currentStreak} Days
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
              {longestStreak} Days
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1">
              Longest Streak
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm dark:shadow-none text-center">
            <div className="inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-2">
              <HiCode className="text-2xl" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              24+
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1">
              Public Repositories
            </p>
          </div>
        </div>

        {/* Calendar Heatmap Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg dark:shadow-none relative">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-sm border border-slate-700">
                GH
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  @sunnykumar
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  GitHub Contribution Activity Graph
                </p>
              </div>
            </div>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
            >
              View GitHub Profile →
            </a>
          </div>

          {/* Heatmap Grid Wrapper (Scrollable on small screens) */}
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="min-w-[720px]">
              {/* Heatmap Squares Grid */}
              <div className="flex gap-[3px] items-start">
                {/* Day Labels Column */}
                <div className="flex flex-col gap-[3px] text-[10px] text-slate-400 dark:text-slate-500 pr-2 pt-1 font-mono">
                  <span>Mon</span>
                  <span className="mt-[14px]">Wed</span>
                  <span className="mt-[14px]">Fri</span>
                </div>

                {/* 52 Weeks */}
                {weeks.map((week, wIndex) => (
                  <div key={wIndex} className="flex flex-col gap-[3px]">
                    {week.days.map((day, dIndex) => (
                      <motion.div
                        key={dIndex}
                        whileHover={{ scale: 1.3 }}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3 h-3 rounded-[3px] ${getLevelColor(
                          day.level
                        )} transition-all duration-200 cursor-pointer`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Day Tooltip Info Bar */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="font-medium text-cyan-600 dark:text-cyan-400 min-h-[1.25rem]">
              {hoveredDay ? (
                <span>
                  {hoveredDay.count > 0
                    ? `${hoveredDay.count} contributions on ${hoveredDay.date}`
                    : `No contributions on ${hoveredDay.date}`}
                </span>
              ) : (
                <span>Hover over any block to view commit details</span>
              )}
            </div>

            {/* Intensity Legend */}
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <span>Less</span>
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-[2px] bg-slate-200 dark:bg-slate-800/60" />
                <span className="w-3 h-3 rounded-[2px] bg-emerald-200 dark:bg-emerald-950/80" />
                <span className="w-3 h-3 rounded-[2px] bg-emerald-400 dark:bg-emerald-700" />
                <span className="w-3 h-3 rounded-[2px] bg-emerald-500 dark:bg-emerald-500" />
                <span className="w-3 h-3 rounded-[2px] bg-cyan-400 dark:bg-cyan-400" />
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
