"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { data: session, update } = useSession();

  useEffect(() => {
    if (session) router.push("/dashboard/profile");
  }, [session, router]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { toast.error("Enter a valid email address."); return false; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return false; }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) { setError("Invalid email or password"); return; }
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
      await signIn("google", { callbackUrl: "/dashboard/profile" });
    } catch {
      toast.error("Google sign-in failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0c0a1e]">

      {/* ── LEFT PANEL ── */}
<div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#3B4CCA] via-[#5060D8] to-[#667EEA]">
        {/* Orbs */}

<div className="absolute -top-24 -left-20 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl pointer-events-none" />

<div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />


        {/* Logo */}
        <div className="relative z-10 font-bold text-xl tracking-tight text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
          Gigs<span className="text-violet-400">Wall</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-violet-300 uppercase tracking-widest">Student Freelancing</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>
            Your skills.<br />
            Your <span className="text-violet-400">earnings</span>.<br />
            Your terms.
          </h1>

          <p className="text-white/50 text-[15px] leading-relaxed max-w-xs mb-10">
            Connect with businesses that need your talent, on your schedule, at your price.
          </p>

          {/* <div className="flex gap-8">
            {[
              { val: "2,400+", lbl: "Active students" },
              { val: "₹18L+",  lbl: "Paid out" },
              { val: "94%",    lbl: "Satisfaction" },
            ].map(s => (
              <div key={s.lbl}>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{s.val}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.lbl}</p>
              </div>
            ))}
          </div> */}
        </div>

        <p className="relative z-10 text-xs text-white/25">© 2025 GigsWall · Built for students</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex items-center justify-center px-6 py-16 bg-[#fafafa]">
        <div className="w-full max-w-[380px]">

          {/* Heading */}
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            Welcome back
          </p>
          <h2 className="text-[2rem] font-extrabold text-[#1e1b4b] tracking-tight leading-tight mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
            Sign in
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Do not have an account?{" "}
            <Link href="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-[11px] rounded-xl border-[1.5px] border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-indigo-400 hover:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all disabled:opacity-50 mb-5"
          >
            <GoogleIcon />
            {isGoogleLoading ? "Signing in…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5 text-gray-300 text-xs">
            <div className="flex-1 h-px bg-gray-200" />
            or sign in with email
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Sora, sans-serif' }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-[11px] rounded-xl border-[1.5px] border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-semibold text-gray-600" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Password
                </label>
                <Link href="/forgot-password" className="text-[12px] text-indigo-500 font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-[11px] rounded-xl border-[1.5px] border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold tracking-wide transition-all disabled:opacity-50 mt-1"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {isLoading ? "Signing in…" : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Note */}
          <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-[12.5px] text-indigo-700 leading-relaxed">
            <strong className="font-semibold">Tip:</strong> Use your{" "}
            <strong className="font-semibold">student email</strong> to apply for gigs, or any email to post jobs.
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.31h6.48c-.28 1.38-1.11 2.55-2.37 3.34v2.77h3.83c2.24-2.07 3.55-5.11 3.55-8.15z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.93l-3.83-2.77c-1.06.71-2.43 1.13-4.12 1.13-3.16 0-5.83-2.13-6.79-5.01H1.24v3.1C3.21 21.3 7.27 24 12 24z"/>
      <path fill="#FBBC05" d="M5.21 14.42a7.18 7.18 0 0 1 0-4.84V6.48H1.24a12.03 12.03 0 0 0 0 10.98l3.97-3.04z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.79l3.42-3.42C17.95 1.2 15.23 0 12 0 7.27 0 3.21 2.7 1.24 6.48l3.97 3.1C6.17 6.88 8.84 4.75 12 4.75z"/>
    </svg>
  );
}