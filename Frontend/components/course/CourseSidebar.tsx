import React from "react";
import { Clock } from "lucide-react";
import { Course, Lesson, ThemeMode } from "@/types/course";

interface CourseSidebarProps {
  course: Course;
  sidebarOpen: boolean;
  currentLesson: Lesson;
  lessonCompleted: Record<string, boolean>;
  handleLessonChange: (lesson: Lesson) => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  sidebarOpen,
  currentLesson,
  lessonCompleted,
  handleLessonChange,
}) => {
  return (
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
        {course.lessons.map((lesson, index) => {
          // A lesson should only be locked if:
          // 1. It's not the first lesson
          // 2. The previous lesson is not completed
          // 3. This lesson itself is not completed
          const previousNotCompleted =
            index > 0 && !lessonCompleted[course.lessons[index - 1].id];
          const currentNotCompleted = !lessonCompleted[lesson.id];
          const isLocked = previousNotCompleted && currentNotCompleted;

          return (
            <button
              key={lesson.id}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-colors duration-300 ${
                currentLesson.id === lesson.id
                  ? "bg-violet-900/30 text-white"
                  : "hover:bg-gray-800/60 text-gray-300"
              } ${isLocked ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => handleLessonChange(lesson)}
              disabled={isLocked}
            >
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                    currentLesson.id === lesson.id
                      ? "bg-violet-700 text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{lesson.title}</span>
                {lesson.problemStatement && (
                  <span className="ml-2 text-xs bg-violet-700/40 text-violet-300 px-1.5 py-0.5 rounded">
                    Challenge
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default CourseSidebar;
