import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const { verifyOTP, resendOTP, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, email, name } = location.state || {};

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }

    if (!userId || !email) {
      navigate("/register", { replace: true });
    }
  }, [isAuthenticated, userId, email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOTP(userId, otp);
      if (result.success) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const result = await resendOTP(userId);
      if (result.success) {
        setTimeLeft(300); // Reset timer
        setOtp(""); // Clear OTP input
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to
          </p>
          <p className="text-sm font-medium text-blue-600">{email}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="form-label text-center block">
              Enter verification code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength="6"
              className="form-input text-center text-2xl font-mono tracking-widest"
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
            />
            <div className="mt-2 text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-500">
                  Code expires in {formatTime(timeLeft)}
                </p>
              ) : (
                <p className="text-sm text-red-600">Code expired</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full btn-primary py-3 text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verify Email
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading || timeLeft > 0}
              className="w-full btn-secondary py-2"
            >
              {resendLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-t-2 border-b-2 border-gray-600 rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Code
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={handleResendOTP}
              disabled={timeLeft > 0}
              className="font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
            >
              resend code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
