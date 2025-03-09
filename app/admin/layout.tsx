"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  BarChart,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not admin
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-red-500 mx-auto animate-pulse" />
          <h2 className="mt-4 text-xl">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gray-900 border-r border-gray-800 fixed h-full z-10"
      >
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold tracking-tighter">
              Criminal Diaries
            </span>
          </Link>
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center space-x-3 mb-6 bg-gray-800/50 p-3 rounded-lg">
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={
                  user.profilePicture || "/placeholder.svg?height=40&width=40"
                }
                alt={user.username}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{user.username}</div>
              <div className="text-xs text-red-400">Administrator</div>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg px-3 py-2 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/stories"
              className="flex items-center space-x-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg px-3 py-2 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Stories</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg px-3 py-2 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/comments"
              className="flex items-center space-x-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg px-3 py-2 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Comments</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center space-x-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg px-3 py-2 transition-colors"
            >
              <BarChart className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg px-3 py-2 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center space-x-3 text-gray-300 hover:text-red-400 w-full px-3 py-2 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="ml-64 w-full">{children}</div>
    </div>
  );
}
