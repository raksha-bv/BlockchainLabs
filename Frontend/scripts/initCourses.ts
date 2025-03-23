// scripts/initCourses.ts
import { migrateCourses } from "@/lib/courseService";
import { Course } from "@/types/course";
import { solidityCourse } from "@/utils/solidityCourse";
import * as dotenv from "dotenv";
dotenv.config();
// Course data to initialize the database
const initialCourses: Course[] = [solidityCourse];

async function init() {
  try {
    const result = await migrateCourses(initialCourses);
    console.log(result.message);
    process.exit(0);
  } catch (error) {
    console.error("Failed to initialize courses:", error);
    process.exit(1);
  }
}

// Run the initialization
init();
