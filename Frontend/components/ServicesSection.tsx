"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const ServiceCard = ({
  icon,
  title,
  description,
  linkText,
  linkHref,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}) => {
  return (
    <motion.div
      className="bg-gray-900/60 backdrop-blur p-6 rounded-xl border border-violet-900/50 hover:border-violet-700/50 transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="w-12 h-12 rounded-lg bg-violet-900/30 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <Link
        href={linkHref}
        className="text-violet-400 hover:text-violet-300 font-medium flex items-center group"
      >
        {linkText}
        <svg
          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </motion.div>
  );
};

const ServicesSection = () => {
  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our Platform
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover how we can help you master blockchain development with our
            comprehensive learning solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            icon={
              <svg
                className="w-6 h-6 text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
            title="Interactive Code Editor"
            description="Write, compile, and test Solidity code directly in your browser with real-time feedback and syntax highlighting."
            linkText="Start Coding"
            linkHref="/editor"
          />

          <ServiceCard
            icon={
              <svg
                className="w-6 h-6 text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            }
            title="LeetCode-Style Practice Arena"
            description="Challenge yourself with blockchain-specific coding problems of varying difficulty, from beginner to expert level."
            linkText="Practice Now"
            linkHref="/arena"
          />

          <ServiceCard
            icon={
              <svg
                className="w-6 h-6 text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            }
            title="Blockchain Expert Chatbot"
            description="Get instant help and explanations from our AI-powered blockchain expert for any of your development questions."
            linkText="Ask Expert"
            linkHref="/chatbot"
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
