import { createContext, useContext, useState, useEffect } from "react";
import { apiLoginUser, fetchAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted authentication state from localStorage
    const savedUser = localStorage.getItem("pixelforge_user");
    const savedToken = localStorage.getItem("pixelforge_accessToken");
    const savedRefresh = localStorage.getItem("pixelforge_refreshToken");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedToken);
        setRefreshToken(savedRefresh);
      } catch {
        localStorage.removeItem("pixelforge_user");
        localStorage.removeItem("pixelforge_accessToken");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await apiLoginUser(email, password);

      if (result.success && result.data) {
        const userData = result.data;
        setUser(userData);
        setAccessToken(userData.accessToken);
        setRefreshToken(userData.refreshToken);

        localStorage.setItem("pixelforge_user", JSON.stringify(userData));
        localStorage.setItem("pixelforge_accessToken", userData.accessToken);
        if (userData.refreshToken) {
          localStorage.setItem("pixelforge_refreshToken", userData.refreshToken);
        }

        return { success: true, message: result.message || "Login successful" };
      } else {
        return { success: false, error: result.error || "Login failed" };
      }
    } catch {
      // Demo Admin Fallback login if backend is connecting
      if (email === "sunnykumar6207058974@gmail.com" && (password === "sunny123456" || password === "sunnypassword123")) {
        const demoUser = {
          _id: "demo_admin_123",
          name: "Sunny Kumar",
          email: "sunnykumar6207058974@gmail.com",
          role: "admin",
          accessToken: "demo_access_token_jwt_2026",
          refreshToken: "demo_refresh_token_jwt_2026",
        };
        setUser(demoUser);
        setAccessToken(demoUser.accessToken);
        setRefreshToken(demoUser.refreshToken);

        localStorage.setItem("pixelforge_user", JSON.stringify(demoUser));
        localStorage.setItem("pixelforge_accessToken", demoUser.accessToken);
        localStorage.setItem("pixelforge_refreshToken", demoUser.refreshToken);

        return { success: true, message: "Logged in as Admin (Demo Mode)" };
      }

      return { success: false, error: "Invalid email or password" };
    }
  };

  const register = async (name, email, password, role = "admin") => {
    try {
      const result = await fetchAPI("/auth/register", {
        method: "POST",
        body: { name, email, password, role },
      });

      if (result.success && result.data) {
        const userData = result.data;
        setUser(userData);
        setAccessToken(userData.accessToken);
        setRefreshToken(userData.refreshToken);

        localStorage.setItem("pixelforge_user", JSON.stringify(userData));
        localStorage.setItem("pixelforge_accessToken", userData.accessToken);
        if (userData.refreshToken) {
          localStorage.setItem("pixelforge_refreshToken", userData.refreshToken);
        }

        return { success: true, message: result.message || "Account registered successfully" };
      } else {
        return { success: false, error: result.error || "Registration failed" };
      }
    } catch (err) {
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("pixelforge_user");
    localStorage.removeItem("pixelforge_accessToken");
    localStorage.removeItem("pixelforge_refreshToken");
  };

  const refreshSession = async () => {
    if (!refreshToken) return false;
    try {
      const result = await fetchAPI("/auth/refresh", {
        method: "POST",
        body: { refreshToken },
      });
      if (result.success && result.accessToken) {
        setAccessToken(result.accessToken);
        localStorage.setItem("pixelforge_accessToken", result.accessToken);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
