"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function StudentSignupPage() {
  const router = useRouter();
  const { update } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", type: "student" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) { toast.error("Please accept the Terms & Conditions."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) { toast.error(data?.error || "Something went wrong."); return; }
      toast.success("Account created successfully");
      await fetch("/api/auth/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.email }) }).catch(() => toast.error("Failed to send OTP."));
      const signInRes = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false });
      if (!signInRes?.ok) { toast.error("Auto sign-in failed."); router.push("/signin"); return; }
      await update();
      router.refresh();
      router.push("/complete-profile");
    } catch { toast.error("Signup failed. Please try again."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#3B4CCA] via-[#5060D8] to-[#667EEA]">
        <div className="absolute -top-24 -left-20 w-[380px] h-[380px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/8 blur-3xl pointer-events-none" />
        <div className="relative z-10 font-bold text-xl tracking-tight text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Gigs<span className="opacity-70">Wall</span></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-widest">For Students</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>
            Turn your<br />skills into<br /><span className="text-white/65">real income.</span>
          </h1>
          <p className="text-white/70 text-[15px] leading-relaxed max-w-xs mb-10">Apply to gigs that fit your schedule. Build a portfolio while you study.</p>
          <div className="flex flex-col gap-4">
            {[
              { n: "1", title: "Use your student email", desc: "to verify your status" },
              { n: "2", title: "Complete your profile", desc: "with skills & portfolio" },
              { n: "3", title: "Apply to gigs", desc: "and start earning" },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mt-0.5">{s.n}</div>
                <p className="text-[13.5px] text-white/80 leading-snug"><strong className="text-white font-semibold">{s.title}</strong> — {s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-white/40">© 2025 GigsWall · Built for students</p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-16 bg-[#fafafa]">
        <div className="w-full max-w-[360px]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Student account</p>
          <h2 className="text-[1.9rem] font-extrabold text-[#1e1b4b] tracking-tight leading-tight mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Sign up</h2>
          <p className="text-sm text-gray-400 mb-7">Already have an account? <Link href="/signin" className="text-indigo-600 font-semibold hover:underline">Sign in</Link></p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name">
              <FieldInput icon={<User className="w-[15px] h-[15px]" />} name="name" type="text" placeholder="Alex Johnson" value={formData.name} onChange={handleChange} required />
            </Field>
            <Field label="Email address">
              <FieldInput icon={<Mail className="w-[15px] h-[15px]" />} name="email" type="email" placeholder="alex@university.edu" value={formData.email} onChange={handleChange} required />
            </Field>
            <Field label="Password">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-gray-400" />
                <input name="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required
                  className="w-full pl-9 pr-10 py-[10px] rounded-xl border-[1.5px] border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all" />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <div className="flex items-start gap-2.5 pt-1">
              <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-indigo-600 cursor-pointer" />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                I agree to the <Link href="/terms" target="_blank" className="text-indigo-600 font-medium hover:underline">Terms & Conditions</Link> and <Link href="/privacy" target="_blank" className="text-indigo-600 font-medium hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={isLoading || !termsAccepted}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{ fontFamily: 'Sora, sans-serif' }}>
              {isLoading ? "Creating account…" : <><span>Create Student Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-5 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-center text-xs text-indigo-600">
            Want to post gigs? <Link href="/signup/business" className="font-bold hover:underline">Sign up as a Business →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11.5px] font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Sora, sans-serif' }}>{label}</label>
      {children}
    </div>
  );
}

function FieldInput({ icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input {...props} className="w-full pl-9 pr-4 py-[10px] rounded-xl border-[1.5px] border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all" />
    </div>
  );
}