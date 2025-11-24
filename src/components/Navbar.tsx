import Link from "next/link";
import Image from "next/image";
import purpleLogo from "../../public/assets/purplelogo.png";
import NavbarClient from "./NavbarClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  const loggedIn = !!session?.user;
  const userName = session?.user?.name || session?.user?.email || "";
  const userId = session?.user?.id || null; // ✅ add this

  return (
    <nav className="w-full z-50 fixed top-0 left-0 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <Link href="/" className="flex items-center">
          <Image src={purpleLogo} alt="Logo" width={80} height={80} priority />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/post">Post</Link>
          <Link href="/gigs">Apply</Link>
          <Link href="/blog">Blog</Link>

          <NavbarClient
            loggedIn={loggedIn}
            userName={userName}
            userId={userId}
          />
        </div>

        <div className="md:hidden">
          <NavbarClient
            loggedIn={loggedIn}
            userName={userName}
            userId={userId}
            isMobile
          />
        </div>

      </div>
    </nav>
  );
}