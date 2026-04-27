"use client";
import { FaWhatsapp, FaShieldAlt, FaBolt, FaGlobe, FaUserCheck } from "react-icons/fa";
import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.55 + 0.12,
      twinkleSpeed: Math.random() * 0.018 + 0.004,
      twinkleOffset: Math.random() * Math.PI * 2,
      dx: (Math.random() - 0.5) * 0.06,
      dy: (Math.random() - 0.5) * 0.06,
    }));

    let frame = 0;
    let animId: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      frame++;
      for (const s of stars) {
        const t = Math.sin(frame * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * t})`;
        ctx.fill();
        s.x += s.dx; s.y += s.dy;
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  const features = [
    { icon: <FaUserCheck />, label: "Verified Profiles" },
    { icon: <FaShieldAlt />, label: "Secure Projects" },
    { icon: <FaBolt />,      label: "Fast Turnarounds" },
    { icon: <FaGlobe />,     label: "Global Reach" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .hero-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .hero-root * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes orbA {
          0%,100% { transform:translate(0,0) scale(1); }
          40%      { transform:translate(22px,-26px) scale(1.07); }
          70%      { transform:translate(-14px,18px) scale(0.95); }
        }
        @keyframes orbB {
          0%,100% { transform:translate(0,0) scale(1); }
          35%      { transform:translate(-20px,22px) scale(1.06); }
          70%      { transform:translate(16px,-14px) scale(0.96); }
        }
        @keyframes orbC {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(12px,20px) scale(1.05); }
        }
        @keyframes dotBlink {
          0%,100% { opacity:1; box-shadow:0 0 8px #6effa0; }
          50%      { opacity:0.4; box-shadow:0 0 3px #6effa0; }
        }
        @keyframes scrollDrop {
          0%   { opacity:1; transform:translateY(0); }
          100% { opacity:0; transform:translateY(12px); }
        }
        @keyframes scrollBounce {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%      { transform:translateX(-50%) translateY(7px); }
        }
        @keyframes pf1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes pf2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes pf3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes pf4 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }

        .fade-1 { animation:fadeUp .65s cubic-bezier(.22,1,.36,1) .05s both; }
        .fade-2 { animation:fadeUp .65s cubic-bezier(.22,1,.36,1) .18s both; }
        .fade-3 { animation:fadeUp .65s cubic-bezier(.22,1,.36,1) .30s both; }
        .fade-4 { animation:fadeUp .65s cubic-bezier(.22,1,.36,1) .42s both; }
        .fade-5 { animation:fadeUp .65s cubic-bezier(.22,1,.36,1) .55s both; }
        .fade-6 { animation:fadeUp .65s cubic-bezier(.22,1,.36,1) .68s both; }

        .orb-a { animation:orbA 12s ease-in-out infinite; }
        .orb-b { animation:orbB 15s ease-in-out 2s infinite; }
        .orb-c { animation:orbC 10s ease-in-out 4s infinite; }

        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(255,255,255,0.12);
          border:1px solid rgba(255,255,255,0.22);
          border-radius:100px; padding:7px 18px;
          font-size:0.75rem; font-weight:600;
          color:rgba(255,255,255,0.9);
          letter-spacing:0.06em; text-transform:uppercase;
          backdrop-filter:blur(12px);
        }
        .badge-dot {
          width:7px; height:7px; background:#6effa0;
          border-radius:50%; flex-shrink:0;
          animation:dotBlink 2.2s ease-in-out infinite;
        }

        .hero-title {
          font-size:clamp(2.1rem, 4.5vw, 3.4rem);
          font-weight:800; line-height:1.16;
          letter-spacing:-0.03em; color:#fff; margin:0;
          text-shadow:0 2px 40px rgba(0,0,0,0.12);
        }

        .hero-sub {
          font-size:clamp(0.9rem, 1.4vw, 1.05rem);
          font-weight:400; color:rgba(255,255,255,0.6);
          line-height:1.78; max-width:450px; margin:0 auto;
        }

        .btn-white {
          font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:700; font-size:0.9rem;
          padding:13px 26px; border-radius:12px;
          background:#fff; color:#3B4CCA;
          box-shadow:0 4px 24px rgba(0,0,0,0.2);
          transition:transform .18s, box-shadow .18s;
          white-space:nowrap; position:relative; overflow:hidden; display:inline-block;
        }
        .btn-white::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%);
          transform:translateX(-100%); transition:transform .5s;
        }
        .btn-white:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,0,0,0.25); }
        .btn-white:hover::after { transform:translateX(100%); }

        .btn-glass {
          font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:700; font-size:0.9rem;
          padding:13px 26px; border-radius:12px;
          background:rgba(255,255,255,0.1); color:#fff;
          border:1.5px solid rgba(255,255,255,0.22);
          backdrop-filter:blur(12px);
          transition:transform .18s, background .18s, border-color .18s;
          white-space:nowrap; display:inline-block;
        }
        .btn-glass:hover {
          transform:translateY(-2px);
          background:rgba(255,255,255,0.18);
          border-color:rgba(255,255,255,0.42);
        }

        .btn-wa {
          font-family:'Plus Jakarta Sans',sans-serif;
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; color:rgba(255,255,255,0.65);
          font-size:0.82rem; font-weight:500;
          padding:9px 20px; border-radius:100px;
          border:1px solid rgba(255,255,255,0.18);
          transition:background .18s, color .18s, border-color .18s;
        }
        .btn-wa:hover {
          background:rgba(255,255,255,0.09);
          color:#fff; border-color:rgba(255,255,255,0.36);
        }

        .pills-row {
          display:flex; flex-wrap:nowrap; gap:10px;
          justify-content:center; overflow-x:auto;
          padding-bottom:2px; scrollbar-width:none;
        }
        .pills-row::-webkit-scrollbar { display:none; }

        .f-pill {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.14);
          border-radius:100px; padding:8px 16px;
          color:rgba(255,255,255,0.78);
          font-size:0.8rem; font-weight:500;
          white-space:nowrap; backdrop-filter:blur(10px);
          transition:background .2s, border-color .2s, color .2s;
          flex-shrink:0;
        }
        .f-pill:hover { background:rgba(255,255,255,0.15); border-color:rgba(255,255,255,0.3); color:#fff; }
        .f-pill:nth-child(1) { animation:pf1 4.2s ease-in-out infinite; }
        .f-pill:nth-child(2) { animation:pf2 4.8s ease-in-out .6s infinite; }
        .f-pill:nth-child(3) { animation:pf3 3.9s ease-in-out 1.1s infinite; }
        .f-pill:nth-child(4) { animation:pf4 4.5s ease-in-out 1.7s infinite; }

        .pill-icon {
          width:20px; height:20px; border-radius:50%;
          background:rgba(255,255,255,0.14);
          display:flex; align-items:center; justify-content:center;
          font-size:0.6rem; flex-shrink:0;
        }

        .scroll-wrap {
          position:absolute; bottom:28px; left:50%;
          transform:translateX(-50%);
          animation:scrollBounce 2.2s ease-in-out infinite;
          z-index:10;
        }
        .scroll-mouse {
          width:26px; height:42px;
          border:1.5px solid rgba(255,255,255,0.28);
          border-radius:13px;
          display:flex; justify-content:center; padding-top:6px;
        }
        .scroll-dot {
          width:3px; height:7px;
          background:rgba(255,255,255,0.6); border-radius:3px;
          animation:scrollDrop 1.7s ease-in-out infinite;
        }
      `}</style>

      <section
        id="hero"
        className="hero-root relative mt-8 min-h-screen flex flex-col justify-center overflow-hidden"
        style={{
          /*
           * Three-stop mesh:
           * top-left  → vivid cobalt-indigo  #4756D9  (logo blue, bright)
           * center    → mid violet           #5B4FD4
           * bottom-right → warm magenta-violet #7C4FC4  (just a whisper of warmth)
           * Not too dark, not washed out — sits right in the jewel-tone zone.
           */
          background: "linear-gradient(135deg, #4756D9 0%, #5048CE 40%, #5145ff 100%)",
        }}
      >
        {/* Starfield */}
        <canvas ref={canvasRef} style={{ position:"absolute", inset:0, zIndex:1, pointerEvents:"none" }} />

        {/* Orbs */}
        <div className="orb-a" style={{ position:"absolute", top:-140, left:-100, width:540, height:540, borderRadius:"50%", background:"radial-gradient(circle, rgba(100,85,240,0.55) 0%, transparent 65%)", filter:"blur(55px)", zIndex:2, pointerEvents:"none" }} />
        <div className="orb-b" style={{ position:"absolute", bottom:-170, right:-90, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(160,90,220,0.45) 0%, transparent 65%)", filter:"blur(50px)", zIndex:2, pointerEvents:"none" }} />
        <div className="orb-c" style={{ position:"absolute", top:"38%", left:"58%", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle, rgba(90,120,240,0.35) 0%, transparent 70%)", filter:"blur(40px)", zIndex:2, pointerEvents:"none" }} />

        {/* Top radial glow */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:1000, height:480, background:"radial-gradient(ellipse at 50% 0%, rgba(220,210,255,0.14) 0%, transparent 58%)", zIndex:2, pointerEvents:"none" }} />

        {/* Bottom fade into next section */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:100, background:"linear-gradient(to bottom, transparent, rgba(60,40,140,0.25))", zIndex:2, pointerEvents:"none" }} />

        {/* Content */}
        <div style={{ position:"relative", zIndex:10, maxWidth:680, margin:"0 auto", padding:"88px 24px 110px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center" }}>



          {/* Heading */}
          <h1 className="hero-title fade-2" style={{ marginBottom:18 }}>
            Where Businesses Meet<br />
            Student Talent — Globally 
          </h1>

          {/* Sub */}
          <p className="hero-sub fade-3" style={{ marginBottom:34 }}>
            Connect with verified student talent from top universities worldwide.
            Post projects, get proposals, and ship faster — free to start.
          </p>

          {/* CTAs */}
          <div className="fade-4" style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", marginBottom:14 }}>
            <a href="/post" className="btn-white">Hire a Student — Free to list!</a>
            <a href="/gigs" className="btn-glass">Find Gigs &amp; Earn Globally</a>
          </div>

          {/* WhatsApp */}
          <div className="fade-4" style={{ marginBottom:48 }}>
            <a href="https://chat.whatsapp.com/HnNTBiWqIXN2oc4PG3Xghs" target="_blank" rel="noopener noreferrer" className="btn-wa">
              <FaWhatsapp style={{ fontSize:"1rem", color:"#6effa0" }} />
              Join Our Global Community
            </a>
          </div>

          {/* Feature pills */}
          <div className="pills-row fade-5">
            {features.map((f) => (
              <div key={f.label} className="f-pill">
                <span className="pill-icon">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          {/* Tagline */}
          <p className="fade-6" style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.13em", textTransform:"uppercase", marginTop:26 }}>
            Verified Talent · Secure Projects · Global Impact
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-wrap">
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
        </div>
      </section>
    </>
  );
}