import { motion } from "framer-motion";
import profilePhoto from "../assets/profile.jpg";

const About = () => {
  const skills = [
    {
      icon: "💻",
      title: "Web Development",
      description:
        "Building fast, responsive frontend interfaces and robust backend APIs with React & Node.js.",
    },
    {
      icon: "🎬",
      title: "Video Editing",
      description:
        "Crafting engaging video content, dynamic visual cuts, motion graphics, and media editing.",
    },
    {
      icon: "⚡",
      title: "Full Stack Systems",
      description:
        "Creating complete digital solutions with databases, authentication, and REST APIs.",
    },
    {
      icon: "👥",
      title: "Creative Storytelling",
      description:
        "Combining clean software engineering with visual media to solve real-world problems.",
    },
  ];

  return (
    <section
      id="about"
      className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white py-20 px-6 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-cyan-600 dark:text-cyan-400 text-lg font-semibold">
            About Me
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-slate-900 dark:text-white">
            Turning Ideas Into
            <span className="block bg-gradient-to-r from-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-500 text-transparent bg-clip-text">
              Digital & Visual Reality
            </span>
          </h2>
        </motion.div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 mt-16 items-center">
          {/* Left Text & Profile Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <img
                src={profilePhoto}
                alt="Sunny Kumar Profile"
                className="w-24 h-32 rounded-2xl object-cover object-top border-2 border-cyan-400/80 p-0.5 shadow-md shrink-0"
              />
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Sunny Kumar
                </h3>
                <p className="text-cyan-600 dark:text-cyan-400 font-medium text-sm">
                  Web Developer & Video Editor
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  📞 +91 8340112045 | ✉️ sunnykumar6207058974@gmail.com
                </p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              I am a B.Tech Computer Science & Engineering student, Full-Stack Web Developer, and Video Editor. I specialize in building responsive web applications, powerful backend systems, and engaging visual video content.
            </p>

            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mt-4">
              My goal is to combine clean software engineering with creative visual media to build fast, intuitive, and visually captivating digital products.
            </p>

            <div className="mt-8 flex flex-wrap gap-8">
              <div>
                <h4 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                  10+
                </h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Web Projects
                </p>
              </div>

              <div>
                <h4 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                  25+
                </h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Edited Videos
                </p>
              </div>

              <div>
                <h4 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                  100%
                </h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Dedication
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-cyan-500 dark:hover:border-cyan-400 transition shadow-md dark:shadow-none"
              >
                <div className="text-3xl mb-4">
                  {skill.icon}
                </div>

                <h4 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                  {skill.title}
                </h4>

                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;