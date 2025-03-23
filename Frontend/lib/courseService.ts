// lib/courseService.ts
import clientPromise from "@/lib/mongodb";
import { Course } from "@/app/courses/page"; // Import your Course interface

export async function migrateCourses(courses: Course[]) {
  const client = await clientPromise;
  const db = client.db("Web3LabsDB");
  const coursesCollection = db.collection("courses");

  // For each course in the array
  for (const course of courses) {
    // Check if course already exists
    const existingCourse = await coursesCollection.findOne({ id: course.id });

    if (existingCourse) {
      // Update existing course without changing registrations
      await coursesCollection.updateOne(
        { id: course.id },
        {
          $set: {
            title: course.title,
            description: course.description,
            level: course.level,
            duration: course.duration,
            lessonCount: course.lessonCount,
            image: course.image,
            tags: course.tags,
            // Don't update registrations here to preserve the count
          },
        }
      );
    } else {
      // Insert new course
      await coursesCollection.insertOne(course);
    }
  }

  return { success: true, message: "Courses migrated successfully" };
}

export async function getAllCourses() {
  const client = await clientPromise;
  const db = client.db("Web3LabsDB");
  const coursesCollection = db.collection("courses");

  return await coursesCollection.find({}).toArray();
}

export async function getCourseById(courseId: string) {
  const client = await clientPromise;
  const db = client.db("Web3LabsDB");
  const coursesCollection = db.collection("courses");

  return await coursesCollection.findOne({ id: courseId });
}

export async function getUserCourses(email: string) {
  const client = await clientPromise;
  const db = client.db("Web3LabsDB");
  const userCoursesCollection = db.collection("userCourses");

  // Get all course IDs the user has registered for
  const userCourses = await userCoursesCollection.find({ email }).toArray();

  // If user has no courses, return empty array
  if (!userCourses.length) return [];

  // Get the actual course details
  const courseIds = userCourses.map((uc) => uc.courseId);
  const coursesCollection = db.collection("courses");
  const courses = await coursesCollection
    .find({ id: { $in: courseIds } })
    .toArray();

  // Add completion status to each course
  return courses.map((course) => {
    const userCourse = userCourses.find((uc) => uc.courseId === course.id);
    return {
      ...course,
      completed: userCourse?.completed || false,
    };
  });
}
