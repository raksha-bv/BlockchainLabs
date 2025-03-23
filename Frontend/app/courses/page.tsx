"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Moon,
  Sun,
  Clock,
  Book,
  Search,
  ChevronRight,
  Filter,
  Code,
  Users,
  Zap,
  Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { useSession } from "next-auth/react"; // Make sure you have next-auth set up

// Course type definition
export interface Course {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessonCount: number;
  image: string;
  tags: string[];
  registrations: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCourses, setUserCourses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "all" | "Beginner" | "Intermediate" | "Advanced"
  >("all");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Fetch courses from the database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch user's registered courses if user is logged in
  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserCourses = async () => {
        try {
          const response = await fetch(
            `/api/users/courses?email=${session.user?.email}`
          );
          if (response.ok) {
            const data = await response.json();
            // Extract just the course IDs
            setUserCourses(data.courses.map((course: any) => course.id));
          }
        } catch (error) {
          console.error("Failed to fetch user courses:", error);
        }
      };

      fetchUserCourses();
    }
  }, [session]);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Handler for course registration
  const handleCourseRegistration = async (courseId: string) => {
    if (!session?.user?.email) {
      // Redirect to login if user is not logged in
      router.push("/login?callbackUrl=/courses");
      return;
    }

    try {
      const response = await fetch("/api/courses/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          courseId: courseId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // If successful and it's a new registration, add to user courses
        if (data.isNewRegistration) {
          setUserCourses((prev) => [...prev, courseId]);

          // Update the course count in the UI (optional)
          setCourses(
            courses.map((course) =>
              course.id === courseId
                ? { ...course, registrations: course.registrations + 1 }
                : course
            )
          );
        }

        // Navigate to the course page
        router.push(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error("Failed to register for course:", error);
    }
  };

  // Filter courses based on search term and level filter
  const filteredCourses = courses.filter(
    (course) =>
      (filter === "all" || course.level === filter) &&
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  // Get difficulty color based on level
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-green-400 bg-green-400/20";
      case "Intermediate":
        return "text-blue-400 bg-blue-400/20";
      case "Advanced":
        return "text-violet-400 bg-violet-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <BackButton />
      {/* Simplified background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.1),transparent_70%)]"></div>
      </div>

      {/* Header area with title */}
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-12 ">
          <div className="text-center mb-12 mt-12">
            <div className="mb-3">
              <span className="bg-violet-900/30 text-violet-400 text-xs font-medium px-3 py-1 rounded-full inline-block">
                Web3 Curriculum
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Blockchain <span className="text-violet-400">Learning Path</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Master blockchain development with our comprehensive courses. From
              beginner fundamentals to advanced DeFi and security protocols.
            </p>
          </div>

          {/* Stats section - simplified to a single row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-gray-900/60 rounded-lg border border-violet-900/50 p-4 flex items-center">
              <Book className="w-5 h-5 text-violet-400 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Total Courses</p>
                <h3 className="text-xl font-bold text-white">
                  {courses.length}
                </h3>
              </div>
            </div>
            <div className="bg-gray-900/60 rounded-lg border border-violet-900/50 p-4 flex items-center">
              <Code className="w-5 h-5 text-violet-400 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Lessons</p>
                <h3 className="text-xl font-bold text-white">
                  {courses.reduce((sum, course) => sum + course.lessonCount, 0)}
                </h3>
              </div>
            </div>
            <div className="bg-gray-900/60 rounded-lg border border-violet-900/50 p-4 flex items-center">
              <Users className="w-5 h-5 text-violet-400 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Active Students</p>
                <h3 className="text-xl font-bold text-white">
                  {courses
                    .reduce((sum, course) => sum + course.registrations, 0)
                    .toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* Filter and search bar - simplified layout */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="w-full md:w-auto flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-auto bg-gray-900/60 p-1 rounded-lg border border-violet-900/30 flex items-center">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    filter === "all"
                      ? "bg-violet-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("Beginner")}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    filter === "Beginner"
                      ? "bg-violet-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => setFilter("Intermediate")}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    filter === "Intermediate"
                      ? "bg-violet-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  Intermediate
                </button>
                <button
                  onClick={() => setFilter("Advanced")}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    filter === "Advanced"
                      ? "bg-violet-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  Advanced
                </button>
              </div>

              <div className="w-full md:w-64 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full bg-gray-900/60 border border-violet-900/30 rounded-lg py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Link
              href="/request-course"
              className="w-full md:w-auto px-4 py-2 bg-violet-700 hover:bg-violet-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              Request New Course
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Popular tags - simplified */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="text-sm text-gray-400 mr-2">Popular:</div>
            {Array.from(new Set(courses.flatMap((course) => course.tags)))
              .slice(0, 8)
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 hover:bg-violet-900/30 hover:text-violet-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
          </div>

          {/* Course grid - simplified cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <div className="bg-gray-900/60 rounded-lg border border-violet-900/50 p-8">
                  <Search className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your search or filter.
                  </p>
                </div>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-900/60 border border-violet-900/30 rounded-lg overflow-hidden hover:border-violet-700 transition-all group"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(
                          course.level
                        )}`}
                      >
                        {course.level}
                      </span>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-3 h-3 mr-1" />
                        {course.registrations.toLocaleString()}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-violet-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {course.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <Book className="w-4 h-4 mr-1" />
                        {course.lessonCount} lessons
                      </div>
                    </div>
                  </div>

                  {userCourses.includes(course.id) ? (
                    <Link
                      href={`/courses/${course.id}`}
                      className="block bg-violet-700 hover:bg-violet-600 px-5 py-3 text-center text-sm font-medium text-white transition-colors"
                    >
                      Continue Learning
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleCourseRegistration(course.id)}
                      className="block w-full bg-gray-800 hover:bg-violet-700 px-5 py-3 text-center text-sm font-medium text-white transition-colors"
                    >
                      Start Course
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Theme toggle button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed right-5 bottom-5 p-3 bg-gray-800 text-white rounded-full shadow-lg"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
}
