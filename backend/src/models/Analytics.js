import mongoose from "mongoose";

const visitorEventSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      enum: ["page_view", "project_view", "contact_click", "resume_download"],
      default: "page_view",
    },
    device: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet"],
      default: "Desktop",
    },
    path: {
      type: String,
      default: "/",
    },
    projectId: {
      type: String,
      default: null,
    },
    projectTitle: {
      type: String,
      default: null,
    },
    ipHash: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const analyticsSummarySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "global_summary",
    },
    totalVisitors: {
      type: Number,
      default: 1420,
    },
    projectViews: {
      type: Number,
      default: 3890,
    },
    devices: {
      Desktop: { type: Number, default: 880 },
      Mobile: { type: Number, default: 440 },
      Tablet: { type: Number, default: 100 },
    },
    monthlyStats: [
      {
        month: { type: String, required: true },
        visitors: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        requests: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const VisitorEvent = mongoose.model("VisitorEvent", visitorEventSchema);
export const AnalyticsSummary = mongoose.model("AnalyticsSummary", analyticsSummarySchema);
