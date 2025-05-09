"use client";

import Link           from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion }     from "framer-motion";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const pathname = usePathname();
  useEffect(() => {
    authClient.getSession().then(r => setSession(r.data));
  }, [pathname]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    authClient.getSession()
      .then((r) => setSession(r.data))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  const signOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const navCls = (href: string) =>
    `px-3 py-2 rounded-md ${
      pathname === href ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  if (loading) return <div className="h-16 bg-white shadow" />;

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" aria-label="Home">
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
            className="rounded-md px-3 py-1 font-bold text-white shadow-inner bg-[length:200%_200%] bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-400"
          >
            <span className="text-black">RoomSync&nbsp;</span>
            <span className="text-cyan-300">Lite</span>
          </motion.div>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-4">
          <Link href="/about" className={navCls("/about")}>About</Link>

          {session?.user ? (
            <>
              <Link href="/browse"   className={navCls("/browse")}>Browse</Link>
              <Link href="/contacts" className={navCls("/contacts")}>Matches</Link>
              <details className="relative">
                <summary className="cursor-pointer px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200">
                  {session.user.name}
                </summary>
                <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 p-2 space-y-1 text-sm z-50">
                  <li className="px-3 py-1 text-gray-700">
                    {session.user.name}
                    {session.profile?.age && <> · {session.profile.age}</>}
                  </li>
                  <li className="px-3 py-1 text-gray-500 break-all">
                    {session.user.email}
                  </li>
                  <li>
                    <button
                      onClick={signOut}
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