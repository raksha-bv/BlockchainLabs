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



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, courseId, completed } = body;

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

    const client = await clientPromise;
    const db = client.db("Web3LabsDB");
    const userCoursesCollection = db.collection("userCourses");

    // Check if user already has this course
    const existingUserCourse = await userCoursesCollection.findOne({
      email,
      courseId,
    });

    if (existingUserCourse) {
      // Update the completion status if the record exists
      await userCoursesCollection.updateOne(
        { email, courseId },
        { $set: { completed: completed === undefined ? true : completed } }
      );

      return NextResponse.json(
        {
          success: true,
          message: "Course status updated successfully",
        },
        { status: 200 }
      );
    } else {
      // Create a new record if it doesn't exist
      await userCoursesCollection.insertOne({
        email,
        courseId,
        completed: completed === undefined ? true : completed,
        enrolledAt: new Date(),
      });

      return NextResponse.json(
        {
          success: true,
          message: "Course enrolled and status updated successfully",
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