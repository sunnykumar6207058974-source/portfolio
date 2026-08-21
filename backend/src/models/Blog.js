import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
    },
    author: {
      type: String,
      default: "Sunny Kumar",
    },
    category: {
      type: String,
      default: "Web Development",
    },
    coverImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
    },
    tags: [
      {
        type: String,
      },
    ],
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.model("Blog", blogSchema);
