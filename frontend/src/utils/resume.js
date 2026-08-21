export const resolveResumeUrl = (rawUrl) => {
  if (!rawUrl) return "/Sunny_Kumar_Resume.pdf";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }
  if (rawUrl.startsWith("/uploads")) {
    return `http://localhost:5001${rawUrl}`;
  }
  return rawUrl;
};

export const fetchSiteConfig = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/config");
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch {
    // Return null fallback
  }
  return null;
};
