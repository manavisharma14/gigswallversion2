"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthPage({ defaultLoginMode }: { defaultLoginMode: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSignIn, setIsSignIn] = useState(defaultLoginMode);

  useEffect(() => {
    setIsSignIn(pathname === "/signin");
  }, [pathname]);

  const toggleMode = () => {
    const newMode = !isSignIn;
    setIsSignIn(newMode);
    router.push(newMode ? "/signin" : "/signup");
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    college: "",
    otherCollege: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "college" && value !== "Others" ? { otherCollege: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isSignIn ? "/api/signin" : "/api/signup";

    const payload = isSignIn
      ? { email: formData.email, password: formData.password }
      : {
          ...formData,
          college: formData.college === "Others" ? formData.otherCollege : formData.college,
        };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("userId", data.user.id);
          window.dispatchEvent(new Event("storageChanged"));
        }
        toast.success(isSignIn ? "Welcome back!" : "Account created successfully 🚀");
        router.push("/");
      } else {
        toast.error(data?.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Unable to connect to server. Try again later.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] via-40% to-[#A991F7] items-center justify-center">
      <div className="flex w-[900px] bg-white/90 rounded-xl shadow-xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 bg-[#4B55C3] text-white p-10 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold font-bricolage mb-4">
            {isSignIn ? "Welcome Back! 👋" : "Hello Friend! 🚀"}
          </h2>
          <p className="text-sm font-bricolage text-center leading-relaxed">
            {isSignIn
              ? "Don't have an account yet? Join the GigsWall community to explore and post exciting gigs!"
              : "Already have an account? Log in to manage your gigs, apply for new opportunities, and connect with students!"}
          </p>
          <button
            onClick={toggleMode}
            className="mt-6 bg-white text-[#4B3BB3] font-bricolage font-bold px-5 py-2 rounded-full transition hover:brightness-95"
          >
            {isSignIn ? "SIGN UP" : "SIGN IN"}
          </button>
        </div>

        {/* Right Panel: Auth Form */}
        <div className="w-1/2 p-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bricolage font-bold text-[#4B3BB3]">
              {isSignIn ? "Login" : "Create Account"}
            </h2>

            {!isSignIn && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="input font-bricolage text-black"
                  onChange={handleChange}
                  value={formData.name}
                  required
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input font-bricolage text-black"
              onChange={handleChange}
              value={formData.email}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input font-bricolage text-black"
              onChange={handleChange}
              value={formData.password}
              required
            />

            {!isSignIn && (
              <>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="input font-bricolage text-black"
                  onChange={handleChange}
                  value={formData.phone}
                  required
                />
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  className="input font-bricolage text-black"
                  onChange={handleChange}
                  value={formData.department}
                />

                <select
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="input font-bricolage text-black"
                  required
                >
                  <option value="" disabled hidden>Select College</option>
                  <option value="MIT Manipal">MIT Manipal</option>
                  <option value="MIT Bangalore">MIT Bangalore</option>
                  <option value="Others">Others</option>
                </select>

                {formData.college === "Others" && (
                  <input
                    name="otherCollege"
                    type="text"
                    value={formData.otherCollege}
                    onChange={handleChange}
                    placeholder="Enter your college name"
                    className="input font-bricolage text-black"
                    required
                  />
                )}
              </>
            )}

            <button
              type="submit"
              className="mt-4 w-full bg-[#6B7FFF] hover:bg-[#5A6FEF] text-white font-semibold px-5 py-2 rounded-full transition"
            >
              {isSignIn ? "SIGN IN" : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
