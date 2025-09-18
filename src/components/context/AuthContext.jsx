import React, { createContext, useContext, useReducer, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await api.get("/auth/me");

      dispatch({ type: "SET_USER", payload: response.data.user });
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      dispatch({ type: "SET_USER", payload: user });
      toast.success("Login successful!");

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return {
        success: false,
        error: message,
        userId: error.response?.data?.userId,
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      toast.success(
        "Registration successful! Please check your email for OTP."
      );
      return {
        success: true,
        userId: response.data.userId,
      };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Verify OTP function
  const verifyOTP = async (userId, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", { userId, otp });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      dispatch({ type: "SET_USER", payload: user });
      toast.success("Email verified successfully!");

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "OTP verification failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Resend OTP function
  const resendOTP = async (userId) => {
    try {
      await api.post("/auth/resend-otp", { userId });
      toast.success("OTP sent successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully!");
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  const value = {
    ...state,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
