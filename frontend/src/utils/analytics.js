import { apiTrackAnalytics } from "../services/api";

/**
 * Detect client device classification: Desktop, Mobile, or Tablet
 */
export const detectDevice = () => {
  if (typeof window === "undefined") return "Desktop";

  const ua = navigator.userAgent || "";
  const width = window.innerWidth;

  if (/ipad|tablet/i.test(ua) || (width >= 768 && width <= 1024)) {
    return "Tablet";
  }

  if (
    /mobile|iphone|android|blackberry|mini|windows\sce|palm/i.test(ua) ||
    width < 768
  ) {
    return "Mobile";
  }

  return "Desktop";
};

/**
 * Track user visit once per session to avoid artificial inflation
 */
export const trackPageView = async () => {
  if (typeof window === "undefined") return;

  try {
    const sessionKey = "pixelforge_visited_session";
    if (sessionStorage.getItem(sessionKey)) {
      return; // Already counted this browser session
    }

    const device = detectDevice();
    await apiTrackAnalytics({
      event: "page_view",
      device,
      path: window.location.pathname,
    });

    sessionStorage.setItem(sessionKey, "1");
  } catch {
    // Non-blocking telemetry
  }
};

/**
 * Track individual project view or click
 */
export const trackProjectView = async (projectId, projectTitle) => {
  try {
    const device = detectDevice();
    await apiTrackAnalytics({
      event: "project_view",
      device,
      projectId: String(projectId),
      projectTitle,
      path: window.location.pathname,
    });
  } catch {
    // Non-blocking telemetry
  }
};
