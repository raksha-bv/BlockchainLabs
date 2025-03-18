// types/course.ts
export type ThemeMode = "dark" | "light";

export interface ProblemStatement {
  title: string;
  description: string;
  requirements: string[];
  hints: string[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  problemStatement?: ProblemStatement;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessonCount: number;
  image: string;
  lessons: Lesson[];
}
