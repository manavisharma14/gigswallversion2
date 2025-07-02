"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import clsx from "clsx";

export default function AuthSlider({ defaultLoginMode }: { defaultLoginMode: boolean }) {
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
      ? {
          email: formData.email,
          password: formData.password,
        }
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
        toast.success(isSignIn ? "Happy to see you back!" : "You're officially part of the GigsWall fam 🚀");
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
<div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-[#6B7FFF] via-[#8C6BD6] to-[#6EC5FF]">
      <div className="relative w-[800px] h-[600px] overflow-hidden rounded-xl shadow-2xl bg-white/90 backdrop-blur-md">
        {/* Sign In */}
        <div
          className={clsx(
            "absolute top-0 left-0 w-1/2 h-full px-10 flex items-center justify-center transition-all duration-700",
            isSignIn ? "translate-x-0 z-20 opacity-100 pointer-events-auto" : "-translate-x-full z-10 opacity-0 pointer-events-none"
          )}
        >
          <form className="w-full" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bricolage font-bold text-[#4B3BB3] mb-6">Login</h2>
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
            <button className="mt-4 bg-[#6B7FFF] hover:bg-[#5A6FEF] text-white font-semibold px-5 py-2 rounded-full transition" type="submit">
              SIGN IN
            </button>
          </form>
        </div>

        {/* Sign Up */}
        <div
          className={clsx(
            "absolute top-0 right-0 w-1/2 h-full px-10 flex items-center justify-center transition-all duration-700",
            isSignIn ? "translate-x-full z-10 opacity-0 pointer-events-none" : "translate-x-0 z-20 opacity-100 pointer-events-auto"
          )}
        >
          <form className="w-full" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bricolage font-bold text-[#4B3BB3] mb-6">Create Account</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="input font-bricolage text-black"
              onChange={handleChange}
              value={formData.name}
              required
            />
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

            <div className="flex flex-col gap-2">
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
            </div>

            <button className="mt-4 bg-[#6B7FFF] hover:bg-[#5A6FEF] text-white font-semibold px-5 py-2 rounded-full transition" type="submit">
              SIGN UP
            </button>
          </form>
        </div>

        {/* Sliding Panel */}
        <div
          className={clsx(
            "absolute top-0 w-1/2 h-full bg-[#4B3BB3] text-white flex items-center justify-center transition-all duration-700 z-30",
            isSignIn ? "left-1/2" : "left-0"
          )}
        >
          <div className="text-center px-6">
            {isSignIn ? (
              <>
                <h3 className="text-2xl font-semibold font-bricolage">Welcome Back! 👋</h3>
                <p className="mt-32 text-sm font-bricolage max-w-xs mx-auto leading-relaxed">
                  Don&apos;t have an account yet? <br />
                  Create one to explore new gigs and build your skills.
                </p>
                <button
                  className="mt-6 bg-white font-bricolage text-[#4B3BB3] px-5 py-2 rounded-full font-bold transition hover:brightness-95"
                  onClick={toggleMode}
                >
                  SIGN UP
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold font-bricolage">Hello Friend! Start Your Journey 🚀</h3>
                <p className="mt-32 text-sm font-bricolage max-w-xs mx-auto leading-relaxed">
                  Already have an account? <br />
                  Log in to discover new opportunities, manage your gigs, and connect with others.
                </p>
                <button
                  className="mt-6 bg-white font-bricolage text-[#4B3BB3] px-5 py-2 rounded-full font-bold transition hover:brightness-95"
                  onClick={toggleMode}
                >
                  SIGN IN
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
