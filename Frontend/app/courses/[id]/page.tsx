// pages/courses/[id].tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Course, Lesson, ThemeMode } from "@/types/course";

// Import components
import CourseHeader from "@/components/course/CourseHeader";
import CourseSidebar from "@/components/course/CourseSidebar";
import CourseProgressBar from "@/components/course/CourseProgressBar";
import LessonHeader from "@/components/course/LessonHeader";
import ProblemStatementCard from "@/components/course/ProblemStatementCard";
import LessonContent from "@/components/course/LessonContent";
import LessonChallenge from "@/components/course/LessonChallenge";
import LessonNavigation from "@/components/course/LessonNavigation";
import LearningResources from "@/components/course/LearningResourses";
import Notification from "@/components/course/Notification";
import { ChatbotPopup } from "@/components/ChatbotPopup";

// Import data
import { solidityCourse } from "@/utils/solidityCourse";
import {
  problemStatements,
  getInitialCodeTemplate,
} from "@/utils/problemStatements";
import { LightbulbIcon } from "lucide-react";

// Define full course type with lessons
const coursesData: { [key: string]: Course } = {
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
  const { data: session, status } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [darkMode, setDarkMode] = useState<ThemeMode>("dark");
  const [lessonCompleted, setLessonCompleted] = useState<{
    [key: string]: boolean;
  }>({});
  const [showProblemStatement, setShowProblemStatement] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

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

  // Record course completion
  const recordCourseCompletion = async () => {
    try {
      // Get user email from session or auth provider
      const email = session?.user?.email;

      if (!email) {
        console.error("User email not found");
        return;
      }

      const response = await fetch("/api/users/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        let message = "Course completed successfully!";

        // Add level up info if applicable
        if (data.levelUpdated) {
          message += ` You've reached level ${data.newLevel}!`;
        }

        // Add achievements info if applicable
        if (data.newAchievements && data.newAchievements.length > 0) {
          message += ` Achievement${
            data.newAchievements.length > 1 ? "s" : ""
          } unlocked: ${data.newAchievements
            .map((a: any) => a.name)
            .join(", ")}`;
        }

        // Show notification
        setNotification({
          show: true,
          message,
          type: "success",
        });

        // Hide notification after 5 seconds
        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" });
        }, 5000);
      }
    } catch (error) {
      console.error("Failed to record course completion:", error);
      setNotification({
        show: true,
        message: "Failed to record course completion. Please try again.",
        type: "error",
      });

      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);
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

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <ChatbotPopup
        buttonText="Chat with AI"
        initialMessage="Hello! I'm your blockchain assistant. How can I help you today?"
        title="Blockchain AI"
      />
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.1),transparent_70%)]"></div>
      </div>

      {/* Header */}
      <CourseHeader
        course={course}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <CourseSidebar
          course={course}
          currentLesson={currentLesson}
          lessonCompleted={lessonCompleted}
          sidebarOpen={sidebarOpen}
          handleLessonChange={handleLessonChange}
        />

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
            <CourseProgressBar course={course} currentLesson={currentLesson} />

            {/* Title card */}
            <LessonHeader lesson={currentLesson} />

            {/* Problem Statement Card - Show before content */}
            {currentLesson.problemStatement && showProblemStatement && (
              <ProblemStatementCard
                problemStatement={currentLesson.problemStatement}
                showProblemStatement={showProblemStatement}
                setShowProblemStatement={setShowProblemStatement}
                darkMode={darkMode}
              />
            )}

            {/* Collapsed Problem Statement (when hidden) */}
            {currentLesson.problemStatement && !showProblemStatement && (
              <button
                onClick={() => setShowProblemStatement(true)}
                className={`w-full mb-8 p-4 flex items-center justify-between rounded-lg border ${
                  darkMode === "dark"
                    ? "border-violet-900/30 bg-gray-900/40 hover:bg-gray-900/60"
                    : "border-violet-200 bg-violet-50/70 hover:bg-violet-50"
                }`}
              >
                <div className="flex items-center">
                  <LightbulbIcon className="w-5 h-5 mr-2 text-violet-400" />
                  <span
                    className={
                      darkMode === "dark" ? "text-white" : "text-violet-900"
                    }
                  >
                    {currentLesson.problemStatement.title}
                  </span>
                </div>
                <span
                  className={`text-sm ${
                    darkMode === "dark" ? "text-violet-400" : "text-violet-600"
                  }`}
                >
                  Show Challenge
                </span>
              </button>
            )}

            {/* Markdown content */}
            <LessonContent lesson={currentLesson} />

            {/* Challenge component (only show if lesson has a problem statement) */}
            {currentLesson.problemStatement && (
              <LessonChallenge
                key={currentLesson.id}
                lessonId={currentLesson.id}
                darkMode={darkMode === "dark"}
                onChallengeComplete={handleChallengeComplete}
                initialCode={getInitialCodeTemplate(currentLesson.id)}
                problemStatement={currentLesson.problemStatement}
              />
            )}

            {/* Navigation buttons */}
            <LessonNavigation
              course={course}
              currentLesson={currentLesson}
              lessonCompleted={lessonCompleted}
              handleLessonChange={handleLessonChange}
              recordCourseCompletion={recordCourseCompletion}
            />

            {/* Additional info card */}
            <LearningResources />
          </div>
        </main>
      </div>

      {/* Notification component */}
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
    </div>
  );
}
