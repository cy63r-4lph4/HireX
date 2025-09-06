"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bars3Icon,
  BoltIcon,
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useUserRole } from "~~/hooks/useUserRole";

export const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userRole, setUserRole } = useUserRole();

  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(burgerMenuRef, () => setIsMobileMenuOpen(false));

  const workerNavItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/tasks", icon: MagnifyingGlassIcon, label: "Find Tasks" },
    // { path: "/post-task", icon: PlusCircleIcon, label: "Post Task" },
  ];

  const clientNavItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/workers", icon: UsersIcon, label: "Find Workers" },
    { path: "/post", icon: PlusCircleIcon, label: "Post Job" },
  ];

  const navItems = userRole === "worker" ? workerNavItems : clientNavItems;

  const toggleRole = () => {
    setUserRole(userRole === "worker" ? "client" : "worker");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BoltIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-orbitron text-xl font-bold gradient-text">HireX</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                href={path}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition ${
                  pathname === path ? "bg-blue-500/20 text-blue-400" : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center ml-3 space-x-4">
            {/* Role Switch Button */}
            <button
              onClick={toggleRole}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5  hover:bg-white/10"
            >
              <Cog6ToothIcon className="w-4 h-4" />
              {userRole === "worker" ? "Worker Mode" : "Client Mode"}
            </button>

            <RainbowKitCustomConnectButton />

            <button
              className=" md:hidden p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-white" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            ref={burgerMenuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-white/20"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  href={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    pathname === path
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}

              <button
                onClick={toggleRole}
                className=" mx-4 mt-2 px-3 py-2 rounded-lg neon-border bg-transparent hover:bg-white/10"
              >
                Switch to {userRole === "worker" ? "Client" : "Worker"} Mode
              </button>

              {/* Wallet + Faucet (mobile) */}
              <div className="px-4 mt-3 flex flex-col space-y-2">
                <RainbowKitCustomConnectButton />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};
