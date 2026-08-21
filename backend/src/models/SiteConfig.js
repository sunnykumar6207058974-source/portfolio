import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema(
  {
    websiteInfo: {
      name: { type: String, default: "Sunny Kumar" },
      title: { type: String, default: "Full-Stack Web Developer & Video Editor" },
      email: { type: String, default: "sunnykumar6207058974@gmail.com" },
      phone: { type: String, default: "+91 8340112045" },
      location: { type: String, default: "India" },
      bio: { type: String, default: "Passionate developer building high-performance web apps." },
      resumeUrl: { type: String, default: "/Sunny_Kumar_Resume.pdf" },
    },
    heroSection: {
      greeting: { type: String, default: "Hello, I'm" },
      name: { type: String, default: "Sunny Kumar" },
      titles: [{ type: String }],
      headline: { type: String, default: "Full-Stack Web Developer & Video Editor" },
      bio: { type: String, default: "Building modern websites & crafting visual video experiences." },
      avatarImage: { type: String, default: "/assets/profile.jpg" },
    },
    socialLinks: {
      github: { type: String, default: "https://github.com/sunny" },
      linkedin: { type: String, default: "https://linkedin.com/in/sunny" },
      twitter: { type: String, default: "https://twitter.com/sunny" },
      instagram: { type: String, default: "https://instagram.com/sunny" },
      youtube: { type: String, default: "https://youtube.com/sunny" },
      email: { type: String, default: "mailto:sunnykumar6207058974@gmail.com" },
    },
    seoSettings: {
      metaTitle: { type: String, default: "Sunny Kumar | Full-Stack Developer & Video Editor Portfolio" },
      metaDescription: { type: String, default: "Portfolio of Sunny Kumar - Full-Stack Web Developer & Video Editor specializing in React, Node.js, and motion graphics." },
      keywords: [{ type: String }],
      ogImage: { type: String, default: "/assets/profile.jpg" },
    },
  },
  {
    timestamps: true,
  }
);

export const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);
