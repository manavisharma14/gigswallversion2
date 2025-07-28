'use client';

import { Mail, Lock, Phone, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const inputClass =
  "w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] text-[#4B3BB3] placeholder-gray-400 bg-white";

const iconClass =
  "absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3]";

const barColors = ["bg-red-500", "bg-yellow-400", "bg-green-400", "bg-green-600"];

interface SignupStepOneProps {
  formData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SignupStepOne({ formData, handleChange }: SignupStepOneProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strengthLevel, setStrengthLevel] = useState(0);
  const [showStrength, setShowStrength] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const evaluatePasswordStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;
    return score;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleChange(e);
    if (value.length > 0) {
      setShowStrength(true);
      setStrengthLevel(evaluatePasswordStrength(value));
    } else {
      setShowStrength(false);
      setStrengthLevel(0);
    }
  };

  const sendOtp = async () => {
    try {
      await axios.post("/api/auth/send-otp", { email: formData.email });
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Failed to send OTP";
      toast.error(errorMessage);
    }
  };
  
  // comment
  const verifyOtp = async () => {
    try {
      const res = await axios.post("/api/auth/verify-otp", {
        email: formData.email,
        otp,
      });
  
      if (res.data.success) {
        toast.success("OTP verified!");
        setOtpVerified(true);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Failed to verify OTP";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {/* Name */}
      <div className="relative mb-4">
        <User className={iconClass} size={20} />
        <input
          type="text"
          name="name"
          placeholder="Name"
          className={inputClass}
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Email with embedded Send OTP button */}
      <div className="relative mb-4">
        <Mail className={iconClass} size={20} />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={`${inputClass} pr-32`}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={sendOtp}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#4B3BB3] text-white text-sm px-3 py-1 rounded-md hover:bg-[#372a9f]"
        >
          {otpSent ? "Resend" : "Send OTP"}
        </button>
      </div>

      {/* OTP Input and Verify */}
      {!otpVerified && otpSent && (
        <>
          <div className="relative mb-2">
            <ShieldCheck className={iconClass} size={20} />
            <input
              type="text"
              placeholder="Enter OTP"
              className={inputClass}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={verifyOtp}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 mb-4"
          >
            Verify OTP
          </button>
        </>
      )}

      {otpVerified && (
        <p className="text-green-600 font-semibold mb-4">OTP Verified ✅</p>
      )}

      {/* Password */}
      <div className="relative mb-2">
        <Lock className={iconClass} size={20} />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          className={inputClass}
          value={formData.password}
          onChange={handlePasswordChange}
          required
        />
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3] cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      </div>

      {/* Password Strength */}
      {showStrength && (
        <div className="mb-4 mt-1 flex justify-end gap-[6px] pr-1">
          {[1, 2, 3, 4].map((bar) => {
            const filled = strengthLevel >= bar;
            return (
              <div
                key={bar}
                className={`w-5 h-1.5 rounded-full transition-colors duration-300 ${
                  filled ? barColors[bar - 1] : "bg-gray-300"
                }`}
              ></div>
            );
          })}
        </div>
      )}

      {/* Phone Number */}
      <div className="relative mb-4">
        <Phone className={iconClass} size={20} />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className={inputClass}
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
    </>
  );
}