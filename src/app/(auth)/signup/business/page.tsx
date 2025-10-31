"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Mail, Lock, User, Building2, Eye, EyeOff, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

// === PROPER TYPES ===
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TermsCheckboxProps {
  termsAccepted: boolean;
  setTermsAccepted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BusinessSignupPage() {
  const router = useRouter();
  const { update } = useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    type: "business" as const,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Signup failed.");
        return;
      }

      toast.success("Account created! Logging you in...");

      const login = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (login?.error) {
        toast.error("Login failed. Please sign in manually.");
        router.replace("/signin");
        return;
      }

      await update();
      router.refresh();

      // Hard navigation — forces full re-render (navbar included)
      window.location.href = "/dashboard/profile";

    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col mt-8 items-center justify-center bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] to-[#A991F7] text-white px-4">
      <div className="max-w-md w-full text-center mb-10">
        <h2 className="text-4xl font-bold mb-3 tracking-tight">
          Create your business account
        </h2>
        <p className="text-white/80 text-sm">
          Post gigs and hire talented students on{" "}
          <span className="font-semibold">GigsWall</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 text-left">
        <Input icon={<User size={18} />} name="name" placeholder="Full Name" onChange={handleChange} required />
        <Input icon={<Mail size={18} />} name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
        
        <PasswordInput
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <Input icon={<Phone size={18} />} name="phone" placeholder="Phone Number" onChange={handleChange} />
        <Input icon={<Building2 size={18} />} name="company" placeholder="Company Name" onChange={handleChange} />

        <TermsCheckbox termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} />

        <button
          type="submit"
          disabled={isLoading || !termsAccepted}
          className={`mt-4 py-2.5 rounded-full font-medium transition-all ${
            isLoading || !termsAccepted
              ? "bg-white/30 text-white/60 cursor-not-allowed"
              : "bg-white text-[#3B4CCA] hover:bg-white/90"
          }`}
        >
          {isLoading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-white/80 mt-6">
        Already have an account?{" "}
        <a href="/signin" className="underline hover:text-white">Sign in</a>
      </p>

      <p className="text-sm text-white/80 mt-2">
        Want to sign up as a student instead?{" "}
        <a href="/signup/student" className="underline hover:text-white">Student Signup</a>
      </p>
    </div>
  );
}

/* ---------------- REUSABLE INPUTS (TYPED) ---------------- */

const Input = ({ icon, ...props }: InputProps) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
      {icon}
    </span>
    <input
      {...props}
      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 px-4 py-2.5 pl-10 rounded-lg focus:ring-2 focus:ring-white/40 outline-none transition-all"
    />
  </div>
);

const PasswordInput = ({ showPassword, setShowPassword, ...props }: PasswordInputProps) => (
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
    <input
      {...props}
      type={showPassword ? "text" : "password"}
      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 px-4 py-2.5 pl-10 pr-10 rounded-lg focus:ring-2 focus:ring-white/40 outline-none transition-all"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

const TermsCheckbox = ({ termsAccepted, setTermsAccepted }: TermsCheckboxProps) => (
  <div className="flex items-start gap-2 mt-2 text-sm">
    <input
      type="checkbox"
      id="terms"
      checked={termsAccepted}
      onChange={(e) => setTermsAccepted(e.target.checked)}
      className="mt-1 h-4 w-4 accent-white"
    />
    <label htmlFor="terms" className="text-white/90 leading-snug">
      I agree to the{" "}
      <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200">
        Terms & Conditions
      </a>{" "}
      and{" "}
      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200">
        Privacy Policy
      </a>.
    </label>
  </div>
);