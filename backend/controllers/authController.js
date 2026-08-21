import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const memoryUsers = [];

// @desc    Register Admin / User
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user;
    try {
      const userExists = await User.findOne({ email }).timeout(2000);
      if (userExists) {
        return res.status(400).json({ success: false, error: "User already exists with this email" });
      }

      user = await User.create({
        name,
        email,
        password,
        role: role || "admin",
      });
    } catch {
      // In-memory fallback mode
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        email,
        password: hashedPassword,
        role: role || "admin",
      };
      memoryUsers.push(user);
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Authenticate User & Get JWT Token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user;
    let isMatch = false;

    try {
      user = await User.findOne({ email }).timeout(2000);
      if (user) {
        isMatch = await user.matchPassword(password);
      }
    } catch {
      user = memoryUsers.find((u) => u.email === email);
      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
// @access  Private (Protected by JWT)
export const getMe = async (req, res) => {
  return res.json({
    success: true,
    data: req.user,
  });
};
