'use client';

import { useState, useCallback, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SignupStepOne from "./SignupStepOne";
import SignupStepTwo from "./SignupStepTwo";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  college: string;
  otherCollege: string;
  gradYear: string;
  aim: string;
  skills: string;
  bio: string;
  role: "student" | "external";
};

type PasswordStrength = "Weak" | "Medium" | "Strong";

function getPasswordStrength(password: string): PasswordStrength {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 1) return "Weak";
  if (strength === 2 || strength === 3) return "Medium";
  return "Strong";
}

export default function SignUpPage() {
  const router = useRouter();
  const [signupStep, setSignupStep] = useState(1);
  const [isStudent, setIsStudent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("Weak");

  const togglePassword = () => setShowPassword(!showPassword);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    college: "",
    otherCollege: "",
    gradYear: "",
    aim: "",
    skills: "",
    bio: "",
    role: "student",
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "college" && value !== "Others" ? { otherCollege: "" } : {}),
      }));

      if (name === "password" && !isStudent) {
        setPasswordStrength(getPasswordStrength(value));
      }
    },
    [isStudent]
  );

  const validateRequiredFields = () => {
    if (!formData.email || !formData.password) return false;

    if (isStudent) {
      const required = ["name", "college", "gradYear"];
      for (const field of required) {
        if (!formData[field as keyof FormData]) return false;
      }
      if (formData.college === "Others" && !formData.otherCollege) return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateRequiredFields()) {
      toast.error("Please fill all required fields.", { id: "missing-fields" });
      return;
    }

    setIsLoading(true);

    const payload = {
      ...formData,
      role: isStudent ? "student" : "external",
      college: isStudent
        ? formData.college === "Others"
          ? formData.otherCollege
          : formData.college
        : null,
      department: isStudent ? formData.department : null,
      gradYear: isStudent ? formData.gradYear : null,
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          document.cookie = `token=${data.token}; path=/`;
          document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/`;
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("userId", data.user.id);
          window.dispatchEvent(new Event("storageChanged"));
        }

        toast.success("Account created successfully 🚀", { id: "signup-success" });
        router.push("/dashboard");
      } else {
        toast.error(data?.error || "Something went wrong.", { id: "signup-error" });
      }
    } catch {
      toast.error("Signup failed.", { id: "signup-server-error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen overflow-hidden flex flex-col px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
      {/* Header */}
      <div className="w-full flex flex-col items-center justify-start mt-8 sm:mt-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#4B3BB3] text-center mb-4">
          Create Account
        </h2>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setIsStudent(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isStudent ? "bg-[#6B7FFF] text-white" : "bg-[#E5E4FB] text-[#4B3BB3]"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setIsStudent(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !isStudent ? "bg-[#6B7FFF] text-white" : "bg-[#E5E4FB] text-[#4B3BB3]"
            }`}
          >
            Not a Student
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full flex-1 space-y-6 mt-10 sm:mt-8">
        {isStudent ? (
          <>
            {signupStep === 1 && (
              <>
                <SignupStepOne formData={formData} handleChange={handleChange} />
                <button
                  type="button"
                  onClick={() => setSignupStep(2)}
                  className="w-full bg-[#6B7FFF] hover:bg-[#5A6FEF] text-white font-bold py-2 rounded-full"
                >
                  Next →
                </button>
              </>
            )}
            {signupStep === 2 && (
              <>
                <SignupStepTwo
                  formData={formData}
                  handleChange={handleChange}
                  setFormData={setFormData}
                />
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="w-full bg-gray-200 text-black font-bold py-2 rounded-full"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full font-bold py-2 rounded-full transition duration-200 ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#6B7FFF] hover:bg-[#5A6FEF] text-white"
                    }`}
                  >
                    {isLoading ? "Signing Up..." : "SIGN UP"}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3]"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full border border-gray-300 px-4 py-2 pl-10 rounded-md bg-white text-black"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3]"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full border border-gray-300 px-4 py-2 pl-10 pr-10 rounded-md bg-white text-black"
                />
                <div
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="flex justify-end gap-1 mt-1 pr-1">
                  {[1, 2, 3, 4].map((bar) => {
                    const filled =
                      (passwordStrength === "Strong" && bar <= 4) ||
                      (passwordStrength === "Medium" && bar <= 3) ||
                      (passwordStrength === "Weak" && bar <= 2);

                    return (
                      <div
                        key={bar}
                        className={`w-6 h-1 rounded-sm ${
                          filled
                            ? passwordStrength === "Strong"
                              ? "bg-green-500"
                              : passwordStrength === "Medium"
                              ? "bg-yellow-400"
                              : "bg-red-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-4 font-bold py-2 rounded-full transition duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#6B7FFF] hover:bg-[#5A6FEF] text-white"
              }`}
            >
              {isLoading ? "Signing Up..." : "SIGN UP"}
            </button>
          </>
        )}
      </form>

      {/* Info text below everything */}
      <p className="mt-8 text-sm font-bold text-center max-w-xs mx-auto text-[#5A6CFF]">
  {isStudent
    ? "* Students can apply to gigs and post their own gigs."
    : "* You're signing up as a client. You can post gigs, hire students, and manage your tasks through the dashboard."}
</p>


    </div>
  );
}
