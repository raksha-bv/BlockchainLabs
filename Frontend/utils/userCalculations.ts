// userCalculations.ts
import { UserData } from "@/lib/userService";
import clientPromise from "@/lib/mongodb";

// Define level thresholds
const LEVEL_THRESHOLDS = [
  0, // Level 0
  5, // Level 1: 5 submissions
  15, // Level 2: 15 submissions
  30, // Level 3: 30 submissions
  50, // Level 4: 50 submissions
  75, // Level 5: 75 submissions
  100, // Level 6: 100 submissions
  150, // Level 7: 150 submissions
  200, // Level 8: 200 submissions
  300, // Level 9: 300 submissions
  // Add more levels as needed
];

// Calculate user level based on submissions, accepted submissions, and courses completed
export function calculateUserLevel(userData: UserData): number {
  // Example formula: Use submissions as primary factor, with bonuses for accepted submissions and courses
  const totalPoints =
    userData.submissions +
    userData.acceptedSubmissions * 2 +
    userData.courseCompleted * 5;

  // Find the highest level threshold the user has surpassed
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVEL_THRESHOLDS[i]) {
      return i;
    }
  }

  return 0; // Default level
}

// Calculate average AI score
export function calculateAverageAIScore(aiScores: number[]): number {
  if (aiScores.length === 0) return 0;
  const sum = aiScores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / aiScores.length)); // Round to 1 decimal place
}

// Check and grant achievements
export async function checkAndGrantAchievements(
  email: string,
  userData: UserData
): Promise<string[]> {
  const newAchievements: string[] = [];

  // Achievement criteria examples
  if (
    userData.courseCompleted >= 5 &&
    !userData.Achievement.includes("Course Master")
  ) {
    newAchievements.push("Course Master");
  }

  if (
    userData.submissions >= 50 &&
    !userData.Achievement.includes("Submission Warrior")
  ) {
    newAchievements.push("Submission Warrior");
  }

  if (
    userData.acceptedSubmissions >= 25 &&
    !userData.Achievement.includes("Quality Coder")
  ) {
    newAchievements.push("Quality Coder");
  }

  if (userData.Level >= 5 && !userData.Achievement.includes("Rising Star")) {
    newAchievements.push("Rising Star");
  }

  // Add new achievements to the user if any were earned
  if (newAchievements.length > 0) {
    await addAchievementsToUser(email, newAchievements);
  }

  return newAchievements;
}

// Add achievements to user
async function addAchievementsToUser(email: string, achievements: string[]) {
  const client = await clientPromise;
  const db = client.db("Web3LabsDB");
  const usersCollection = db.collection("users");

  await usersCollection.updateOne(
    { email },
    {
      $addToSet: { "data.Achievement": { $each: achievements } },
      $set: { updatedAt: new Date() },
    }
  );
}

// Update user level based on current data
export async function updateUserLevel(email: string) {
  const client = await clientPromise;
  const db = client.db("Web3LabsDB");
  const usersCollection = db.collection("users");

  // Get current user data
  const user = await usersCollection.findOne({ email });
  if (!user) return { success: false, message: "User not found" };

  // Calculate the new level
  const newLevel = calculateUserLevel(user.data);

  // Update the user's level if it has changed
  if (newLevel !== user.data.Level) {
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          "data.Level": newLevel,
          updatedAt: new Date(),
        },
      }
    );

    return {
      success: true,
      message: "User level updated",
      previousLevel: user.data.Level,
      newLevel,
    };
  }

  return { success: true, message: "User level unchanged", level: newLevel };
}
