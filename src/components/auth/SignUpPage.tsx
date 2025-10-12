'use client';

import { useState, useCallback, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SignupStepOne from "./SignupStepOne";
import SignupStepTwo from "@/components/auth/SignupStepTwo";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { signIn } from "next-auth/react";

export interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  college: string;
  otherCollege?: string;
  gradYear: string;
  type: "student" | "other";
  gigPreference: string;
}

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
  const [termsAccepted, setTermsAccepted] = useState(false);

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
    type: "student",
    gigPreference: "finder",
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "college" && value !== "Others" ? { otherCollege: "" } : {}),
      }));

      if (name === "password") {
        setPasswordStrength(getPasswordStrength(value));
      }
    },
    []
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
      toast.error("Please fill all required fields.");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions.");
      return;
    }

    setIsLoading(true);
    const payload = {
      ...formData,
      type: isStudent ? "student" : "other",
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
        // ✅ Immediately sign in after successful signup
        const loginResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (loginResult?.error) {
          toast.error(loginResult.error);
        } else {
          toast.success("Account created successfully 🚀");
          router.push("/dashboard");
        }
      } else {
        toast.error(data?.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f8ff] to-[#eef0ff] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-[#4B3BB3]">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Join GigsWall to find gigs or hire talent.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-[#EDEBFF] rounded-full p-1 mb-8">
          <button
            type="button"
            onClick={() => setIsStudent(true)}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              isStudent ? "bg-[#6B7FFF] text-white" : "text-[#4B3BB3]"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setIsStudent(false)}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              !isStudent ? "bg-[#6B7FFF] text-white" : "text-[#4B3BB3]"
            }`}
          >
            Not a Student
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isStudent ? (
            <>
              {signupStep === 1 && (
                <>
                  <SignupStepOne formData={formData} handleChange={handleChange} />
                  <button
                    type="button"
                    onClick={() => setSignupStep(2)}
                    className="w-full bg-gradient-to-r from-[#6B7FFF] to-[#4B3BB3] text-white font-semibold py-2.5 rounded-full hover:opacity-90 transition"
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
                  {/* Terms */}
                  <div className="flex items-start gap-2 bg-[#F8F9FF] p-3 rounded-lg mt-4">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 text-[#6B7FFF] border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-600">
                      I agree to the{" "}
                      <a href="/terms" target="_blank" className="text-[#4737ff] underline">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" target="_blank" className="text-[#4737ff] underline">
                        Privacy Policy
                      </a>.
                    </label>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="w-1/2 bg-gray-100 text-gray-800 font-semibold py-2 rounded-full hover:bg-gray-200 transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !termsAccepted}
                      className={`w-1/2 font-semibold py-2 rounded-full transition ${
                        isLoading || !termsAccepted
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#6B7FFF] to-[#4B3BB3] text-white hover:opacity-90"
                      }`}
                    >
                      {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Non-student form */}
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B3BB3]" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 pl-10 rounded-md focus:ring-2 focus:ring-[#6B7FFF] outline-none"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B3BB3]" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 pl-10 rounded-md focus:ring-2 focus:ring-[#6B7FFF] outline-none"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B3BB3]" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 pl-10 pr-10 rounded-md focus:ring-2 focus:ring-[#6B7FFF] outline-none"
                  />
                  <div
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B3BB3] cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                {formData.password && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">
                      Password Strength:{" "}
                      <span
                        className={
                          passwordStrength === "Strong"
                            ? "text-green-600"
                            : passwordStrength === "Medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {passwordStrength}
                      </span>
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((bar) => {
                        const filled =
                          (passwordStrength === "Strong" && bar <= 4) ||
                          (passwordStrength === "Medium" && bar <= 3) ||
                          (passwordStrength === "Weak" && bar <= 2);
                        return (
                          <div
                            key={bar}
                            className={`h-1.5 w-6 rounded ${
                              filled
                                ? passwordStrength === "Strong"
                                  ? "bg-green-500"
                                  : passwordStrength === "Medium"
                                  ? "bg-yellow-400"
                                  : "bg-red-500"
                                : "bg-gray-300"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 bg-[#F8F9FF] p-3 rounded-lg mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#6B7FFF] border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-xs text-gray-600">
                  I agree to the{" "}
                  <a href="/terms" target="_blank" className="text-[#4737ff] underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank" className="text-[#4737ff] underline">
                    Privacy Policy
                  </a>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !termsAccepted}
                className={`w-full mt-4 font-semibold py-2 rounded-full transition ${
                  isLoading || !termsAccepted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#6B7FFF] to-[#4B3BB3] text-white hover:opacity-90"
                }`}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </>
          )}
        </form>

        <p className="mt-6 text-xs text-center text-gray-500">
          {isStudent
            ? "* Students can apply to gigs and post their own gigs."
            : "* You're signing up as a client to post gigs and hire students."}
        </p>
      </div>
    </div>
  );
}