"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

// Course type definition
export interface Course {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessonCount: number;
  image: string;
}

// Sample courses data
const courses: Course[] = [
  {
    id: "basics-of-solidity",
    title: "Basics of Solidity",
    description:
      "Learn the fundamentals of Solidity programming and smart contract development for blockchain applications.",
    level: "Beginner",
    duration: "3 days",
    lessonCount: 7,
    image: "/solidity.png",
  },
  // Additional courses can be easily added here
  {
    id: "advanced-smart-contracts",
    title: "Advanced Smart Contracts",
    description:
      "Dive deeper into complex smart contract patterns, security considerations, and optimization techniques.",
    level: "Intermediate",
    duration: "6 weeks",
    lessonCount: 15,
    image: "",
  },
  {
    id: "defi-development",
    title: "DeFi Protocol Development",
    description:
      "Build decentralized finance applications including lending protocols, exchanges, and yield farming systems.",
    level: "Advanced",
    duration: "8 weeks",
    lessonCount: 20,
    image: "",
  },
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Dark mode colors (matching the chatbot app)
  const darkColors = {
    primary: "#7C3AED", // Violet-600
    primaryHover: "#6D28D9", // Violet-700
    accent: "#8B5CF6", // Violet-500
    background: "#0F0F0F", // Near black
    cardBg: "#1A1A1A", // Dark gray
    cardBgSecondary: "#212121", // Slightly lighter dark gray
    borderColor: "#2D2D2D", // Medium gray
    accentBorder: "#7C3AED", // Violet-600
    textPrimary: "#F9FAFB", // Gray-50
    textSecondary: "#E5E7EB", // Gray-200
    textMuted: "#9CA3AF", // Gray-400
    textAccent: "#A78BFA", // Violet-400
  };

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

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main
      className={`min-h-screen flex flex-col items-center bg-grid-pattern ${
        darkMode ? "dark" : ""
      }`}
      style={
        darkMode
          ? { backgroundColor: darkColors.background }
          : { backgroundColor: "#f9fafb" }
      }
    >
      <Head>
        <title>Courses | Blockchain Learning Platform</title>
        <meta
          name="description"
          content="Learn blockchain development through interactive courses"
        />
      </Head>

      <div className="z-10 w-full max-w-7xl">
        {/* Header */}
        <header
          className="py-4 px-6 flex justify-between items-center border-b sticky top-0"
          style={
            darkMode
              ? {
                  borderColor: darkColors.borderColor,
                  backgroundColor: `${darkColors.background}20`,
                }
              : {
                  borderColor: "rgb(229, 231, 235)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }
          }
        >
          <h1
            className="text-2xl font-bold"
            style={
              darkMode
                ? { color: darkColors.textSecondary }
                : {
                    backgroundImage:
                      "linear-gradient(to right, #C1A5E1, #A7C7E7)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }
            }
          >
            Blockchain Learning Platform
          </h1>
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle - Styled like the chatbot version */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full transition-colors duration-200"
              style={
                darkMode
                  ? {
                      backgroundColor: darkColors.cardBgSecondary,
                      color: darkColors.textAccent,
                    }
                  : {
                      backgroundColor: "rgb(229, 231, 235)",
                      color: "rgb(139, 92, 246)",
                    }
              }
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Navigation */}
            <nav className="flex gap-6">
              <Link
                href="/"
                className="transition-colors"
                style={
                  darkMode
                    ? { color: darkColors.textSecondary }
                    : { color: "rgb(75, 85, 99)" }
                }
              >
                Home
              </Link>
              <Link
                href="/courses"
                className="font-medium"
                style={{ color: darkColors.accent }}
              >
                Courses
              </Link>
              <Link
                href="/practice"
                className="transition-colors"
                style={
                  darkMode
                    ? { color: darkColors.textSecondary }
                    : { color: "rgb(75, 85, 99)" }
                }
              >
                Practice Arena
              </Link>
              <Link
                href="/chatbot"
                className="transition-colors"
                style={
                  darkMode
                    ? { color: darkColors.textSecondary }
                    : { color: "rgb(75, 85, 99)" }
                }
              >
                AI Assistant
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-3xl font-bold"
              style={
                darkMode
                  ? { color: darkColors.textSecondary }
                  : {
                      backgroundImage:
                        "linear-gradient(to right, #C1A5E1, #A7C7E7)",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }
              }
            >
              Blockchain Courses
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 border"
                style={
                  darkMode
                    ? ({
                        backgroundColor: darkColors.cardBgSecondary,
                        borderColor: darkColors.borderColor,
                        color: darkColors.textPrimary,
                        "--placeholder-color": darkColors.textMuted,
                        "--focus-ring-color": darkColors.accentBorder,
                      } as React.CSSProperties)
                    : ({
                        backgroundColor: "white",
                        borderColor: "rgb(209, 213, 219)",
                        "--focus-ring-color": "rgb(139, 92, 246)",
                      } as React.CSSProperties)
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="w-5 h-5 absolute right-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={
                  darkMode
                    ? { color: darkColors.textMuted }
                    : { color: "rgb(156, 163, 175)" }
                }
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-xl overflow-hidden shadow-lg border transition-all transform hover:-translate-y-1 cursor-pointer"
                style={
                  darkMode
                    ? {
                        backgroundColor: `${darkColors.cardBg}CC`,
                        borderColor: darkColors.borderColor,
                        boxShadow: `0 4px 6px -1px ${darkColors.background}`,
                      }
                    : {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderColor: "rgb(229, 231, 235)",
                      }
                }
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                <div
                  className="h-48 relative bg-cover bg-center"
                  style={{
                    backgroundImage: course.image
                      ? `url(${course.image})`
                      : darkMode
                      ? `linear-gradient(to bottom right, ${darkColors.primary}30, ${darkColors.cardBg})`
                      : "linear-gradient(to bottom right, rgba(139, 92, 246, 0.3), rgba(255, 255, 255, 0.8))",
                  }}
                >
                  {!course.image && (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-5xl font-bold"
                      style={{ color: darkColors.accent }}
                    >
                      {course.title.charAt(0)}
                    </div>
                  )}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1/3"
                    style={{
                      background: darkMode
                        ? `linear-gradient(to top, ${darkColors.cardBg}, transparent)`
                        : "linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent)",
                    }}
                  ></div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="text-xl font-bold"
                      style={
                        darkMode
                          ? { color: darkColors.textPrimary }
                          : { color: "rgb(31, 41, 55)" }
                      }
                    >
                      {course.title}
                    </h3>
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor:
                          course.level === "Beginner"
                            ? "rgba(16, 185, 129, 0.2)"
                            : course.level === "Intermediate"
                            ? "rgba(59, 130, 246, 0.2)"
                            : "rgba(139, 92, 246, 0.2)",
                        color:
                          course.level === "Beginner"
                            ? "#10B981"
                            : course.level === "Intermediate"
                            ? "#3B82F6"
                            : "#8B5CF6",
                      }}
                    >
                      {course.level}
                    </span>
                  </div>
                  <p
                    className="mb-4"
                    style={
                      darkMode
                        ? { color: darkColors.textSecondary }
                        : { color: "rgb(107, 114, 128)" }
                    }
                  >
                    {course.description}
                  </p>
                  <div
                    className="flex justify-between text-sm pt-2 border-t"
                    style={
                      darkMode
                        ? {
                            borderColor: `${darkColors.borderColor}50`,
                            color: darkColors.textMuted,
                          }
                        : {
                            borderColor: "rgba(229, 231, 235, 0.5)",
                            color: "rgb(156, 163, 175)",
                          }
                    }
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: darkColors.accent }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: darkColors.accent }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {course.lessonCount} lessons
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div
              className="text-center py-16 rounded-xl mt-8 backdrop-blur-sm"
              style={
                darkMode
                  ? {
                      backgroundColor: `${darkColors.cardBg}30`,
                      color: darkColors.textSecondary,
                    }
                  : {
                      backgroundColor: "rgba(243, 244, 246, 0.3)",
                      color: "rgb(75, 85, 99)",
                    }
              }
            >
              <h3 className="text-2xl font-medium">
                No courses found matching your search
              </h3>
              <button
                className="mt-4 px-4 py-2 rounded-lg transition-colors"
                style={
                  darkMode
                    ? {
                        backgroundColor: darkColors.primary,
                        color: darkColors.textPrimary,
                      }
                    : { backgroundColor: "rgb(139, 92, 246)", color: "white" }
                }
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
