// CourseDetailPage.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { solidityCourse } from "@/utils/solidityCourse";
import {
  problemStatements,
  getInitialCodeTemplate,
} from "@/utils/problemStatements";
import CourseHeader from "@/components/course/CourseHeader";
import CourseSidebar from "@/components/course/CourseSidebar";
import CourseContent from "@/components/course/CourseContent";
import Notification from "@/components/ui/Notification";
import { CourseWithLessons, Lesson, ThemeMode } from "@/types/course";

// Set up courses data
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
  const { data: session } = useSession();

  // State
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [course, setCourse] = useState<CourseWithLessons | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [darkMode, setDarkMode] = useState<ThemeMode>("dark");
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
      // Reset code editor state
      const editorElement = document.querySelector("[data-lesson-editor]");
      if (editorElement) {
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
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.1),transparent_70%)]"></div>
      </div>

      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification({ show: false, message: "", type: "" })
          }
        />
      )}

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
          setSidebarOpen={setSidebarOpen}
          handleLessonChange={handleLessonChange}
        />

        {/* Main Content */}
        <CourseContent
          ref={mainContentRef}
          course={course}
          currentLesson={currentLesson}
          currentLessonIndex={currentLessonIndex}
          darkMode={darkMode}
          showProblemStatement={showProblemStatement}
          setShowProblemStatement={setShowProblemStatement}
          lessonCompleted={lessonCompleted}
          canProceedToNextLesson={canProceedToNextLesson}
          handleLessonChange={handleLessonChange}
          handleChallengeComplete={handleChallengeComplete}
          recordCourseCompletion={recordCourseCompletion}
          sidebarOpen={sidebarOpen}
          getInitialCodeTemplate={getInitialCodeTemplate}
        />
      </div>
    </div>
  );
}
