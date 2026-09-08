const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://portfolio-r0ji.onrender.com/api"
    : "http://localhost:5001/api");

/**
 * Universal Fetch Helper for PixelForge API
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const { method = "GET", body = null, token = null, headers = {}, timeout = 12000 } = options;

  const authToken = token || localStorage.getItem("pixelforge_accessToken");

  const reqHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (authToken) {
    reqHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config = {
    method,
    headers: reqHeaders,
    signal: controller.signal,
  };

  if (body) {
    config.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  try {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    let data;
    try {
      data = await response.json();
    } catch {
      data = { success: response.ok };
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data.error || data.message || `HTTP ${response.status} Error`,
        data: null,
      };
    }

    return {
      success: true,
      status: response.status,
      ...data,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: err.name === "AbortError" 
        ? "Request timed out. Please try again." 
        : (err.message || "Network Error: Unable to connect to backend server."),
      data: null,
    };
  }
};

/* ==================== PROJECTS API ==================== */
export const apiGetProjects = (category) =>
  fetchAPI(`/projects${category && category !== "All" ? `?category=${category}` : ""}`);

export const apiGetProjectById = (id) => fetchAPI(`/projects/${id}`);

export const apiCreateProject = (projectData) =>
  fetchAPI("/projects", { method: "POST", body: projectData });

export const apiUpdateProject = (id, projectData) =>
  fetchAPI(`/projects/${id}`, { method: "PUT", body: projectData });

export const apiDeleteProject = (id) =>
  fetchAPI(`/projects/${id}`, { method: "DELETE" });

/* ==================== SERVICES API ==================== */
export const apiGetServices = () => fetchAPI("/services");

export const apiCreateService = (serviceData) =>
  fetchAPI("/services", { method: "POST", body: serviceData });

export const apiUpdateService = (id, serviceData) =>
  fetchAPI(`/services/${id}`, { method: "PUT", body: serviceData });

export const apiDeleteService = (id) =>
  fetchAPI(`/services/${id}`, { method: "DELETE" });

/* ==================== SKILLS API ==================== */
export const apiGetSkills = () => fetchAPI("/skills");

export const apiCreateSkill = (skillData) =>
  fetchAPI("/skills", { method: "POST", body: skillData });

export const apiUpdateSkill = (id, skillData) =>
  fetchAPI(`/skills/${id}`, { method: "PUT", body: skillData });

export const apiDeleteSkill = (id) =>
  fetchAPI(`/skills/${id}`, { method: "DELETE" });

/* ==================== CONTACT MESSAGES API ==================== */
export const apiSubmitContact = async (contactData) => {
  // On live Vercel site, call Vercel Serverless Function (where SMTP port 465 is open)
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, ...data };
      }
    } catch (err) {
      console.warn("Vercel contact serverless fallback to backend:", err);
    }
  }

  // Local development fallback
  return fetchAPI("/contact", { method: "POST", body: contactData });
};

export const apiGetContactMessages = () => fetchAPI("/contact");

export const apiDeleteContactMessage = (id) =>
  fetchAPI(`/contact/${id}`, { method: "DELETE" });

/* ==================== AUTHENTICATION API ==================== */
export const apiLoginUser = (email, password) =>
  fetchAPI("/auth/login", { method: "POST", body: { email, password } });

export const apiGetMe = () => fetchAPI("/auth/me");

/* ==================== ADMIN & SITE CONFIG API ==================== */
export const apiGetDashboardData = () => fetchAPI("/admin/dashboard");

export const apiGetSiteConfig = () => fetchAPI("/config");

export const apiUpdateSiteConfig = (configData) =>
  fetchAPI("/config", { method: "PUT", body: configData });

/* ==================== CLIENT PROJECT TRACKER API ==================== */
export const apiGetTrackerByCode = (code) => fetchAPI(`/tracker/${code}`);

export const apiGetAllTrackers = () => fetchAPI("/tracker");

export const apiCreateTracker = (trackerData) =>
  fetchAPI("/tracker", { method: "POST", body: trackerData });

export const apiUpdateTrackerProgress = (id, progressData) =>
  fetchAPI(`/tracker/${id}/progress`, { method: "PUT", body: progressData });

export const apiAddTrackerLog = (id, logData) =>
  fetchAPI(`/tracker/${id}/log`, { method: "POST", body: logData });

export const apiUpdateTrackerMilestones = (id, milestones) =>
  fetchAPI(`/tracker/${id}/milestones`, { method: "PUT", body: { milestones } });

export const apiUpdateTrackerScope = (id, scope) =>
  fetchAPI(`/tracker/${id}/scope`, { method: "PUT", body: { scope } });

export const apiDeleteTracker = (id) =>
  fetchAPI(`/tracker/${id}`, { method: "DELETE" });


