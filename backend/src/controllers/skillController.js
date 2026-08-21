import { Skill } from "../models/Skill.js";

const initialSkills = [
  {
    _id: "1",
    id: 1,
    badge: "UI & Web Frontend",
    title: "Frontend Development",
    skills: "React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Vite",
    level: "95%",
    image: "/assets/skills/frontend.png",
  },
  {
    _id: "2",
    id: 2,
    badge: "Server Architecture",
    title: "Backend Development",
    skills: "Node.js, Express.js, REST APIs, GraphQL, Microservices",
    level: "90%",
    image: "/assets/skills/backend.png",
  },
  {
    _id: "3",
    id: 3,
    badge: "Creative Media",
    title: "Video Editing & Motion Graphics",
    skills: "Adobe Premiere, DaVinci Resolve, Motion FX, Sound Design",
    level: "92%",
    image: "/assets/skills/video.png",
  },
  {
    _id: "4",
    id: 4,
    badge: "Data & Storage",
    title: "Database Systems",
    skills: "MongoDB, Mongoose, MySQL, Firebase Firestore, PostgreSQL",
    level: "85%",
    image: "/assets/skills/database.png",
  },
  {
    _id: "5",
    id: 5,
    badge: "AI Systems",
    title: "AI & Machine Learning",
    skills: "Python, OpenAI APIs, Prompt Engineering, Neural Networks",
    level: "80%",
    image: "/assets/skills/ai_ml.png",
  },
  {
    _id: "6",
    id: 6,
    badge: "DevOps & Cloud",
    title: "Tools & Cloud Deployment",
    skills: "Git, GitHub, Vercel, Netlify, Docker, CI/CD Pipelines",
    level: "90%",
    image: "/assets/skills/tools_cloud.png",
  },
];

let memorySkills = [...initialSkills];

// @desc    Get all skills
// @route   GET /api/skills or GET /skills
export const getSkills = async (req, res) => {
  try {
    let skills;
    try {
      skills = await Skill.find().timeout(1500);
      if (!skills || skills.length === 0) {
        skills = memorySkills;
      }
    } catch {
      skills = memorySkills;
    }

    return res.json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch skills" });
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id or GET /skills/:id
export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    let skill;

    try {
      skill = await Skill.findById(id).timeout(1500);
    } catch {
      skill = memorySkills.find((s) => s._id === id || s.id?.toString() === id);
    }

    if (!skill) {
      skill = memorySkills.find((s) => s._id === id || s.id?.toString() === id);
    }

    if (!skill) {
      return res.status(404).json({ success: false, error: `Skill with ID ${id} not found` });
    }

    return res.json({ success: true, data: skill });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new skill
// @route   POST /api/skills or POST /skills
export const createSkill = async (req, res) => {
  try {
    const { title, category, skills, level, image, badge } = req.body;

    if (!title || !skills) {
      return res.status(400).json({
        success: false,
        error: "Title and skills description are required fields",
      });
    }

    let newSkill;
    try {
      newSkill = await Skill.create({
        title,
        category: category || "General",
        skills,
        level: level || "90%",
        image: image || "/assets/skills/frontend.png",
        badge: badge || "Tech Badge",
      });
    } catch {
      newSkill = {
        _id: (memorySkills.length + 1).toString(),
        id: memorySkills.length + 1,
        title,
        category: category || "General",
        skills,
        level: level || "90%",
        image: image || "/assets/skills/frontend.png",
        badge: badge || "Tech Badge",
        createdAt: new Date(),
      };
      memorySkills.push(newSkill);
    }

    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: newSkill,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update existing skill
// @route   PUT /api/skills/:id or PUT /skills/:id
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updatedSkill;
    try {
      updatedSkill = await Skill.findByIdAndUpdate(id, updateData, { new: true }).timeout(1500);
    } catch {
      const index = memorySkills.findIndex((s) => s._id === id || s.id?.toString() === id);
      if (index !== -1) {
        memorySkills[index] = { ...memorySkills[index], ...updateData };
        updatedSkill = memorySkills[index];
      }
    }

    if (!updatedSkill) {
      const index = memorySkills.findIndex((s) => s._id === id || s.id?.toString() === id);
      if (index !== -1) {
        memorySkills[index] = { ...memorySkills[index], ...updateData };
        updatedSkill = memorySkills[index];
      }
    }

    if (!updatedSkill) {
      return res.status(404).json({ success: false, error: `Skill with ID ${id} not found` });
    }

    return res.json({
      success: true,
      message: "Skill updated successfully",
      data: updatedSkill,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete skill by ID
// @route   DELETE /api/skills/:id or DELETE /skills/:id
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = false;
    try {
      const skill = await Skill.findByIdAndDelete(id).timeout(1500);
      if (skill) deleted = true;
    } catch {
      const initialLength = memorySkills.length;
      memorySkills = memorySkills.filter((s) => s._id !== id && s.id?.toString() !== id);
      if (memorySkills.length < initialLength) deleted = true;
    }

    if (!deleted) {
      const initialLength = memorySkills.length;
      memorySkills = memorySkills.filter((s) => s._id !== id && s.id?.toString() !== id);
      if (memorySkills.length < initialLength) deleted = true;
    }

    if (!deleted) {
      return res.status(404).json({ success: false, error: `Skill with ID ${id} not found` });
    }

    return res.json({
      success: true,
      message: "Skill deleted successfully",
      data: { _id: id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
