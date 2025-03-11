"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { ChevronLeft, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle"; // Note the @ import path
import type { Course } from "../page";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Sample course content for "Basics of Solidity"
const solidityCourse = {
  id: "basics-of-solidity",
  title: "Basics of Solidity",
  description:
    "Learn the fundamentals of Solidity programming and smart contract development for blockchain applications.",
  level: "Beginner" as "Beginner",
  duration: "4 weeks",
  lessonCount: 12,
  image: "/images/solidity-basics.png",
  lessons: [
    {
      id: "intro-to-solidity",
      title: "Introduction to Solidity & Smart Contracts",
      content: `
# Lesson 1: Introduction to Solidity & Smart Contracts

Hey there, future blockchain developer! Welcome to the world of Solidity! If you've ever wondered, "What exactly is a smart contract, and why is everyone talking about it?"—you're in the right place. Let's break it down without any complex jargon and have some fun along the way.

## What is Solidity?

Imagine you are writing a magic spell, but instead of controlling mythical creatures, your spell controls money, ownership, and agreements on the blockchain. Solidity is the language used to write these spells (smart contracts).

It's similar to JavaScript but with some extra features. With Solidity, you can create self-executing agreements that nobody can change or tamper with—not even you after deploying them.

## What are Smart Contracts?

Now, let's talk about smart contracts.

Think of a smart contract as a vending machine.
* You put money in (send cryptocurrency).
* You select your snack (trigger a function).
* The vending machine checks if you inserted the correct amount (validates conditions).
* If yes, it automatically drops your snack (executes the function).

No shopkeeper is needed. No middleman. Just instant execution based on clear rules written in Solidity.

Another way to think about it:
* Normal contracts are written on paper and need lawyers to enforce them.
* Smart contracts are written in code and enforce themselves automatically.

Blockchain ensures nobody can cheat, because once a smart contract is deployed, it runs exactly as written.

## Use Cases of Smart Contracts

Now that we know what smart contracts are, let's check out where they're used in real life:

* Decentralized Finance (DeFi) – Borrow, lend, and trade crypto without banks.
* NFTs – Own unique digital art, music, or in-game items.
* Supply Chain – Track where products come from without trusting middlemen.
* Ticketing – Buy concert tickets that can't be counterfeited.
* Voting Systems – Fair elections without fraud.

Smart contracts remove middlemen and make processes more transparent. No trust issues, no hidden fees—just pure automation.

## Writing a Simple "Hello World" Smart Contract

Now, let's write our first Solidity program.

If you've coded before, you might remember that in most programming languages, the first thing we write is a "Hello, World!" program. It's like saying hello to the language.

Here's what it looks like in Solidity:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message = "Hello, World!";
}
\`\`\`

Breaking it down:
* \`pragma solidity ^0.8.0;\` → Tells the compiler which Solidity version to use.
* \`contract HelloWorld {}\` → Defines a smart contract named "HelloWorld".
* \`string public message = "Hello, World!";\` → A public variable storing the message.

What this contract does:
* It stores a "Hello, World!" message.
* Since the variable is public, anyone can read it.

Simple, right? You just wrote your first smart contract.

## Try It Yourself

Now, head over to our Solidity Code Editor and type it in. Hit Compile and see if it works.
* If there's an error, don't worry—our AI suggestions will help you fix it.
* If it compiles successfully, congrats! You've just taken your first step into blockchain development.

## What's Next?

In the next lesson, we'll explore Solidity's syntax and data types—it's like learning the alphabet before writing full sentences. Stay curious and keep experimenting. See you in Lesson 2!
      `,
    },
    {
      id: "solidity-syntax",
      title: "Solidity Syntax and Data Types",
      content:
        "# Lesson 2: Solidity Syntax and Data Types\n\nIn this lesson, we'll explore the basic syntax of Solidity and understand various data types available...",
    },
    {
      id: "variables-and-functions",
      title: "Variables and Functions",
      content:
        "# Lesson 3: Variables and Functions\n\nLearn how to declare variables and write functions in Solidity...",
    },
    {
      id: "control-structures",
      title: "Control Structures and Loops",
      content:
        "# Lesson 4: Control Structures and Loops\n\nUnderstand how to use if-else statements, loops, and other control structures in Solidity...",
    },
    {
      id: "mapping-and-arrays",
      title: "Mappings and Arrays",
      content:
        "# Lesson 5: Mappings and Arrays\n\nDive into complex data structures like mappings and arrays that are crucial for smart contracts...",
    },
    // Additional lessons would be added here
  ],
};

// Define lesson type
interface Lesson {
  id: string;
  title: string;
  content: string;
}

// Define full course type with lessons
interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

// Course data object - in a real application, this would come from an API
const coursesData: { [key: string]: CourseWithLessons } = {
  "basics-of-solidity": solidityCourse,
  // Other courses would be added here with their lessons
};

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id;
  const lessonId = searchParams.get("lessonId");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [course, setCourse] = useState<CourseWithLessons | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const [parsedContent, setParsedContent] = useState("");

  useEffect(() => {
    if (currentLesson) {
      const parseContent = async () => {
        const parsed = await marked.parse(currentLesson.content);
        setParsedContent(DOMPurify.sanitize(parsed));
      };

      parseContent();
    }
  }, [currentLesson]);

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
  }, [id, lessonId]);

  // Handle lesson change
  const handleLessonChange = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    // Update URL - note the change in how navigation works
    router.push(`/courses/${id}?lessonId=${lesson.id}`);
  };

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pastel-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 dark:bg-gray-900 dark:text-gray-100 flex flex-col">
      <Head>
        <title>{course.title} | Blockchain Learning Platform</title>
        <meta name="description" content={course.description} />
      </Head>

      {/* Header */}
      <header className="border-b border-gray-800 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/courses"
            className="mr-4 text-gray-400 hover:text-pastel-purple transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-pastel-purple">
            {course.title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 w-64 border-r border-gray-700 flex-shrink-0 transition-all duration-300 overflow-y-auto scrollbar-thin scrollbar-thumb-pastel-purple scrollbar-track-gray-800 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 absolute lg:relative z-10 h-[calc(100vh-4rem)]`}
        >
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-bold text-lg">Course Content</h2>
            <p className="text-sm text-gray-400 mt-1">
              {course.lessonCount} lessons
            </p>
          </div>
          <nav className="p-2">
            {course.lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                  currentLesson.id === lesson.id
                    ? "bg-pastel-purple/30 text-white"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => handleLessonChange(lesson)}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs mr-3">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium">{lesson.title}</span>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-pastel-purple scrollbar-track-transparent">
          <article className="max-w-3xl mx-auto prose prose-invert">
            <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
          </article>

          {/* Navigation buttons */}
          <div className="max-w-3xl mx-auto mt-12 flex justify-between">
            {course.lessons.indexOf(currentLesson) > 0 && (
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
                onClick={() =>
                  handleLessonChange(
                    course.lessons[course.lessons.indexOf(currentLesson) - 1]
                  )
                }
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous Lesson
              </button>
            )}

            {course.lessons.indexOf(currentLesson) <
              course.lessons.length - 1 && (
              <button
                className="px-4 py-2 bg-pastel-purple hover:bg-pastel-purple-dark rounded-lg transition-colors flex items-center ml-auto"
                onClick={() =>
                  handleLessonChange(
                    course.lessons[course.lessons.indexOf(currentLesson) + 1]
                  )
                }
              >
                Next Lesson
                <ChevronLeft className="w-5 h-5 ml-2 rotate-180" />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
