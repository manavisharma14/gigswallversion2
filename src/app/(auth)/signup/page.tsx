"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { GraduationCap, Briefcase } from "lucide-react";

export default function SignupPage() {
  const [selected, setSelected] = useState<"student" | "business">("student");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0c0a1e]">

      {/* LEFT */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#3B4CCA] via-[#5060D8] to-[#667EEA]">
        <div className="absolute -top-24 -left-20 w-[380px] h-[380px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 font-bold text-xl tracking-tight text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
          Gigs<span className="opacity-70">Wall</span>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-widest">Get started</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>
            One platform.<br />
            <span className="text-white/65">Two ways</span><br />
            to win.
          </h1>

          <p className="text-white/70 text-[15px] leading-relaxed max-w-xs mb-10">
            Students earn from real projects. Businesses get fast, affordable talent. Everyone wins.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { n: "1", title: "Choose your role", desc: "student or business" },
              { n: "2", title: "Create your account", desc: "in under 2 minutes" },
              { n: "3", title: "Start collaborating", desc: "on real gigs today" },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mt-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>{s.n}</div>
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
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            Join GigsWall
          </p>
          <h2 className="text-[1.9rem] font-extrabold text-[#1e1b4b] tracking-tight leading-tight mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
            Create account
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Already have one?{" "}
            <Link href="/signin" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
  {([
    {
      type: "student",
      icon: GraduationCap,
      label: "Student",
      desc: "Find gigs & earn",
    },
    {
      type: "business",
      icon: Briefcase,
      label: "Business",
      desc: "Post jobs & hire",
    },
  ] as const).map((opt) => {
    const Icon = opt.icon;

    return (
      <button
        key={opt.type}
        type="button"
        onClick={() => setSelected(opt.type)}
        className={`border-2 rounded-2xl p-4 text-center transition-all ${
          selected === opt.type
            ? "border-indigo-500 bg-indigo-50 shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
            : "border-gray-200 bg-white hover:border-indigo-300"
        }`}
      >
        <div className="flex justify-center mb-2">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>

        <p className="text-sm font-bold text-[#1e1b4b]">
          {opt.label}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {opt.desc}
        </p>
      </button>
    );
  })}
</div>

          <Link href={`/signup/${selected}`}>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold tracking-wide transition-all" style={{ fontFamily: 'Sora, sans-serif' }}>
              Continue as {selected === "student" ? "Student" : "Business"} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}