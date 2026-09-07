import { Project } from "../models/Project.js";
import { Service } from "../models/Service.js";
import { Skill } from "../models/Skill.js";
import { User } from "../models/User.js";
import { Contact } from "../models/Contact.js";
import { SiteConfig } from "../models/SiteConfig.js";

export const seedDatabase = async () => {
  try {
    // 1. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: "Cartify - Premium E-Commerce Shopping Platform",
          category: "E-Commerce",
          description:
            "A premium e-commerce platform offering smooth shopping experiences, product categories, interactive cart checkout, dark mode toggle, and instant dispatch tracking.",
          image: "/assets/projects/cartify.jpg",
          tech: ["React", "Node.js", "Tailwind CSS", "MongoDB", "Express"],
          features: [
            "Interactive Shopping Cart & Express Checkout",
            "Category Filters & Product Search Bar",
            "Dark / Light Theme & 24/7 Express Support",
          ],
          demoUrl: "https://cartify-store-amber.vercel.app",
          githubUrl: "https://github.com/sunnykumar6207058974-source/Cartify",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        },
        {
          title: "UrbanThread - Luxe Sneakers & Streetwear Drops",
          category: "E-Commerce",
          description:
            "A high-end streetwear e-commerce platform featuring exclusive sneaker drops, flash sales, promo code discount engine, wishlist, and admin dashboard.",
          image: "/assets/projects/urbanthread.jpg",
          tech: ["React", "Tailwind CSS", "Redux", "REST API", "Vite"],
          features: [
            "Sneakerhead Drops & Flash Deal Banners",
            "Promo Code Discount Engine (SNEAKER20)",
            "Wishlist, Cart Drawer & Admin Analytics Dashboard",
          ],
          demoUrl: "https://urban-thread-sand.vercel.app",
          githubUrl: "https://github.com/sunnykumar6207058974-source/UrbanThread",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        },
        {
          title: "PixelForge - Developer Portfolio & Digital Showcase",
          category: "Web Apps",
          description:
            "A futuristic developer portfolio featuring interactive canvas particle network, animated typing hero, project demo video popups, custom cursor, and printable resume viewer.",
          image: "/assets/projects/pixelforge.jpg",
          tech: ["React", "Framer Motion", "Tailwind CSS", "HTML5 Canvas", "Vite"],
          features: [
            "Interactive HTML5 Canvas Particle Field",
            "Full Video Walkthrough Modals & Auto-Play Hover",
            "Dark / Light Theme System & Printable Resume Viewer",
          ],
          demoUrl: "https://portfolio-iota-six-26.vercel.app",
          githubUrl: "https://github.com/sunnykumar6207058974-source/portfolio",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        },
        {
          title: "Aetheria - Immersive WebGL 3D Matrix Experience",
          category: "WebGL 3D",
          description:
            "A cutting-edge 3D WebGL digital experience featuring interactive particle torus matrix, audio frequency controls, 60 FPS graphics engine, and full-stack SaaS architecture.",
          image: "/assets/projects/aetheria.jpg",
          tech: ["React", "Three.js / WebGL", "Framer Motion", "Node.js", "GraphQL"],
          features: [
            "WebGL 60 FPS 3D Matrix & Torus Particles",
            "Audio Sound FX & Interactive Storytelling",
            "Zero-Trust API Architecture & Ultra Fast Load (<0.8s)",
          ],
          demoUrl: "https://aetheria-3d.vercel.app",
          githubUrl: "https://github.com/sunny/aetheria",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        },
      ]);
      console.log("🌱 Database Seeder: Projects collection seeded");
    }

    // 2. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany([
        {
          title: "Web Development",
          badge: "Frontend & Full-Stack",
          description: "Building fast, responsive, and modern websites using React.js, JavaScript, Tailwind CSS, and sub-second performance architectures.",
          image: "/assets/services/web_dev.png",
        },
        {
          title: "Video Editing & Motion Graphics",
          badge: "Visual & Motion",
          description: "Crafting high-engagement video content, multi-track cutting, color grading, audio synchronization, and promo reels for digital brands.",
          image: "/assets/services/video_editing.png",
        },
        {
          title: "Backend API Development",
          badge: "APIs & Databases",
          description: "Creating secure, scalable backend server systems with Node.js, Express, MongoDB databases, RESTful endpoints, and authentication.",
          image: "/assets/services/backend.png",
        },
        {
          title: "E-Commerce Solutions",
          badge: "Shopping Platforms",
          description: "Developing complete online stores with 3D product cards, cart checkout drawers, flash sale engines, and payment gateway integrations.",
          image: "/assets/services/ecommerce.png",
        },
        {
          title: "Responsive Interface Design",
          badge: "UI/UX & Mobile First",
          description: "Designing glassmorphic, mobile-friendly user interfaces that deliver fluid user experiences across smartphone, tablet, and desktop viewports.",
          image: "/assets/services/ui_ux.png",
        },
        {
          title: "Cloud Deployment & Support",
          badge: "Cloud & DevOps",
          description: "Deploying production-ready applications on Vercel, Netlify, and cloud servers with 99.99% uptime, CI/CD pipelines, and SEO optimization.",
          image: "/assets/services/deployment.png",
        },
      ]);
      console.log("🌱 Database Seeder: Services collection seeded");
    }

    // 3. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        {
          title: "Frontend Development",
          category: "Frontend",
          badge: "UI & Web Frontend",
          skills: "React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Vite",
          level: "95%",
          image: "/assets/skills/frontend.png",
        },
        {
          title: "Backend Development",
          category: "Backend",
          badge: "Server Architecture",
          skills: "Node.js, Express.js, REST APIs, GraphQL, Microservices",
          level: "90%",
          image: "/assets/skills/backend.png",
        },
        {
          title: "Video Editing & Motion Graphics",
          category: "Creative Media",
          badge: "Creative Media",
          skills: "Adobe Premiere, DaVinci Resolve, Motion FX, Sound Design",
          level: "92%",
          image: "/assets/skills/video.png",
        },
        {
          title: "Database Systems",
          category: "Database",
          badge: "Data & Storage",
          skills: "MongoDB, Mongoose, MySQL, Firebase Firestore, PostgreSQL",
          level: "85%",
          image: "/assets/skills/database.png",
        },
        {
          title: "AI & Machine Learning",
          category: "AI",
          badge: "AI Systems",
          skills: "Python, OpenAI APIs, Prompt Engineering, Neural Networks",
          level: "80%",
          image: "/assets/skills/ai_ml.png",
        },
        {
          title: "Tools & Cloud Deployment",
          category: "DevOps",
          badge: "DevOps & Cloud",
          skills: "Git, GitHub, Vercel, Netlify, Docker, CI/CD Pipelines",
          level: "90%",
          image: "/assets/skills/tools_cloud.png",
        },
      ]);
      console.log("🌱 Database Seeder: Skills collection seeded");
    }

    // 4. Seed Admin User
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({
        name: "Sunny Kumar",
        email: "sunnykumar6207058974@gmail.com",
        password: "sunnypassword123",
        role: "admin",
      });
      console.log("🌱 Database Seeder: Admin user created");
    }

    // 5. Seed Initial Messages
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      await Contact.insertMany([
        {
          name: "Alex Rivers",
          email: "alex@example.com",
          subject: "Web Development Project Proposal",
          message: "Hi Sunny, we want to hire you for building a custom React & Node.js application.",
          status: "unread",
        },
        {
          name: "Sarah Jenkins",
          email: "sarah@techcorp.io",
          subject: "Video Editing & Motion Reel Contract",
          message: "Loved your video editing portfolio! Are you open for freelance motion graphics work?",
          status: "read",
        },
      ]);
      console.log("🌱 Database Seeder: Contact messages collection seeded");
    }

    // 6. Seed SiteConfig
    const configCount = await SiteConfig.countDocuments();
    if (configCount === 0) {
      await SiteConfig.create({
        websiteInfo: {
          name: "Sunny Kumar",
          headline: "Full-Stack Web Developer & Video Editor",
          email: "sunnykumar6207058974@gmail.com",
          phone: "+91 8340112045",
          location: "India",
          bio: "Passionate developer building high-performance web apps.",
          resumeUrl: "/Sunny_Kumar_Resume.pdf",
        },
        heroSection: {
          name: "Sunny Kumar",
          headline: "Full-Stack Web Developer & Video Editor",
          bio: "Building high-performance React web applications & visual video experiences.",
        },
        socialLinks: {
          github: "https://github.com/sunny",
          linkedin: "https://linkedin.com/in/sunny",
        },
        seoSettings: {
          metaTitle: "Sunny Kumar | PixelForge Developer Portfolio",
          metaDescription: "Official developer portfolio of Sunny Kumar - Full-Stack Developer & Video Editor.",
        },
      });
      console.log("🌱 Database Seeder: SiteConfig collection seeded");
    }
  } catch (error) {
    console.warn("⚠️ Seeding notice:", error.message);
  }
};
