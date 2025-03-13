"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react"; // Import icons for theme toggle

type ProblemLevel = "beginner" | "intermediate" | "advanced";
type ValidationStatus = null | "validating" | "valid" | "invalid";
type ThemeMode = "dark" | "light";

interface ProblemStatement {
  title: string;
  description: string;
  requirements: string[];
  hints: string[];
}

interface ValidationResult {
  status: boolean;
  syntax_correct: boolean;
  compilable_code: boolean;
  error: string;
}

interface SuggestionResult {
  errors: string;
  improvements: string;
  compliments: string;
  summary: string;
}

export default function PracticePage() {
  const [problemLevel, setProblemLevel] = useState<ProblemLevel>("beginner");
  const [problemStatement, setProblemStatement] =
    useState<ProblemStatement | null>(null);
  const [code, setCode] = useState<string>(
    "// Write your Solidity code here\npragma solidity ^0.8.0;\n\ncontract Solution {\n    \n}"
  );
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  // Theme color configurations
  const darkColors = {
    primary: "#7C3AED", // Violet-600
    primaryHover: "#6D28D9", // Violet-700
    accent: "#8B5CF6", // Violet-500
    background: "#0F0F0F", // Near black
    cardBg: "#1A1A1A", // Dark gray
    cardBgSecondary: "#212121", // Slightly lighter dark gray
    borderColor: "#2D2D2D", // Medium gray
    accentBorder: "#7C3AED", // Violet-600
    textPrimary: "#F9FAFB", // Gray-50
    textSecondary: "#E5E7EB", // Gray-200
    textMuted: "#9CA3AF", // Gray-400
    textAccent: "#A78BFA", // Violet-400
  };

  const lightColors = {
    primary: "#7C3AED", // Keep violet as primary
    primaryHover: "#6D28D9", // Violet-700
    accent: "#111111", // Black accent
    background: "#F2E8FF", // Warmer pastel violet background
    cardBg: "#FAF3FF", // Warmer, lighter pastel violet for cards
    cardBgSecondary: "#EBE0FF", // Warmer secondary violet
    borderColor: "#D8CAF0", // Warmer violet border
    accentBorder: "#111111", // Black accent border
    textPrimary: "#2D2235", // Warm dark violet, almost black
    textSecondary: "#4A3960", // Warmer dark violet for secondary text
    textMuted: "#786A92", // Warmer medium violet for muted text
    textAccent: "#111111", // Black accent text
  };
  // Get current theme colors
  const colors = theme === "dark" ? darkColors : lightColors;

  // Configure Monaco editor for Solidity
  const beforeMount = (monaco: any) => {
    // Register Solidity language if not already registered
    if (
      !monaco.languages
        .getLanguages()
        .some((lang: any) => lang.id === "solidity")
    ) {
      monaco.languages.register({ id: "solidity" });

      // Basic Solidity syntax highlighting
      monaco.languages.setMonarchTokensProvider("solidity", {
        keywords: [
          "pragma",
          "solidity",
          "contract",
          "interface",
          "library",
          "is",
          "public",
          "private",
          "internal",
          "external",
          "view",
          "pure",
          "payable",
          "constant",
          "immutable",
          "constructor",
          "function",
          "modifier",
          "event",
          "struct",
          "enum",
          "mapping",
          "if",
          "else",
          "for",
          "while",
          "do",
          "break",
          "continue",
          "return",
          "emit",
          "uint",
          "uint256",
          "int",
          "int256",
          "bool",
          "address",
          "string",
          "bytes",
          "memory",
          "storage",
          "calldata",
          "delete",
          "new",
          "require",
          "revert",
          "assert",
          "this",
          "super",
          "selfdestruct",
        ],

        operators: [
          "=",
          ">",
          "<",
          "!",
          "~",
          "?",
          ":",
          "==",
          "<=",
          ">=",
          "!=",
          "&&",
          "||",
          "++",
          "--",
          "+",
          "-",
          "*",
          "/",
          "&",
          "|",
          "^",
          "%",
          "<<",
          ">>",
          ">>>",
          "+=",
          "-=",
          "*=",
          "/=",
          "&=",
          "|=",
          "^=",
          "%=",
          "<<=",
          ">>=",
          ">>>=",
        ],

        symbols: /[=><!~?:&|+\-*\/\^%]+/,

        tokenizer: {
          root: [
            [
              /[a-z_$][\w$]*/,
              {
                cases: {
                  "@keywords": "keyword",
                  "@default": "identifier",
                },
              },
            ],
            [/[A-Z][\w\$]*/, "type.identifier"],
            { include: "@whitespace" },
            [/[{}()\[\]]/, "@brackets"],
            [/[<>](?!@symbols)/, "@brackets"],
            [
              /@symbols/,
              {
                cases: {
                  "@operators": "operator",
                  "@default": "",
                },
              },
            ],
            [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
            [/0[xX][0-9a-fA-F]+/, "number.hex"],
            [/\d+/, "number"],
            [/[;,.]/, "delimiter"],
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
          ],

          string: [
            [/[^\\"]+/, "string"],
            [/\\./, "string.escape"],
            [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
          ],

          whitespace: [
            [/[ \t\r\n]+/, "white"],
            [/\/\*/, "comment", "@comment"],
            [/\/\/.*$/, "comment"],
          ],

          comment: [
            [/[^\/*]+/, "comment"],
            [/\*\//, "comment", "@pop"],
            [/[\/*]/, "comment"],
          ],
        },
      });

      // Set Solidity editor theme for dark mode
      monaco.editor.defineTheme("solidityDarkTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "A78BFA" },
          { token: "string", foreground: "65B741" },
          { token: "number", foreground: "61DAFB" },
          { token: "comment", foreground: "6B7280" },
          { token: "type.identifier", foreground: "38BDF8" },
        ],
        colors: {
          "editor.background": darkColors.cardBg,
          "editor.foreground": "#F9FAFB",
          "editorCursor.foreground": "#F9FAFB",
          "editor.lineHighlightBackground": "#2D2D2D40",
          "editorLineNumber.foreground": "#6B7280",
          "editor.selectionBackground": "#7C3AED40",
          "editor.inactiveSelectionBackground": "#6D28D940",
        },
      });

      // Set Solidity editor theme for light mode
      monaco.editor.defineTheme("solidityLightTheme", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "7C3AED" }, // Violet
          { token: "string", foreground: "8B5CF6" }, // Warmer violet instead of green
          { token: "number", foreground: "6D28D9" }, // Deeper violet instead of blue
          { token: "comment", foreground: "786A92" }, // Warmer violet gray
          { token: "type.identifier", foreground: "9F67FF" }, // Warmer violet instead of blue
        ],
        colors: {
          "editor.background": lightColors.cardBg, // Using our warmer card background
          "editor.foreground": "#2D2235", // Warmer dark text
          "editorCursor.foreground": "#2D2235", // Matching cursor color
          "editor.lineHighlightBackground": "#EBE0FF", // Warmer highlight
          "editorLineNumber.foreground": "#786A92", // Warmer line numbers
          "editor.selectionBackground": "#C4B5FC40", // Warmer selection
          "editor.inactiveSelectionBackground": "#C4B5FC30", // Warmer inactive selection
        },
      });
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    fetchProblem(problemLevel);

    // Ensure body has overflow hidden
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      // Clean up when component unmounts
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [problemLevel]);

  const fetchProblem = async (level: ProblemLevel) => {
    setIsLoading(true);
    try {
      let endpoint = "";
      switch (level) {
        case "beginner":
          endpoint = "/api/generatePS";
          break;
        case "intermediate":
          endpoint = "/api/generatePSI";
          break;
        case "advanced":
          endpoint = "/api/generatePSA";
          break;
      }

      const response = await fetch(endpoint);
      const data = await response.json();
      setProblemStatement(data);
      setValidationResult(null);
      setSuggestions(null);
      setValidationStatus(null);
      setShowValidation(false);
    } catch (error) {
      console.error("Error fetching problem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateCode = async () => {
    if (!problemStatement) return;

    setValidationStatus("validating");
    setShowValidation(true);
    try {
      const response = await fetch("/api/validate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem_statement: JSON.stringify(problemStatement),
          code,
        }),
      });

      const data = await response.json();
      setValidationResult(data);
      setValidationStatus(data.status ? "valid" : "invalid");
    } catch (error) {
      console.error("Error validating code:", error);
      setValidationStatus("invalid");
    }
  };

  const getSuggestions = async () => {
    if (!problemStatement) return;

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem_statement: JSON.stringify(problemStatement),
          code,
        }),
      });

      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error getting suggestions:", error);
    }
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: colors.background,
        backgroundImage: `radial-gradient(${colors.accent}10 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        color: colors.textPrimary,
      }}
    >
      <div className="h-full w-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div
              className="w-3 h-10 mr-3 rounded"
              style={{ backgroundColor: colors.accent }}
            ></div>
            <h1
              className="text-3xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              Solidity Practice Arena
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            {/* Theme Toggle Button */}
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="p-2 rounded-full"
              style={{
                backgroundColor: "transparent",
                borderColor: colors.borderColor,
              }}
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
            >
              {theme === "dark" ? (
                <Sun size={20} color={colors.textPrimary} />
              ) : (
                <Moon size={20} color={colors.textPrimary} />
              )}
            </Button>

            <Button
              onClick={() => setProblemLevel("beginner")}
              variant={problemLevel === "beginner" ? "default" : "outline"}
              style={{
                backgroundColor:
                  problemLevel === "beginner" ? colors.primary : "transparent",
                borderColor: colors.primary,
                color:
                  problemLevel === "beginner"
                    ? theme === "dark"
                      ? colors.textPrimary
                      : "#ffffff"
                    : colors.textAccent,
              }}
              className="hover:opacity-90 transition-opacity"
            >
              Novice
            </Button>
            <Button
              onClick={() => setProblemLevel("intermediate")}
              variant={problemLevel === "intermediate" ? "default" : "outline"}
              style={{
                backgroundColor:
                  problemLevel === "intermediate"
                    ? colors.primary
                    : "transparent",
                borderColor: colors.primary,
                color:
                  problemLevel === "intermediate"
                    ? theme === "dark"
                      ? colors.textPrimary
                      : "#ffffff"
                    : colors.textAccent,
              }}
              className="hover:opacity-90 transition-opacity"
            >
              Beginner
            </Button>
            <Button
              onClick={() => setProblemLevel("advanced")}
              variant={problemLevel === "advanced" ? "default" : "outline"}
              style={{
                backgroundColor:
                  problemLevel === "advanced" ? colors.primary : "transparent",
                borderColor: colors.primary,
                color:
                  problemLevel === "advanced"
                    ? theme === "dark"
                      ? colors.textPrimary
                      : "#ffffff"
                    : colors.textAccent,
              }}
              className="hover:opacity-90 transition-opacity"
            >
              Intermediate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow overflow-hidden">
          {/* Left Column */}
          <div className="flex flex-col gap-4 h-full overflow-hidden">
            {/* Problem Statement */}
            <Card
              className="p-4 h-3/5 overflow-auto scrollbar-thin scrollbar-track-transparent transition-colors duration-300"
              style={
                {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.borderColor,
                  "--scrollbar-thumb": colors.primary,
                } as React.CSSProperties
              }
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div
                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
                    style={{ borderColor: colors.accent }}
                  ></div>
                </div>
              ) : problemStatement ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div
                      className="w-1 h-6 mr-2 rounded"
                      style={{ backgroundColor: colors.accent }}
                    ></div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      {problemStatement.title}
                    </h2>
                  </div>
                  <p className="mb-4" style={{ color: colors.textSecondary }}>
                    {problemStatement.description}
                  </p>

                  <h3
                    className="text-xl font-semibold mb-2 flex items-center"
                    style={{ color: colors.textPrimary }}
                  >
                    <span
                      className="inline-block w-2 h-2 mr-2 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                    ></span>
                    Requirements:
                  </h3>
                  <ul className="list-disc pl-5 mb-4">
                    {problemStatement.requirements.map((req, index) => (
                      <li
                        key={index}
                        className="mb-1"
                        style={{ color: colors.textSecondary }}
                      >
                        {req}
                      </li>
                    ))}
                  </ul>

                  <h3
                    className="text-xl font-semibold mb-2 flex items-center"
                    style={{ color: colors.textPrimary }}
                  >
                    <span
                      className="inline-block w-2 h-2 mr-2 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                    ></span>
                    Hints:
                  </h3>
                  <ul className="list-disc pl-5">
                    {problemStatement.hints.map((hint, index) => (
                      <li
                        key={index}
                        className="mb-1"
                        style={{ color: colors.textSecondary }}
                      >
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: colors.textSecondary }}>
                    No problem statement available. Please select a difficulty
                    level.
                  </p>
                </div>
              )}
            </Card>

            {/* Suggestions */}
            <Card
              className="p-4 h-2/5 overflow-auto scrollbar-thin scrollbar-track-transparent transition-colors duration-300"
              style={
                {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.borderColor,
                  "--scrollbar-thumb": colors.primary,
                } as React.CSSProperties
              }
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div
                    className="w-1 h-6 mr-2 rounded"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    Suggestions
                  </h2>
                </div>
                <Button
                  onClick={getSuggestions}
                  disabled={!problemStatement}
                  style={{
                    backgroundColor: colors.primary,
                    color: theme === "dark" ? colors.textPrimary : "#ffffff",
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  Get Suggestions
                </Button>
              </div>

              {suggestions ? (
                <div>
                  {suggestions.compliments && (
                    <div className="mb-3">
                      <h4
                        className="font-medium mb-1 flex items-center"
                        style={{ color: colors.textPrimary }}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 mr-2 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        ></span>
                        Compliments:
                      </h4>
                      <p style={{ color: colors.textSecondary }}>
                        {suggestions.compliments}
                      </p>
                    </div>
                  )}

                  {suggestions.errors && (
                    <div className="mb-3">
                      <h4
                        className="font-medium mb-1 flex items-center"
                        style={{ color: colors.textPrimary }}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 mr-2 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        ></span>
                        Issues:
                      </h4>
                      <p style={{ color: colors.textSecondary }}>
                        {suggestions.errors}
                      </p>
                    </div>
                  )}

                  {suggestions.improvements && (
                    <div className="mb-3">
                      <h4
                        className="font-medium mb-1 flex items-center"
                        style={{ color: colors.textPrimary }}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 mr-2 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        ></span>
                        Improvements:
                      </h4>
                      <p style={{ color: colors.textSecondary }}>
                        {suggestions.improvements}
                      </p>
                    </div>
                  )}

                  {suggestions.summary && (
                    <div>
                      <h4
                        className="font-medium mb-1 flex items-center"
                        style={{ color: colors.textPrimary }}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 mr-2 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        ></span>
                        Summary:
                      </h4>
                      <p style={{ color: colors.textSecondary }}>
                        {suggestions.summary}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: colors.textMuted }}>
                  Click "Get Suggestions" for code feedback and improvement
                  tips.
                </p>
              )}
            </Card>
          </div>

          {/* Right Column - Code Editor */}
          <div className="h-full overflow-hidden relative">
            <Card
              className="p-4 h-full overflow-hidden transition-colors duration-300"
              style={{
                backgroundColor: colors.cardBg,
              }}
            >
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="w-1 h-6 mr-2 rounded"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    Solidity Editor
                  </h2>
                </div>
                <Button
                  onClick={validateCode}
                  disabled={
                    !problemStatement || validationStatus === "validating"
                  }
                  style={{
                    backgroundColor: colors.primary,
                    color: theme === "dark" ? colors.textPrimary : "#ffffff",
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  {validationStatus === "validating"
                    ? "Validating..."
                    : "Validate Code"}
                </Button>
              </div>

              <div
                className="h-[calc(100%-3rem)] rounded-md overflow-hidden border transition-colors duration-300"
                style={{ borderColor: colors.cardBg }}
              >
                <Editor
                  height="100%"
                  defaultLanguage="solidity"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme={
                    theme === "dark"
                      ? "solidityDarkTheme"
                      : "solidityLightTheme"
                  }
                  beforeMount={beforeMount}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: "on",
                    fontFamily: "'Fira Code', monospace",
                  }}
                />
              </div>
            </Card>

            {/* Slide-up Validation Panel */}
            <AnimatePresence>
              {showValidation && (
                <motion.div
                  initial={{ y: 300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 300, opacity: 0 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="absolute bottom-4 right-4 w-2/3 rounded-lg shadow-lg z-10 p-4 transition-colors duration-300"
                  style={{
                    backgroundColor: colors.cardBgSecondary,
                    borderColor: colors.borderColor,
                    borderWidth: 1,
                  }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div
                        className="w-1 h-6 mr-2 rounded"
                        style={{ backgroundColor: colors.accent }}
                      ></div>
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: colors.textPrimary }}
                      >
                        Validation Result
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowValidation(false)}
                      className="text-lg font-bold"
                      style={{ color: colors.textSecondary }}
                    >
                      ×
                    </button>
                  </div>

                  {validationResult ? (
                    <div
                      className="p-3 rounded transition-colors duration-300"
                      style={{
                        backgroundColor: validationResult.status
                          ? theme === "dark"
                            ? "#21211D"
                            : "#F0FDF4"
                          : theme === "dark"
                          ? "#252428"
                          : "#FEF2F2",
                        borderLeft: `4px solid ${
                          validationResult.status ? "#4ADE80" : "#EF4444"
                        }`,
                      }}
                    >
                      <p
                        className="font-medium mb-2"
                        style={{ color: colors.textPrimary }}
                      >
                        Status:{" "}
                        <span
                          style={{
                            color: validationResult.status
                              ? "#4ADE80"
                              : "#EF4444",
                          }}
                        >
                          {validationResult.status ? "Valid" : "Invalid"}
                        </span>
                      </p>
                      <p style={{ color: colors.textSecondary }}>
                        Syntax Correct:{" "}
                        <span
                          style={{
                            color: validationResult.syntax_correct
                              ? "#4ADE80"
                              : "#EF4444",
                          }}
                        >
                          {validationResult.syntax_correct ? "Yes" : "No"}
                        </span>
                      </p>
                      <p style={{ color: colors.textSecondary }}>
                        Compilable:{" "}
                        <span
                          style={{
                            color: validationResult.compilable_code
                              ? "#4ADE80"
                              : "#EF4444",
                          }}
                        >
                          {validationResult.compilable_code ? "Yes" : "No"}
                        </span>
                      </p>
                      {validationResult.error && (
                        <div
                          className="mt-2 p-3 rounded overflow-auto max-h-32 scrollbar-thin transition-colors duration-300"
                          style={{
                            backgroundColor:
                              theme === "dark" ? "#1A1A1A" : "#F9FAFB",
                          }}
                        >
                          <p style={{ color: colors.textSecondary }}>Error:</p>
                          <div
                            className="w-full h-32 rounded overflow-hidden mt-2 border transition-colors duration-300"
                            style={{
                              borderColor:
                                theme === "dark" ? "#2D2D2D" : "#E5E7EB",
                            }}
                          >
                            <Editor
                              height="100%"
                              defaultLanguage="solidity"
                              value={validationResult.error}
                              theme={
                                theme === "dark"
                                  ? "solidityDarkTheme"
                                  : "solidityLightTheme"
                              }
                              beforeMount={beforeMount}
                              options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                fontSize: 12,
                                wordWrap: "on",
                                lineNumbers: "off",
                                glyphMargin: false,
                                folding: false,
                                lineDecorationsWidth: 0,
                                lineNumbersMinChars: 0,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : validationStatus === "validating" ? (
                    <div className="flex items-center justify-center py-4">
                      <div
                        className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 transition-colors duration-300"
                        style={{ borderColor: colors.accent }}
                      ></div>
                      <span
                        className="ml-3"
                        style={{ color: colors.textSecondary }}
                      >
                        Validating your code...
                      </span>
                    </div>
                  ) : (
                    <p style={{ color: colors.textMuted }}>
                      Waiting for validation...
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
