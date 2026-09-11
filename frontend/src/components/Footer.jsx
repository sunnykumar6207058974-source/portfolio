import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 px-6 py-10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Footer */}
        <div className="grid md:grid-cols-3 gap-10 items-center">
          {/* Logo */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-500 bg-clip-text text-transparent group"
            >
              <img
                src="/logo.png"
                alt="PixelForge Logo"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500/40 group-hover:ring-cyan-400 transition duration-300 shadow-md shadow-cyan-500/20"
              />
              <span>PixelForge</span>
            </Link>

            <p className="text-slate-600 dark:text-slate-400 mt-3">
              Building modern web experiences with creativity and technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition font-medium">
                  About
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition font-medium">
                  Skills
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition font-medium">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/resume" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition font-medium">
                  Resume
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition font-medium">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Connect With Me
            </h3>

            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500 dark:hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold transition shadow-sm"
              >
                GH
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500 dark:hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold transition shadow-sm"
              >
                IN
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500 dark:hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold transition shadow-sm"
              >
                TW
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            © 2026 PixelForge. All rights reserved.
          </p>

          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Designed & Developed by{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold ml-1">
              Sunny Kumar
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;