"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import {
  ChevronLeft,
  Menu,
  X,
  Moon,
  Sun,
  Book,
  Clock,
  Users,
  LightbulbIcon,
} from "lucide-react";
import type { Course } from "../page";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { solidityCourse } from "@/utils/solidityCourse";
import LessonChallenge from "@/components/LessonChallenge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  problemStatements,
  getInitialCodeTemplate,
} from "@/utils/problemStatements";

// Define problem statement type
interface ProblemStatement {
  title: string;
  description: string;
  requirements: string[];
  hints: string[];
}

// Define lesson type with problem statement
interface Lesson {
  id: string;
  title: string;
  content: string;
  problemStatement?: ProblemStatement; // Optional problem statement
}

type ThemeMode = "dark" | "light";

// Define full course type with lessons
interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

const coursesData: { [key: string]: CourseWithLessons } = {
  "basics-of-solidity": {
    ...solidityCourse,
    lessons: solidityCourse.lessons.map((lesson) => ({
      ...lesson,
      problemStatement: problemStatements[lesson.id],
    })),
  },
};

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = React.use(
    params as unknown as Promise<{ id: string }>
  );
  const id = unwrappedParams.id;

  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [course, setCourse] = useState<CourseWithLessons | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState<{
    [key: string]: boolean;
  }>({});
  const [showProblemStatement, setShowProblemStatement] = useState(true);

  // Get current lesson index
  const currentLessonIndex =
    course?.lessons.findIndex((l) => l.id === currentLesson?.id) ?? 0;

  useEffect(() => {
    // Fetch course data based on the route id
    if (id) {
      const foundCourse = coursesData[id];
      if (foundCourse) {
        setCourse(foundCourse);

        // Set initial lesson
        if (lessonId) {
          const lesson = foundCourse.lessons.find((l) => l.id === lessonId);
          if (lesson) {
            setCurrentLesson(lesson);
          } else {
            setCurrentLesson(foundCourse.lessons[0]);
          }
        } else {
          setCurrentLesson(foundCourse.lessons[0]);
        }
      }
    }

    // Load completed lessons from localStorage
    const savedProgress = localStorage.getItem(`course_progress_${id}`);
    if (savedProgress) {
      setLessonCompleted(JSON.parse(savedProgress));
    }
  }, [id, lessonId]);
  useEffect(() => {
    if (currentLesson) {
      // Reset code editor state by modifying the LessonChallenge component
      // This depends on how your LessonChallenge component handles the code state
      const editorElement = document.querySelector("[data-lesson-editor]");
      if (editorElement) {
        // Reset any editor-related DOM state
        editorElement.innerHTML = "";
      }
    }
  }, [currentLesson?.id]);

  // Handle lesson change
  const handleLessonChange = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    // Update URL
    router.push(`/courses/${id}?lessonId=${lesson.id}`);

    // Scroll main content to top
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  };

  // Handle challenge completion
  const handleChallengeComplete = () => {
    if (currentLesson) {
      const updatedCompletions = {
        ...lessonCompleted,
        [currentLesson.id]: true,
      };

      setLessonCompleted(updatedCompletions);

      // Save progress to localStorage
      localStorage.setItem(
        `course_progress_${id}`,
        JSON.stringify(updatedCompletions)
      );
    }
  };

  // Check if next lesson is available
  const canProceedToNextLesson = () => {
    if (!currentLesson) return false;
    return (
      !currentLesson.problemStatement ||
      lessonCompleted[currentLesson.id] === true
    );
  };

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

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.1),transparent_70%)]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 py-4 px-6 border-b border-violet-900/30 backdrop-blur-sm bg-gray-900/60">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/courses"
              className="mr-4 text-gray-400 hover:text-violet-400 transition-colors"
              aria-label="Back to courses"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white">{course.title}</h1>
            <span
              className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(
                course.level
              )}`}
            >
              {course.level}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle Button - purely decorative in this implementation */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full transition-colors duration-300 bg-gray-800 text-gray-300 hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors bg-gray-800 text-gray-300 hover:bg-gray-700"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-64 border-r border-violet-900/30 flex-shrink-0 transition-all duration-300 lg:translate-x-0 absolute lg:relative z-20 h-[calc(100vh-4rem)] bg-gray-900/80 backdrop-blur-sm overflow-hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-violet-900/30">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-white">Course Content</h2>
              <span className="bg-violet-900/30 text-violet-400 text-xs font-medium px-2 py-0.5 rounded-full">
                {course.lessonCount} lessons
              </span>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {course.duration}
            </div>
          </div>
          <nav className="p-3 h-full overflow-y-auto">
            {course.lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors duration-300 ${
                  currentLesson.id === lesson.id
                    ? "bg-violet-900/30 text-white"
                    : "hover:bg-gray-800/60 text-gray-300"
                } ${
                  // Show lessons as locked if previous lesson not completed
                  index > 0 && !lessonCompleted[course.lessons[index - 1].id]
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={() => handleLessonChange(lesson)}
                disabled={
                  index > 0 && !lessonCompleted[course.lessons[index - 1].id]
                }
              >
                <div className="flex items-center">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                      currentLesson.id === lesson.id
                        ? "bg-violet-700 text-white"
                        : lessonCompleted[lesson.id]
                        ? "bg-green-600 text-white"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {lessonCompleted[lesson.id] ? "✓" : index + 1}
                  </span>
                  <span className="text-sm font-medium">{lesson.title}</span>
                  {lesson.problemStatement && (
                    <span className="ml-2 text-xs bg-violet-700/40 text-violet-300 px-1.5 py-0.5 rounded">
                      Challenge
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto relative z-10 h-[calc(100vh-4rem)]"
        >
          {/* Backdrop overlay when sidebar is open on mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-10 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          <div className="max-w-3xl mx-auto px-6 py-8 pb-16">
            {/* Course progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-gray-400">
                  Lesson {currentLessonIndex + 1} of {course.lessons.length}
                </h2>
                <div className="flex items-center">
                  <Book className="w-4 h-4 mr-1 text-violet-400" />
                  <span className="text-sm text-violet-400">
                    {Math.round(
                      ((currentLessonIndex + 1) / course.lessons.length) * 100
                    )}
                    % Complete
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-violet-600 h-1.5 rounded-full"
                  style={{
                    width: `${
                      ((currentLessonIndex + 1) / course.lessons.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Title card */}
            <div className="bg-gray-900/60 border border-violet-900/30 rounded-lg p-6 mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                {currentLesson.title}
              </h1>
              <p className="text-gray-400">
                Learn at your own pace and master the concepts
              </p>
              {currentLesson.problemStatement && (
                <div className="mt-3 flex items-center text-violet-400">
                  <LightbulbIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    Includes coding challenge
                  </span>
                </div>
              )}
            </div>

            {/* Problem Statement Card - Show before content */}
            {currentLesson.problemStatement && showProblemStatement && (
              <Card
                className={`border mb-8 ${
                  darkMode
                    ? "border-violet-900/30 bg-gray-900/60"
                    : "border-violet-200 bg-violet-50"
                }`}
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle
                    className={`text-lg flex items-center ${
                      darkMode ? "text-white" : "text-violet-900"
                    }`}
                  >
                    <LightbulbIcon className="w-5 h-5 mr-2 text-violet-400" />
                    {currentLesson.problemStatement.title}
                  </CardTitle>
                  <button
                    onClick={() =>
                      setShowProblemStatement(!showProblemStatement)
                    }
                    className={`text-sm font-medium ${
                      darkMode
                        ? "text-violet-400 hover:text-violet-300"
                        : "text-violet-600 hover:text-violet-700"
                    }`}
                  >
                    Hide Challenge
                  </button>
                </CardHeader>
                <CardContent>
                  <p
                    className={`mb-4 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {currentLesson.problemStatement.description}
                  </p>

                  <div className="mb-4">
                    <h4
                      className={`font-semibold mb-2 ${
                        darkMode ? "text-violet-400" : "text-violet-700"
                      }`}
                    >
                      Requirements:
                    </h4>
                    <ul
                      className={`list-disc pl-5 space-y-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {currentLesson.problemStatement.requirements.map(
                        (req, index) => (
                          <li key={index}>{req}</li>
                        )
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Collapsed Problem Statement (when hidden) */}
            {currentLesson.problemStatement && !showProblemStatement && (
              <button
                onClick={() => setShowProblemStatement(true)}
                className={`w-full mb-8 p-4 flex items-center justify-between rounded-lg border ${
                  darkMode
                    ? "border-violet-900/30 bg-gray-900/40 hover:bg-gray-900/60"
                    : "border-violet-200 bg-violet-50/70 hover:bg-violet-50"
                }`}
              >
                <div className="flex items-center">
                  <LightbulbIcon className="w-5 h-5 mr-2 text-violet-400" />
                  <span className={darkMode ? "text-white" : "text-violet-900"}>
                    {currentLesson.problemStatement.title}
                  </span>
                </div>
                <span
                  className={`text-sm ${
                    darkMode ? "text-violet-400" : "text-violet-600"
                  }`}
                >
                  Show Challenge
                </span>
              </button>
            )}

            {/* Markdown content */}
            <article className="prose prose-invert prose-violet max-w-none bg-gray-900/60 border border-violet-900/30 rounded-lg p-6">
              <div className="markdown-body">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-2xl font-bold mb-4 text-violet-400"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-bold mt-8 mb-4 text-violet-400"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-bold mt-6 mb-3 text-violet-400"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-4 text-gray-300" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="ml-6 mb-4 list-disc text-gray-300"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="ml-6 mb-4 list-decimal text-gray-300"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1 text-gray-300" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-violet-400 underline hover:text-violet-300"
                        {...props}
                      />
                    ),
                    code: ({ node, className, ...props }) => {
                      const isInline =
                        !className || !className.includes("language-");
                      return isInline ? (
                        <code
                          className="px-1 py-0.5 rounded text-sm bg-gray-800 text-gray-300"
                          {...props}
                        />
                      ) : (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 overflow-x-auto">
                          <code
                            className={`block text-sm text-gray-300 ${className}`}
                            {...props}
                          />
                        </div>
                      );
                    },
                  }}
                >
                  {currentLesson.content}
                </ReactMarkdown>
              </div>
            </article>

            {/* Challenge component (only show if lesson has a problem statement) */}
            {currentLesson.problemStatement && (
              <LessonChallenge
                key={currentLesson.id} // Add this key prop
                lessonId={currentLesson.id}
                darkMode={darkMode}
                onChallengeComplete={handleChallengeComplete}
                initialCode={getInitialCodeTemplate(currentLesson.id)}
                problemStatement={currentLesson.problemStatement}
              />
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {currentLessonIndex > 0 ? (
                <button
                  className="px-4 py-2 rounded-lg transition-colors bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center"
                  onClick={() =>
                    handleLessonChange(course.lessons[currentLessonIndex - 1])
                  }
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous Lesson
                </button>
              ) : (
                <div></div> // Empty div to maintain the space for flexbox
              )}

              {currentLessonIndex < course.lessons.length - 1 && (
                <button
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center ml-auto ${
                    canProceedToNextLesson()
                      ? "bg-violet-700 hover:bg-violet-600 text-white"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (canProceedToNextLesson()) {
                      handleLessonChange(
                        course.lessons[currentLessonIndex + 1]
                      );
                    }
                  }}
                  disabled={!canProceedToNextLesson()}
                >
                  Next Lesson
                  <ChevronLeft className="w-5 h-5 ml-2 rotate-180" />
                </button>
              )}
            </div>

            {/* Additional info card */}
            <div className="mt-8 bg-gray-900/60 border border-violet-900/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-3">
                Learning Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="p-2 rounded-lg bg-violet-900/30 mr-3">
                    <Book className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Documentation</h4>
                    <p className="text-sm text-gray-400">
                      Access official resources and references
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-lg bg-violet-900/30 mr-3">
                    <Users className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Community</h4>
                    <p className="text-sm text-gray-400">
                      Join discussions and get help from others
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
