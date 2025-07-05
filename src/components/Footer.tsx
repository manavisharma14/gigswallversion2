import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#4B55C3] via-[#6366F1] to-[#8B8DF8] text-white py-10 px-4 sm:px-6 md:px-24 font-bricolage">
      
      {/* Top Row: Brand + Nav */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="text-2xl font-extrabold">GigsWall</div>

        <nav className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/80">
          <Link href="#home" className="hover:text-white hover:underline transition">Home</Link>
          <Link href="/post" className="hover:text-white hover:underline transition">Post</Link>
          <Link href="/gigs" className="hover:text-white hover:underline transition">Apply</Link>
          <a href="#faq" className="hover:text-white hover:underline transition">FAQ</a>
          <a href="#contact" className="hover:text-white hover:underline transition">Contact</a>
        </nav>
      </div>

      {/* Contact + Social */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-white/70 gap-4 text-center sm:text-left">
        <p>
          Contact us:{' '}
          <a
            href="mailto:gigswall.work@gmail.com"
            className="text-white font-medium hover:underline"
          >
            gigswall.work@gmail.com
          </a>
        </p>

        <a
          href="https://instagram.com/gigswall"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-white hover:underline transition"
          title="Visit our Instagram"
        >
          <FaInstagram className="text-lg" />
          @gigswall
        </a>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-xs text-white/60">
        © {new Date().getFullYear()} GigsWall. Built by students, for students.
      </div>
    </footer>
  );
}
