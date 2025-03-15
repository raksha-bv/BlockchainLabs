"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CodeEditor from "@/components/CodeEditor"; // Using your existing component
import {
  ChevronDown,
  ChevronUp,
  LightbulbIcon,
  CheckCircle,
} from "lucide-react";

// Define problem statement type
interface ProblemStatement {
  title: string;
  description: string;
  requirements: string[];
  hints: string[];
}

// Define theme colors
const themeColors = {
  dark: {
    cardBg: "#1E1E2E",
    cardBgSecondary: "#282A36",
    borderColor: "#383A59",
    accent: "#BD93F9",
    textPrimary: "#F8F8F2",
    textSecondary: "#CDD6F4",
    textMuted: "#6C7086",
    primary: "#7C3AED",
  },
  light: {
    cardBg: "#FAF3FF",
    cardBgSecondary: "#F5EEFF",
    borderColor: "#E9D5FF",
    accent: "#8B5CF6",
    textPrimary: "#1E293B",
    textSecondary: "#334155",
    textMuted: "#64748B",
    primary: "#7C3AED",
  },
};

interface LessonChallengeProps {
  lessonId: string;
  darkMode: boolean;
  onChallengeComplete: () => void;
  initialCode?: string;
  problemStatement: ProblemStatement;
}

const LessonChallenge: React.FC<LessonChallengeProps> = ({
  lessonId,
  darkMode,
  onChallengeComplete,
  initialCode = "",
  problemStatement,
}) => {
  const [code, setCode] = useState(initialCode);
  const [showHints, setShowHints] = useState(false);
  const [validationStatus, setValidationStatus] = useState<
    null | "validating" | "valid" | "invalid"
  >(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showValidation, setShowValidation] = useState(false);

  const themeMode = darkMode ? "dark" : "light";
  const colors = themeColors[themeMode];

  // Validation function - in a real app, this would call an API
  const validateCode = async () => {
    setValidationStatus("validating");
    setShowValidation(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check for required elements in the code
    let isValid = true;
    let error = "";

    // Basic validation for the Bank contract challenge
    if (lessonId === "solidity-functions") {
      if (!code.includes("address") && !code.includes("owner")) {
        isValid = false;
        error += "Missing owner address declaration.\n";
      }

      if (
        !code.includes("constructor") ||
        !code.includes("owner = msg.sender")
      ) {
        isValid = false;
        error += "Constructor should set owner to msg.sender.\n";
      }

      if (!code.includes("modifier onlyOwner")) {
        isValid = false;
        error += "Missing onlyOwner modifier.\n";
      }

      if (!code.includes("function deposit") || !code.includes("payable")) {
        isValid = false;
        error += "Missing payable deposit function.\n";
      }

      if (
        !code.includes("function withdraw") ||
        !code.includes("onlyOwner") ||
        (!code.toLowerCase().includes("transfer") &&
          !code.toLowerCase().includes("send") &&
          !code.toLowerCase().includes("call"))
      ) {
        isValid = false;
        error +=
          "Missing or incorrect withdraw function with owner restriction.\n";
      }
    }

    setValidationResult({
      status: isValid,
      syntax_correct: true, // Simplified for this example
      compilable_code: isValid,
      error: error || null,
    });

    setValidationStatus(isValid ? "valid" : "invalid");

    // If valid, enable proceeding to next lesson
    if (isValid) {
      setTimeout(() => {
        onChallengeComplete();
      }, 2000);
    }
  };

  return (
    <div className="mt-12 space-y-6">
      {/* Challenge section header */}
      <div className="flex items-center">
        <div
          className={`w-1 h-8 mr-3 rounded ${
            darkMode ? "bg-violet-600" : "bg-violet-500"
          }`}
        ></div>
        <h2 className="text-xl font-bold text-white">Coding Challenge</h2>
      </div>

      {/* Problem statement */}
      {problemStatement && (
        <Card
          className={`border ${
            darkMode
              ? "border-violet-900/30 bg-gray-900/60"
              : "border-violet-200 bg-violet-50"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-lg ${
                darkMode ? "text-white" : "text-violet-900"
              }`}
            >
              {problemStatement.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {problemStatement.description}
            </p>

            <div className="mb-4">
              <h4
                className={`font-semibold mb-2 ${
                  darkMode ? "text-violet-400" : "text-violet-700"
                }`}
              >
                Requirements:
              </h4>
              <ul
                className={`list-disc pl-5 space-y-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {problemStatement.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Collapsible hints section */}
            <div className="mt-4">
              <button
                onClick={() => setShowHints(!showHints)}
                className={`flex items-center text-sm font-medium ${
                  darkMode
                    ? "text-violet-400 hover:text-violet-300"
                    : "text-violet-600 hover:text-violet-700"
                }`}
              >
                <LightbulbIcon className="w-4 h-4 mr-1" />
                {showHints ? "Hide Hints" : "Show Hints"}
                {showHints ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>

              {showHints && (
                <div
                  className={`mt-2 p-3 rounded-md ${
                    darkMode ? "bg-violet-900/20" : "bg-violet-100"
                  }`}
                >
                  <ul
                    className={`list-disc pl-5 space-y-1 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {problemStatement.hints.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code editor */}
      <div className="h-96">
        <CodeEditor
          theme={themeMode}
          code={code}
          setCode={setCode}
          problemStatement={problemStatement}
          colors={colors}
          validationStatus={validationStatus}
          validationResult={validationResult}
          validateCode={validateCode}
          showValidation={showValidation}
          setShowValidation={setShowValidation}
        />
      </div>

      {/* Success message when challenge is completed */}
      {validationStatus === "valid" && (
        <div
          className={`p-4 rounded-lg flex items-start ${
            darkMode
              ? "bg-green-900/20 border border-green-700"
              : "bg-green-100 border border-green-200"
          }`}
        >
          <CheckCircle
            className={`w-5 h-5 mr-2 flex-shrink-0 ${
              darkMode ? "text-green-400" : "text-green-500"
            }`}
          />
          <div>
            <h4
              className={`font-medium ${
                darkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              Challenge Completed!
            </h4>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Great job! You can now proceed to the next lesson.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonChallenge;
