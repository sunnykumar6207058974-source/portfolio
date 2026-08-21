import { SiteConfig } from "../models/SiteConfig.js";

const defaultConfig = {
  websiteInfo: {
    name: "Sunny Kumar",
    title: "Full-Stack Web Developer & Video Editor",
    email: "sunnykumar6207058974@gmail.com",
    phone: "+91 8340112045",
    location: "India",
    bio: "Passionate developer building high-performance web apps and crafting visual media.",
    resumeUrl: "/Sunny_Kumar_Resume.pdf",
  },
  heroSection: {
    greeting: "Hello, I'm",
    name: "Sunny Kumar",
    titles: ["Full-Stack Web Developer", "Video Editor", "MERN Stack Engineer"],
    headline: "Full-Stack Web Developer & Video Editor",
    bio: "Building modern websites & crafting visual video experiences.",
    avatarImage: "/assets/profile.jpg",
  },
  socialLinks: {
    github: "https://github.com/sunny",
    linkedin: "https://linkedin.com/in/sunny",
    twitter: "https://twitter.com/sunny",
    instagram: "https://instagram.com/sunny",
    youtube: "https://youtube.com/sunny",
    email: "mailto:sunnykumar6207058974@gmail.com",
  },
  seoSettings: {
    metaTitle: "Sunny Kumar | Full-Stack Developer & Video Editor Portfolio",
    metaDescription: "Portfolio of Sunny Kumar - Full-Stack Web Developer & Video Editor specializing in React, Node.js, and motion graphics.",
    keywords: ["Sunny Kumar", "Web Developer", "React Developer", "Video Editor"],
    ogImage: "/assets/profile.jpg",
  },
};

let memoryConfig = { ...defaultConfig };

// GET /api/config - Get current site configuration & SEO settings
export const getSiteConfig = async (req, res) => {
  try {
    let config;
    try {
      config = await SiteConfig.findOne().timeout(1500);
      if (!config) config = memoryConfig;
    } catch {
      config = memoryConfig;
    }

    return res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/config - Update Website Info, Hero Section, Social Links, or SEO Settings (Protected)
export const updateSiteConfig = async (req, res) => {
  try {
    const { websiteInfo, heroSection, socialLinks, seoSettings } = req.body;

    let updatedConfig;
    try {
      let config = await SiteConfig.findOne().timeout(1500);
      if (config) {
        if (websiteInfo) config.websiteInfo = { ...config.websiteInfo, ...websiteInfo };
        if (heroSection) config.heroSection = { ...config.heroSection, ...heroSection };
        if (socialLinks) config.socialLinks = { ...config.socialLinks, ...socialLinks };
        if (seoSettings) config.seoSettings = { ...config.seoSettings, ...seoSettings };
        updatedConfig = await config.save();
      } else {
        updatedConfig = await SiteConfig.create({
          websiteInfo,
          heroSection,
          socialLinks,
          seoSettings,
        });
      }
    } catch {
      if (websiteInfo) memoryConfig.websiteInfo = { ...memoryConfig.websiteInfo, ...websiteInfo };
      if (heroSection) memoryConfig.heroSection = { ...memoryConfig.heroSection, ...heroSection };
      if (socialLinks) memoryConfig.socialLinks = { ...memoryConfig.socialLinks, ...socialLinks };
      if (seoSettings) memoryConfig.seoSettings = { ...memoryConfig.seoSettings, ...seoSettings };
      updatedConfig = memoryConfig;
    }

    return res.json({
      success: true,
      message: "Website Configuration & SEO Settings updated successfully",
      data: updatedConfig,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/config/upload-resume - Upload a new Resume file (Protected)
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No PDF file uploaded" });
    }

    const timestamp = Date.now();
    const uploadedResumeUrl = `/uploads/${req.file.filename}?t=${timestamp}`;

    let updatedConfig;
    try {
      let config = await SiteConfig.findOne().timeout(1500);
      if (config) {
        config.websiteInfo = { ...config.websiteInfo, resumeUrl: uploadedResumeUrl };
        updatedConfig = await config.save();
      } else {
        updatedConfig = await SiteConfig.create({
          websiteInfo: { ...defaultConfig.websiteInfo, resumeUrl: uploadedResumeUrl },
          heroSection: defaultConfig.heroSection,
          socialLinks: defaultConfig.socialLinks,
          seoSettings: defaultConfig.seoSettings,
        });
      }
    } catch {
      memoryConfig.websiteInfo.resumeUrl = uploadedResumeUrl;
      updatedConfig = memoryConfig;
    }

    return res.json({
      success: true,
      message: "Resume PDF uploaded and updated successfully!",
      resumeUrl: uploadedResumeUrl,
      data: updatedConfig,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
