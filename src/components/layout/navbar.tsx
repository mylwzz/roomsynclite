// src/components/layout/navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { authClient, useSession } from "@/lib/auth-client";
import { useState, useEffect }    from "react";

function Logo() {
  return (
    <motion.div
      animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
      className="rounded-md px-3 py-1 font-bold text-white shadow-inner
                 bg-[length:200%_200%] bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-400"
    >
      <span className="text-black">RoomSync&nbsp;</span>
      <span className="text-cyan-300">Lite</span>
    </motion.div>
  );
}

type Profile = { role: string; age?: number };

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);

  // pull in your profile so we know your role
  useEffect(() => {
    if (session?.user) {
      fetch("/api/profile")
        .then((r) => r.ok ? r.json() : null)
        .then((p) => setProfile(p))
        .catch(() => setProfile(null));
    }
  }, [session]);

  if (isPending) return <div className="h-16 bg-white shadow" />;

  const navCls = (href: string) =>
    `px-3 py-2 rounded-md ${
      pathname === href ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" aria-label="Home"><Logo /></Link>
        <div className="flex items-center space-x-4">
          <Link href="/about" className={navCls("/about")}>About</Link>

          {session?.user ? (
            <>
              <Link href="/browse" className={navCls("/browse")}>Browse</Link>
              <Link href="/contacts" className={navCls("/contacts")}>Matches</Link>

              {/* only show “Admin” if your profile.role === "admin" */}
              {profile?.role === "admin" && (
                <Link href="/admin" className={navCls("/admin")}>
                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-semibold">
                    ADMIN
                  </span>
                </Link>
              )}

              <details className="relative">
                <summary className="cursor-pointer px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center">
                  {session.user.name}
                </summary>
                <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 p-2 space-y-1 text-sm z-50">
                  <li className="px-3 py-1 text-gray-700">{session.user.name}{profile?.age && <> · {profile.age}</>}</li>
                  <li className="px-3 py-1 text-gray-500 break-all">{session.user.email}</li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Sign&nbsp;Out
                    </button>
                  </li>
                </ul>
              </details>
            </>
          ) : (
            <Link href="/" className={navCls("/")}>Sign&nbsp;In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}