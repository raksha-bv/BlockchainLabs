// app/api/users/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Web3LabsDB");
    const userCoursesCollection = db.collection("userCourses");
    const coursesCollection = db.collection("courses");

    // Get all course IDs the user has registered for
    const userCourses = await userCoursesCollection.find({ email }).toArray();

    // If user has no courses, return empty array
    if (!userCourses.length) {
      return NextResponse.json(
        {
          success: true,
          courses: [],
        },
        { status: 200 }
      );
    }

    // Get the actual course details
    const courseIds = userCourses.map((uc) => uc.courseId);
    const courses = await coursesCollection
      .find({ id: { $in: courseIds } })
      .toArray();

    // Add completion status to each course
    const coursesWithStatus = courses.map((course) => {
      const userCourse = userCourses.find((uc) => uc.courseId === course.id);
      return {
        ...course,
        completed: userCourse?.completed || false,
      };
    });

    return NextResponse.json(
      {
        success: true,
        courses: coursesWithStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("MongoDB Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
