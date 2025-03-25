"use client";
import Link from "next/link";
import React, { useState } from "react";
import SignIn from "./SignIn";
import UserAvatar from "./UserAvatar";
import { useSession } from "next-auth/react";



const RoadMapNavbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session, status } = useSession();
  console.log(session);
  
  return (
    <nav className="z-10 flex justify-between items-center px-6 md:px-12 py-4 w-full">
      <div className="flex items-center">
        <Link
          href="/"
          className="text-xl font-bold text-white flex items-center"
        >
          <span className="text-violet-400">BLOCK</span>CHAIN
          <span className="text-violet-400">LABS</span>
        </Link>
      </div>

      <div className="hidden md:flex space-x-8">
        <Link
          href="/"
          className="text-white hover:text-violet-400 transition-colors relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link
          href="/courses"
          className="text-white hover:text-violet-400 transition-colors relative group"
        >
          Courses
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link
          href="/practice"
          className="text-white hover:text-violet-400 transition-colors relative group"
        >
          Practice Arena
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link
          href="/chatbot"
          className="text-white hover:text-violet-400 transition-colors relative group"
        >
          AI Assistant
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </div>

      <div className="flex gap-5">
        {status === "authenticated" ? (
          <UserAvatar />
        ) : status === "loading" ? (
          <div>Loading...</div>
        ) : (
          <SignIn />
        )}
      </div>
    </nav>
  );
};

export default RoadMapNavbar;
