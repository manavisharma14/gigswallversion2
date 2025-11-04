"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { data: session, update } = useSession(); // ✅ added update

  useEffect(() => {
    if (session) router.push("/dashboard/profile");
  }, [session, router]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // important
      });

      if (res?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      await update(); 
      router.refresh();
      window.location.href = "/dashboard/profile";

    } catch {
      toast.error("Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
  
    try {
      await signIn("google", {
        callbackUrl: "/dashboard/profile", // ✅ redirect to dashboard
      });
    } catch (err) {
      toast.error("Google sign-in failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] to-[#A991F7] text-white px-4">
      <div className="max-w-md w-full text-center mb-10">
        <h2 className="text-4xl font-bold mb-3 tracking-tight">
          Welcome back 👋
        </h2>
        <p className="text-white/80 text-sm">
          Continue your journey with{" "}
          <span className="font-semibold">GigsWall</span>.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 text-left"
      >
        <Input
          icon={<Mail size={18} />}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <PasswordInput
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <div className="text-right -mt-2 mb-2">
          <Link
            href="/forgot-password"
            className="text-xs text-white/80 hover:text-white underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 py-2.5 rounded-full font-medium transition-all ${
            isLoading
              ? "bg-white/30 text-white/60 cursor-not-allowed"
              : "bg-white text-[#3B4CCA] hover:bg-white/90"
          }`}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-grow h-px bg-white/40"></div>
        <span className="mx-3 text-sm text-white/80">or</span>
        <div className="flex-grow h-px bg-white/40"></div>
      </div>

      {error && (
        <p className="text-red-200 text-xs bg-red-500/20 border border-red-400/30 px-3 py-2 rounded-md">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className={`w-full max-w-sm flex items-center justify-center gap-2 py-2.5 rounded-full font-medium transition-all ${
          isGoogleLoading
            ? "bg-white/30 text-white/60 cursor-not-allowed"
            : "bg-white text-[#3B4CCA] hover:bg-white/90"
        }`}
      >
        <GoogleIcon />
        {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
      </button>

      <p className="mt-6 text-xs text-white/80 text-center max-w-sm mx-auto">
        <span className="font-semibold text-white">Note:</span> Use your{" "}
        <span className="font-semibold text-white">student email</span> to apply for gigs,
        or any email to post jobs.
      </p>

      <p className="text-sm text-white/80 mt-8">
        Don’t have an account?{" "}
        <Link href="/signup" className="underline hover:text-white">
          Sign up here
        </Link>
      </p>
    </div>
  );
}

// Input component
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

// PasswordInput
function PasswordInput({ showPassword, setShowPassword, ...props }: PasswordInputProps) {
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
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.31h6.48c-.28 1.38-1.11 2.55-2.37 3.34v2.77h3.83c2.24-2.07 3.55-5.11 3.55-8.15z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.93l-3.83-2.77c-1.06.71-2.43 1.13-4.12 1.13-3.16 0-5.83-2.13-6.79-5.01H1.24v3.1C3.21 21.3 7.27 24 12 24z" />
      <path fill="#FBBC05" d="M5.21 14.42a7.18 7.18 0 0 1 0-4.84V6.48H1.24a12.03 12.03 0 0 0 0 10.98l3.97-3.04z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.79l3.42-3.42C17.95 1.2 15.23 0 12 0 7.27 0 3.21 2.7 1.24 6.48l3.97 3.1C6.17 6.88 8.84 4.75 12 4.75z" />
    </svg>
  );
}