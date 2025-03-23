"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SignIn from "@/components/SignIn";
import { Lock, BookOpen, Code, Star, BriefcaseConveyorBelt } from "lucide-react";

const UnauthenticatedCoursesPage = () => {
  const { status } = useSession();
  const router = useRouter();

  // If user becomes authenticated, redirect to courses page
  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/courses");
    }
  }, [status, router]);

  return (
    <div className="h-screen bg-gray-950 text-gray-100 overflow-hidden flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_rgba(109,40,217,0.1),transparent_70%)]"></div>
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-1/3 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute pointer-events-none opacity-20 select-none">
          <svg width="100%" height="100%" className="absolute inset-0">
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(120, 50, 200, 0.1)"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <Navbar />

      <div className="relative flex flex-grow items-center justify-center px-4">
        <div className="max-w-lg w-full bg-gray-900/60 backdrop-blur-sm rounded-lg border border-violet-900/50 shadow-lg shadow-violet-900/20 overflow-hidden">
          {/* Header Section */}
          <div className="border-b border-violet-900/20 bg-violet-900/20 p-4 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-bl-full -mr-6 -mt-6"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center mr-3 shadow-md shadow-violet-900/50">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="text-violet-400">Courses</span> Access
                </h1>
                <p className="text-gray-400 text-xs">Authentication Required</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Main content */}
            <div className="mb-4">
              <p className="text-gray-300 text-sm">
                Please log in to access the Blockchain Labs Courses, designed to
                help you master blockchain development through structured
                learning.
              </p>
            </div>

            {/* Auth buttons */}
            <div className="space-y-3 mb-4 flex flex-col justify-center items-center">
              <SignIn />
              <div className="text-center text-gray-400 text-xs">
                Don't have an account?{" "}
                <span className="text-violet-400 hover:text-violet-300 hover:underline transition-colors">
                  Just Sign In
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-violet-900/30"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gray-900/60 text-xs text-violet-400">
                  Course Benefits
                </span>
              </div>
            </div>

            {/* Benefits grid - 2x2 compact grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800/50 rounded-lg p-2 border border-violet-900/20 hover:border-violet-700/40 transition-colors group">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-violet-900/30 rounded-full flex items-center justify-center mr-2 text-violet-400 group-hover:text-violet-300 transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium group-hover:text-white transition-colors">
                      Structured Learning
                    </h3>
                    <p className="text-xs text-gray-400">
                      Step-by-step modules
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-2 border border-violet-900/20 hover:border-violet-700/40 transition-colors group">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-violet-900/30 rounded-full flex items-center justify-center mr-2 text-violet-400 group-hover:text-violet-300 transition-colors">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium group-hover:text-white transition-colors">
                      Hands-on Projects
                    </h3>
                    <p className="text-xs text-gray-400">Build as you learn</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-2 border border-violet-900/20 hover:border-violet-700/40 transition-colors group">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-violet-900/30 rounded-full flex items-center justify-center mr-2 text-violet-400 group-hover:text-violet-300 transition-colors">
                    <BriefcaseConveyorBelt className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium group-hover:text-white transition-colors">
                      Course Completion
                    </h3>
                    <p className="text-xs text-gray-400">Earn certificates</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-2 border border-violet-900/20 hover:border-violet-700/40 transition-colors group">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-violet-900/30 rounded-full flex items-center justify-center mr-2 text-violet-400 group-hover:text-violet-300 transition-colors">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium group-hover:text-white transition-colors">
                      Expert Content
                    </h3>
                    <p className="text-xs text-gray-400">Industry insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-4 pt-2 border-t border-violet-900/20 text-center">
              <span className="text-xs text-gray-400">
                Unlock comprehensive blockchain education with our course
                catalog
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthenticatedCoursesPage;
