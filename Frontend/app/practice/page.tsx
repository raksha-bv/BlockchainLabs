"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import UnauthenticatedPracticeArena from "@/components/UnauthenticatedPA";
import PracticePage from "@/components/PracticeArena";




// Main page component with authentication check
const PracticeArena = () => {
  const { data: session, status } = useSession();

  // If loading, show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-400"></div>
        </div>
      </div>
    );
  }

  // If not authenticated, show the unauthenticated page
  if (status === "unauthenticated") {
    return <UnauthenticatedPracticeArena />;
  }

  // If authenticated, show the practice arena content
  return (
    <div>
      <PracticePage />
    </div>
  );
};

export default PracticeArena;
