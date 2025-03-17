// app/api/users/submission/route.ts
import { NextRequest, NextResponse } from "next/server";
import { incrementUserField } from "@/lib/userService";
import {
  updateUserLevel,
  checkAndGrantAchievements,
  calculateUserLevel,
} from "@/utils/userCalculations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, isAccepted = false } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Increment submission count
    await incrementUserField(email, "submissions");

    // Increment accepted submissions if applicable
    if (isAccepted) {
      await incrementUserField(email, "acceptedSubmissions");
    }

    // Update user level based on new data
    const levelResult = await updateUserLevel(email);

    // Get user data and check for achievements
    const { getUserByEmail } = await import("@/lib/userService");
    const user = await getUserByEmail(email);

    if (user) {
      const newAchievements = await checkAndGrantAchievements(email, user.data);

      return NextResponse.json(
        {
          success: true,
          message: "Submission recorded successfully",
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
        message: "Submission recorded successfully",
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
