"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Book, 
  Code, 
  Award, 
  ChevronLeft, 
  FileText, 
  Calendar, 
  Clock, 
  Trophy, 
  TrendingUp, 
  ArrowRight,
  Star,
  Activity
} from "lucide-react";

// Simplified types
interface UserStats {
  coursesCompleted: number;
  totalSubmissions: number;
  streak: number;
  certificates: number;
}

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  lastAccessed: string;
  category: string;
  estimatedCompletion?: string;
}

const EnhancedDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inProgress");

  // Mock API call
  useEffect(() => {
    const fetchUserData = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data
      setUserStats({
        coursesCompleted: 4,
        totalSubmissions: 37,
        streak: 16,
        certificates: 2,
      });

      setCourseProgress([
        {
          id: "defi-development",
          title: "DeFi Protocol Development",
          progress: 35,
          lastAccessed: "2 days ago",
          category: "Advanced",
          estimatedCompletion: "~3 weeks",
        },
        {
          id: "web3-integration",
          title: "Web3 Frontend Integration",
          progress: 78,
          lastAccessed: "Yesterday",
          category: "Intermediate",
          estimatedCompletion: "~5 days",
        },
        {
          id: "basics-of-solidity",
          title: "Basics of Solidity",
          progress: 100,
          lastAccessed: "1 week ago",
          category: "Beginner",
        },
        {
          id: "smart-contract-auditing",
          title: "Smart Contract Security & Auditing",
          progress: 12,
          lastAccessed: "3 days ago",
          category: "Advanced",
          estimatedCompletion: "~6 weeks",
        },
      ]);

      setLoading(false);
    };

    if (status === "authenticated") {
      fetchUserData();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-violet-900/50 p-8 max-w-md w-full shadow-lg shadow-violet-900/20">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-center mt-4 text-gray-400">
            Loading your blockchain learning journey...
          </p>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  const filterCourses = () => {
    if (activeTab === "completed") {
      return courseProgress.filter((course) => course.progress === 100);
    } else {
      return courseProgress.filter((course) => course.progress < 100);
    }
  };

  // Calculate recommended next course
  const getRecommendedCourse = () => {
    const inProgress = courseProgress.filter((course) => course.progress < 100);
    return inProgress.sort((a, b) => b.progress - a.progress)[0] || null;
  };

  const recommendedCourse = getRecommendedCourse();
  const filteredCourses = filterCourses();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
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

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <div className="text-sm bg-violet-900/30 px-3 py-1 rounded-full border border-violet-700/30">
            <span className="text-violet-300">Last Login: </span>
            <span className="text-gray-300">Today, 10:23 AM</span>
          </div>
        </div>

        {/* Dashboard title */}
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Code className="mr-2 mt-1 text-violet-400" />
          BlockChain Labs
        </h1>

        {/* Main content grid - alternative layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - User profile & stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* User profile card */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-violet-900/50 p-6 shadow-lg shadow-violet-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-bl-full -mr-8 -mt-8"></div>

              <div className="flex flex-col items-center relative">
                {/* Profile image */}
                {session.user.image ? (
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-md opacity-50"></div>
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="relative w-24 h-24 rounded-full border-4 border-violet-700 object-cover shadow-md shadow-violet-900/50"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-md opacity-50"></div>
                    <div className="relative w-24 h-24 rounded-full bg-violet-900/30 border-4 border-violet-700 flex items-center justify-center shadow-md shadow-violet-900/50">
                      <User className="w-12 h-12 text-violet-400" />
                    </div>
                  </div>
                )}

                {/* User level badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  Level 4
                </div>

                {/* User info */}
                <h1 className="text-xl font-bold mt-4">
                  {session.user.name || "Blockchain Developer"}
                </h1>
                <p className="text-gray-400 text-sm">
                  {session.user.email || ""}
                </p>

                {/* User streak badge */}
                <div className="flex items-center mt-2 bg-violet-900/20 px-3 py-1 rounded-full">
                  <Activity className="w-3 h-3 mr-1 text-violet-400" />
                  <span className="text-xs text-violet-300">
                    {userStats?.streak || 0} day streak
                  </span>
                </div>
              </div>

              {/* User stats */}
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-violet-900/20 hover:border-violet-700/40 transition-colors group">
                  <div className="flex items-center justify-center mb-2 text-violet-400 group-hover:text-violet-300 transition-colors">
                    <Book className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold group-hover:text-white transition-colors">
                    {userStats?.coursesCompleted || 0}
                  </p>
                  <p className="text-xs text-gray-400">Courses Completed</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-violet-900/20 hover:border-violet-700/40 transition-colors group">
                  <div className="flex items-center justify-center mb-2 text-violet-400 group-hover:text-violet-300 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold group-hover:text-white transition-colors">
                    {userStats?.totalSubmissions || 0}
                  </p>
                  <p className="text-xs text-gray-400">Total Submissions</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-violet-900/20 hover:border-violet-700/40 transition-colors group">
                  <div className="flex items-center justify-center mb-2 text-violet-400 group-hover:text-violet-300 transition-colors">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold group-hover:text-white transition-colors">
                    {userStats?.certificates || 0}
                  </p>
                  <p className="text-xs text-gray-400">Certificates</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-violet-900/20 hover:border-violet-700/40 transition-colors group">
                  <div className="flex items-center justify-center mb-2 text-violet-400 group-hover:text-violet-300 transition-colors">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold group-hover:text-white transition-colors">
                    72
                  </p>
                  <p className="text-xs text-gray-400">XP Points</p>
                </div>
              </div>
            </div>

            {/* Recommended Next Course */}
            {recommendedCourse && (
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-violet-900/50 overflow-hidden shadow-lg shadow-violet-900/10">
                <div className="p-4 border-b border-violet-900/20 bg-violet-900/20 flex justify-between items-center">
                  <h2 className="text-base font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    Recommended Next
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-violet-700/30 text-violet-300 border border-violet-700/30">
                    {recommendedCourse.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2 text-white">
                    {recommendedCourse.title}
                  </h3>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Last: {recommendedCourse.lastAccessed}
                    </span>
                    {recommendedCourse.estimatedCompletion && (
                      <span className="text-violet-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {recommendedCourse.estimatedCompletion}
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2.5 mt-4">
                    <div
                      className="bg-gradient-to-r from-violet-600 to-fuchsia-600 h-2.5 rounded-full relative"
                      style={{ width: `${recommendedCourse.progress}%` }}
                    >
                      <div className="absolute -right-1 -top-1 w-4 h-4 bg-white rounded-full border-2 border-violet-600 shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="font-medium text-violet-300">
                      {recommendedCourse.progress}% complete
                    </span>
                    <span className="text-gray-400">
                      {100 - recommendedCourse.progress}% remaining
                    </span>
                  </div>
                  <Link
                    href={`/courses/${recommendedCourse.id}`}
                    className="block w-full mt-4 text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md shadow-violet-900/20 hover:shadow-lg hover:shadow-violet-900/30"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            )}

            {/* Achievements Section */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-violet-900/50 overflow-hidden shadow-lg shadow-violet-900/10">
              <div className="p-4 border-b border-violet-900/20 bg-violet-900/20">
                <h2 className="text-base font-semibold flex items-center">
                  <Award className="w-4 h-4 mr-2 text-yellow-500" />
                  Recent Achievements
                </h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center p-2 bg-gray-800/50 rounded-lg border border-violet-900/20">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">
                        Smart Contract Master
                      </h3>
                      <p className="text-xs text-gray-400">
                        Completed Solidity course
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 bg-gray-800/50 rounded-lg border border-violet-900/20">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">14 Day Streak</h3>
                      <p className="text-xs text-gray-400">
                        Consistent learning
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 bg-gray-800/50 rounded-lg border border-violet-900/20">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">Web3 Integrator</h3>
                      <p className="text-xs text-gray-400">
                        First app deployment
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/achievements"
                  className="block w-full mt-4 text-center text-violet-400 hover:text-violet-300 text-sm font-medium py-2 transition-colors"
                >
                  View All Achievements
                  <ArrowRight className="w-3 h-3 inline-block ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right column - Course progress */}
          <div className="lg:col-span-8 space-y-6">
            {/* Course progress card */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-violet-900/50 overflow-hidden shadow-lg shadow-violet-900/10">
              <div className="p-4 border-b border-violet-900/20 bg-violet-900/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-semibold">
                    Your Learning Progress
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeTab === "inProgress"
                          ? "bg-violet-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveTab("inProgress")}
                    >
                      In Progress
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeTab === "completed"
                          ? "bg-violet-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveTab("completed")}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-10">
                    <Book className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <h3 className="text-gray-400">
                      No{" "}
                      {activeTab === "completed" ? "completed" : "in-progress"}{" "}
                      courses found
                    </h3>
                    <Link
                      href="/courses"
                      className="inline-block mt-4 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                    >
                      Browse Available Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-gray-800/50 rounded-lg p-4 border border-violet-900/20 hover:border-violet-700/40 transition-all hover:shadow-md hover:shadow-violet-900/20"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-white">
                            {course.title}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-violet-700/30 text-violet-300 border border-violet-700/30">
                            {course.category}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Last: {course.lastAccessed}
                          </span>
                          {course.estimatedCompletion && (
                            <span className="text-violet-400 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {course.estimatedCompletion}
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2.5 mt-4">
                          <div
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 h-2.5 rounded-full relative"
                            style={{ width: `${course.progress}%` }}
                          >
                            {course.progress < 100 && (
                              <div className="absolute -right-1 -top-1 w-4 h-4 bg-white rounded-full border-2 border-violet-600 shadow-sm"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="font-medium text-violet-300">
                            {course.progress}% complete
                          </span>
                          {course.progress < 100 ? (
                            <span className="text-gray-400">
                              {100 - course.progress}% remaining
                            </span>
                          ) : (
                            <span className="text-green-400">Completed</span>
                          )}
                        </div>
                        <div className="mt-4">
                          <Link
                            href={`/courses/${course.id}`}
                            className={`block w-full text-center ${
                              course.progress === 100
                                ? "bg-green-600 hover:bg-green-500"
                                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
                            } text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md shadow-violet-900/20 hover:shadow-lg hover:shadow-violet-900/30`}
                          >
                            {course.progress === 100
                              ? "Review Course"
                              : "Continue Learning"}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  href="/courses"
                  className="block w-full mt-6 text-center text-violet-400 hover:text-violet-300 text-sm font-medium py-2 transition-colors"
                >
                  View All Courses
                  <ArrowRight className="w-3 h-3 inline-block ml-1" />
                </Link>
              </div>
            </div>

            {/* Dashboard panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly activity panel */}
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-violet-900/50 p-4 shadow-lg shadow-violet-900/10">
                <h2 className="text-base font-semibold mb-4">
                  Weekly Activity
                </h2>
                <div className="flex justify-between items-end h-32">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <div key={day} className="flex flex-col items-center">
                      <div
                        className="w-6 bg-gradient-to-t from-violet-600 to-fuchsia-600 rounded-t-md"
                        style={{
                          height: `${[20, 45, 65, 30, 80, 55, 35][index]}%`,
                          opacity: index === 4 ? 1 : 0.7,
                        }}
                      ></div>
                      <div
                        className={`text-xs mt-2 ${
                          index === 4
                            ? "text-violet-400 font-bold"
                            : "text-gray-400"
                        }`}
                      >
                        {day}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-4 text-center">
                  Your best day was Friday with 3 hours of learning
                </div>
              </div>

              {/* Upcoming sessions panel */}
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-violet-900/50 p-4 shadow-lg shadow-violet-900/10">
                <h2 className="text-base font-semibold mb-4">
                  Upcoming Sessions
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center p-2 bg-gray-800/50 rounded-lg border border-violet-900/20">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">
                        Live Coding Session
                      </h3>
                      <p className="text-xs text-gray-400">Today, 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 bg-gray-800/50 rounded-lg border border-violet-900/20">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">Mentorship Call</h3>
                      <p className="text-xs text-gray-400">
                        Tomorrow, 10:00 AM
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/schedule"
                  className="block w-full mt-4 text-center text-violet-400 hover:text-violet-300 text-sm font-medium py-2 transition-colors"
                >
                  View Full Schedule
                  <ArrowRight className="w-3 h-3 inline-block ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;