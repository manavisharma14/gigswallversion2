import Link from 'next/link';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-[#4B55C3] via-[#6366F1] to-[#8B8DF8] text-white py-12 px-4 sm:px-8 md:px-24 font-bricolage">
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10 backdrop-brightness-90 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Left Section: Brand + Description + Social */}
        <div className="flex flex-col space-y-4 max-w-sm">
          <div className="text-2xl font-extrabold tracking-tight drop-shadow-md">
            GigsWall
          </div>
          <p className="text-sm leading-relaxed opacity-90">
            Where student talent meets opportunity. Post gigs, apply to projects,
            and build real-world experience within your campus community.
          </p>

          <div className="flex items-center gap-5 pt-2">
            <a
              href="https://instagram.com/gigswall"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              title="Instagram"
            >
              <FaInstagram className="text-lg" />
            </a>
            <a
              href="https://www.linkedin.com/company/gigswall"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              title="LinkedIn"
            >
              <FaLinkedin className="text-lg" />
            </a>
          </div>
        </div>

        {/* Right Section: Navigation + Contact */}
        <div className="flex flex-col sm:flex-row md:gap-16 gap-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Explore
            </h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/post" className="hover:underline">Post</Link>
              <Link href="/gigs" className="hover:underline">Apply</Link>
              <a href="#faq" className="hover:underline">FAQ</a>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Contact
            </h3>
            <p className="text-sm opacity-90">
              Questions or feedback? <br />
              Reach us at:
            </p>
            <a
              href="mailto:info@gigswall.com"
              className="text-sm font-medium hover:underline mt-1 inline-block"
            >
              info@gigswall.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 mt-10 pt-6 border-t border-white/20 text-center text-xs opacity-80">
        © {new Date().getFullYear()} GigsWall — All rights reserved.
      </div>
    </footer>
  );
}