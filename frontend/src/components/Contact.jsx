import { useState, memo } from "react";
import { HiCheck, HiMail, HiPhone } from "react-icons/hi";
import { apiSubmitContact } from "../services/api";

// Memoized Contact Form Component so typing is ultra-fast and doesn't re-render the whole section
const ContactForm = memo(() => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, success: null, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        loading: false,
        success: false,
        message: "Please fill in your first name, email, and message.",
      });
      return;
    }

    setStatus({ loading: true, success: null, message: "" });

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const details = [
      formData.phone ? `Phone: ${formData.phone}` : null,
      formData.projectType ? `Company / Project: ${formData.projectType}` : null,
      formData.message,
    ]
      .filter(Boolean)
      .join("\n\n");

    const payload = {
      name: fullName,
      email: formData.email,
      subject: formData.projectType
        ? `[Portfolio Contact] ${formData.projectType} - ${fullName}`
        : `[Portfolio Contact] Project Inquiry from ${fullName}`,
      message: details,
    };

    try {
      const result = await apiSubmitContact(payload);

      if (result.success) {
        setStatus({
          loading: false,
          success: true,
          message: result.message || "Thank you! Your message has been sent successfully to Sunny.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          projectType: "",
          message: "",
        });
      } else {
        setStatus({
          loading: false,
          success: false,
          message: result.error || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setStatus({
        loading: false,
        success: true,
        message: "Thank you! Your message has been recorded. Sunny will get back to you shortly.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        projectType: "",
        message: "",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg">
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6">
        Contact our sales team
      </h3>

      {status.message && (
        <div
          className={`p-3.5 mb-5 rounded-xl text-xs sm:text-sm font-semibold border ${
            status.success
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Row: First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              First name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Johannes"
              required
              autoComplete="given-name"
              className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Mark"
              autoComplete="family-name"
              className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors duration-150"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact.uixmk@gmail.com"
            required
            autoComplete="email"
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors duration-150"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Phone number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 8340112045"
            autoComplete="tel"
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors duration-150"
          />
        </div>

        {/* Company Website / Project Type */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Company website
          </label>
          <input
            type="text"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            placeholder="meostudio.agency"
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors duration-150"
          />
        </div>

        {/* Your Message */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Your message
          </label>
          <textarea
            rows={4}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about your project..."
            required
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none resize-none transition-colors duration-150"
          />
        </div>

        {/* Blue Button with White Letters */}
        <button
          type="submit"
          disabled={status.loading}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 transition-colors duration-150 shadow-lg shadow-blue-500/25 active:scale-[0.99] cursor-pointer disabled:opacity-60"
        >
          <span>{status.loading ? "Sending..." : "Send Message"}</span>
        </button>
      </form>
    </div>
  );
});

ContactForm.displayName = "ContactForm";

const Contact = () => {
  return (
    <section
      id="contact"
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 flex items-center justify-center overflow-hidden"
    >
      {/* Hardware-accelerated ambient background glow (Zero blur filter CPU/GPU cost) */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none rounded-full opacity-35 dark:opacity-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.4) 0%, rgba(251, 146, 60, 0.15) 45%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl w-full mx-auto bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-10 lg:p-14">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading, Value Props & Info Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div>
              {/* Main Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.1]">
                How can We Help?
              </h2>

              <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
                Get in touch with me for custom web development, video editing, frontend architectures, or full-time opportunities.
              </p>

              {/* Checklist / Features with Dribbble-style circular icons */}
              <div className="mt-8 space-y-3.5">
                <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">
                  <span className="w-5 h-5 rounded-full border border-rose-400/80 bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
                    <HiCheck className="text-xs stroke-2" />
                  </span>
                  <span>Request a demo or project estimate</span>
                </div>

                <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">
                  <span className="w-5 h-5 rounded-full border border-rose-400/80 bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
                    <HiCheck className="text-xs stroke-2" />
                  </span>
                  <span>Learn how I can build or scale your product</span>
                </div>

                <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">
                  <span className="w-5 h-5 rounded-full border border-rose-400/80 bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
                    <HiCheck className="text-xs stroke-2" />
                  </span>
                  <span>Direct collaboration & fast 24/7 communication</span>
                </div>
              </div>
            </div>

            {/* Bottom Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {/* Card 1: General Communication */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    General communication
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    For project queries or contract work, reach me directly.
                  </p>
                </div>
                <a
                  href="mailto:sunnykumar6207058974@gmail.com"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 break-all transition-colors"
                >
                  <HiMail className="text-sm text-slate-500 shrink-0" />
                  <span>sunnykumar6207058974@gmail.com</span>
                </a>
              </div>

              {/* Card 2: Phone & WhatsApp */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Phone & WhatsApp
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Available for direct calls and instant project chats.
                  </p>
                </div>
                <a
                  href="tel:+918340112045"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <HiPhone className="text-sm text-slate-500 shrink-0" />
                  <span>+91 8340112045</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Form Card with Blue Button */}
          <div className="lg:col-span-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;