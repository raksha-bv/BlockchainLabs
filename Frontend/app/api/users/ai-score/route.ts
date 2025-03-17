//api/users/ai-score/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pushToUserArray, getUserByEmail } from "@/lib/userService";
import {
  updateUserLevel,
  checkAndGrantAchievements,
  calculateAverageAIScore,
} from "@/utils/userCalculations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, score } = body;

    if (!email || score === undefined) {
      return NextResponse.json(
        { success: false, error: "Email and score are required" },
        { status: 400 }
      );
    }

    // Add the AI score to the user's array
    await pushToUserArray(email, "AI_Scores", score);

    // Get updated user data
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate the average AI score
    const averageScore = calculateAverageAIScore(user.data.AI_Scores);

    // Update user level based on new data
    const levelResult = await updateUserLevel(email);

    // Check for new achievements
    const newAchievements = await checkAndGrantAchievements(email, user.data);

    return NextResponse.json(
      {
        success: true,
        message: "AI score recorded successfully",
        averageScore,
        totalScores: user.data.AI_Scores.length,
        levelUpdated: levelResult.previousLevel !== levelResult.newLevel,
        newLevel: levelResult.newLevel,
        newAchievements,
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

// Get AI score statistics for a user
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

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const scores = user.data.AI_Scores;
    const averageScore = calculateAverageAIScore(scores);

    let highestScore = 0;
    let lowestScore = scores.length > 0 ? scores[0] : 0;

    for (const score of scores) {
      if (score > highestScore) highestScore = score;
      if (score < lowestScore) lowestScore = score;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          totalScores: scores.length,
          averageScore,
          highestScore,
          lowestScore,
          recentScores: scores.slice(-5), // Get the 5 most recent scores
          allScores: scores,
        },
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
