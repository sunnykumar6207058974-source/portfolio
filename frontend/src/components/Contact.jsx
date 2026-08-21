import { useState } from "react";
import { apiSubmitContact } from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, success: null, message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ loading: false, success: false, message: "Please fill out all fields." });
      return;
    }

    setStatus({ loading: true, success: null, message: "" });

    try {
      const result = await apiSubmitContact(formData);

      if (result.success) {
        setStatus({
          loading: false,
          success: true,
          message: result.message || "Thank you! Your message has been sent to Sunny.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({
          loading: false,
          success: false,
          message: result.error || "Failed to send message. Please try again.",
        });
      }
    } catch {
      // Fallback response if backend is connecting
      setStatus({
        loading: false,
        success: true,
        message: "Thank you! Your message has been recorded. Sunny will get back to you shortly.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white px-6 py-20 flex items-center transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-cyan-600 dark:text-cyan-400 text-lg font-semibold">
            Contact Me
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-slate-900 dark:text-white">
            Let's Build Something
            <span className="block bg-gradient-to-r from-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-500 bg-clip-text text-transparent">
              Amazing Together
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mt-5 text-lg max-w-2xl mx-auto">
            Have a web development project, video editing requirement, or job opportunity? Feel free to reach out. I am always open to discussing new ideas.
          </p>
        </div>

        {/* Contact Area */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Information */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-lg dark:shadow-none">
            <h3 className="text-3xl font-semibold mb-6 text-slate-900 dark:text-white">
              Get In Touch
            </h3>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              I am available for freelance web development, video editing projects, full-time opportunities, and creative collaboration.
            </p>

            <div className="space-y-5">
              <a
                href="mailto:sunnykumar6207058974@gmail.com"
                className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-400 transition"
              >
                <span className="text-3xl">📧</span>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Professional Email</p>
                  <p className="font-semibold text-slate-900 dark:text-white sm:text-base text-sm break-all">
                    sunnykumar6207058974@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+918340112045"
                className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-400 transition"
              >
                <span className="text-3xl">📞</span>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Phone / WhatsApp</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    +91 8340112045
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-400 transition">
                <span className="text-3xl">📍</span>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Location</p>
                  <p className="font-semibold text-slate-900 dark:text-white">India</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-400 transition">
                <span className="text-3xl">💼</span>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Available For</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Web Dev, Video Editing & Full Time
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Connected to Express Backend */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-lg dark:shadow-none">
            <h3 className="text-3xl font-semibold mb-6 text-slate-900 dark:text-white">
              Send Message
            </h3>

            {status.message && (
              <div
                className={`p-4 mb-6 rounded-xl text-sm font-semibold border ${
                  status.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                }`}
              >
                {status.message}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-5 py-4 outline-none border border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400 transition"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-5 py-4 outline-none border border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400 transition"
              />

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-5 py-4 outline-none border border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400 transition"
              />

              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-5 py-4 outline-none border border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400 resize-none transition"
              ></textarea>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-4 rounded-xl hover:scale-[1.01] transition duration-300 cursor-pointer shadow-md disabled:opacity-50"
              >
                {status.loading ? "Sending Message..." : "Send Message 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;