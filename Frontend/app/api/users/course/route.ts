// app/api/users/course/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  incrementUserField,
  updateUserField,
  getUserByEmail,
  pushToUserArray,
} from "@/lib/userService";
import {
  updateUserLevel,
  checkAndGrantAchievements,
} from "@/utils/userCalculations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, courseId, course } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Get user data to check if course already completed
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has completedCourses array
    const isNewCompletion =
      !user.data.completedCourses ||
      !user.data.completedCourses.some(
        (completedCourse: any) =>
          typeof completedCourse === "object" &&
          completedCourse.courseId === courseId
      );

    // Only proceed with recording completion if it's new
    if (isNewCompletion) {
      // Update user's completedCourses array
      if (!user.data.completedCourses) {
        await updateUserField(email, "completedCourses", [
          { courseId, course },
        ]);
      } else {
        await pushToUserArray(email, "completedCourses", { courseId, course });
      }

      // Increment course completion count
      await incrementUserField(email, "courseCompleted");

      // Also update the userCourses collection to mark this course as completed
      try {
        const userCoursesUrl = new URL("/api/users/courses", req.url);
        const response = await fetch(userCoursesUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            courseId,
            completed: true,
          }),
        });

        if (!response.ok) {
          console.error(
            "Failed to update userCourses collection:",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error updating userCourses collection:", error);
        // Continue processing - we don't want to fail the whole request if this update fails
      }

      // Update user level based on new data
      const levelResult = await updateUserLevel(email);

      // Get updated user data and check for achievements
      const updatedUser = await getUserByEmail(email);

      if (updatedUser) {
        const newAchievements = await checkAndGrantAchievements(
          email,
          updatedUser.data
        );

        return NextResponse.json(
          {
            success: true,
            message: "Course completion recorded successfully",
            levelUpdated: levelResult.previousLevel !== levelResult.newLevel,
            newLevel: levelResult.newLevel,
            newAchievements,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Course completion recorded successfully",
        },
        { status: 200 }
      );
    } else {
      // Course already completed
      return NextResponse.json(
        {
          success: true,
          message: "Course already completed",
          alreadyCompleted: true,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("MongoDB Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
