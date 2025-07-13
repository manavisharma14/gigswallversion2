// components/auth/SignUpPage.tsx
"use client";

import SignupStepOne from "./SignupStepOne";
import SignupStepTwo from "./SignupStepTwo";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [signupStep, setSignupStep] = useState(1);

  const [formData, setFormData] = useState({
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
    role: "both",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "college" && value !== "Others" ? { otherCollege: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      college: formData.college === "Others" ? formData.otherCollege : formData.college,
    };

    try {
      const res = await fetch("/api/signup", {
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

        toast.success("Account created successfully 🚀");
        router.push("/dashboard");
      } else {
        toast.error(data?.error || "Something went wrong.");
      }
    } catch  {
      toast.error("Signup failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <h2 className="text-2xl font-bold text-[#4B3BB3] text-center">Create Account</h2>

      {signupStep === 1 && (
        <>
          <SignupStepOne formData={formData} handleChange={handleChange} />
          <button
            type="button"
            className="w-full bg-[#4B3BB3] hover:bg-[#372e91] text-white font-bold py-2 rounded-full transition duration-200"
            onClick={() => setSignupStep(2)}
          >
            Next →
          </button>
        </>
      )}

      {signupStep === 2 && (
        <>
          <SignupStepTwo formData={formData} handleChange={handleChange} />
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => setSignupStep(1)}
              className="w-full bg-gray-200 text-black font-bold py-2 rounded-full"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="w-full bg-[#6B7FFF] hover:bg-[#5A6FEF] text-white font-bold py-2 rounded-full"
            >
              SIGN UP
            </button>
          </div>
        </>
      )}
    </form>
  );
}
