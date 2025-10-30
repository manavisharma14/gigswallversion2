"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function StudentSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: "student",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
  
      if (res.ok) {
        toast.success("Account created successfully 🚀");
  
        // if user is student → redirect to complete profile
        if (formData.type === "student") {
          // Automatically sign in after signup
          await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false, // prevent redirect to dashboard
          });
        
          router.push("/complete-profile");
          return;
        }
  
        // else, log them in directly
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl: "/dashboard/profile",
        });
      } else {
        toast.error(data?.error || "Something went wrong.");
      }
    } catch {
      toast.error("Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] to-[#A991F7] text-white px-4">
      <div className="max-w-md w-full text-center mb-10">
        <h2 className="text-4xl font-bold mb-3 tracking-tight">
          Create your student account
        </h2>
        <p className="text-white/80 text-sm">
          Join <span className="font-semibold">GigsWall</span> to find gigs and connect with peers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 text-left"
      >
        <Input
          icon={<User size={18} />}
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />
        <Input
          icon={<Mail size={18} />}
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
        />
        <PasswordInput
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />


        <div className="flex items-start gap-2 mt-2 text-sm">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[#fff]"
          />
          <label htmlFor="terms" className="text-white/90">
            I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              className="underline text-white hover:text-gray-200"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              className="underline text-white hover:text-gray-200"
            >
              Privacy Policy
            </a>.
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !termsAccepted}
          className={`mt-4 py-2.5 rounded-full font-medium transition-all ${
            isLoading || !termsAccepted
              ? "bg-white/30 text-white/60 cursor-not-allowed"
              : "bg-white text-[#3B4CCA] hover:bg-white/90"
          }`}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-white/80 mt-6">
  Already have an account?{" "}
  <a href="/signin" className="underline hover:text-white">
    Sign in
  </a>
</p>

<p className="text-sm text-white/80 mt-2">
  Want to sign up as a business instead?{" "}
  <a href="/signup/business" className="underline hover:text-white">
    Business Signup
  </a>
</p>
    </div>
  );
}


function Input({ icon, ...props }: InputProps) {
  return (
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
}

function PasswordInput({
  showPassword,
  setShowPassword,
  ...props
}: PasswordInputProps) {
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 px-4 py-2.5 pl-10 pr-10 rounded-lg focus:ring-2 focus:ring-white/40 outline-none transition-all"
      />
      <button
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}