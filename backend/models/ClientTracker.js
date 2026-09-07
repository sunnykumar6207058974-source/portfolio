import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["completed", "in-progress", "pending"],
    default: "pending",
  },
  completedDate: {
    type: String,
    default: "",
  },
});

const activityLogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  tag: {
    type: String,
    enum: ["Feature", "UI / Design", "Bug Fix", "Database", "Payment", "Deployment"],
    default: "Feature",
  },
  previewUrl: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const clientTrackerSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      trim: true,
      default: "",
    },
    clientPhone: {
      type: String,
      trim: true,
      default: "",
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    trackingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 15,
    },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Testing / QA", "Completed", "On Hold"],
      default: "In Progress",
    },
    currentPhase: {
      type: String,
      default: "Core Development",
    },
    startDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    estimatedDelivery: {
      type: String,
      default: "TBD",
    },
    livePreviewUrl: {
      type: String,
      default: "",
    },
    figmaUrl: {
      type: String,
      default: "",
    },
    scope: [
      {
        type: String,
      },
    ],
    milestones: [milestoneSchema],
    activityLog: [activityLogSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    bufferCommands: false,
    autoIndex: false,
  }
);

export const ClientTracker = mongoose.model("ClientTracker", clientTrackerSchema);
