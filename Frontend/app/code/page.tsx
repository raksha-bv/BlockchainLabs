"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun, Code2, Zap, GripVertical } from "lucide-react";

type ValidationStatus = null | "validating" | "valid" | "invalid";
type ThemeMode = "dark" | "light";

interface ValidationResult {
  status: boolean;
  syntax_correct: boolean;
  compilable_code: boolean;
  error: string;
}

interface SuggestionFix {
  fixTitle: string;
  description?: string; // Optional property
  code_snippet?: string; // Optional property
}

interface SuggestionResult {
  errors: string;
  improvements: string;
  compliments: string;
  summary: string;
  fixes?: Array<SuggestionFix>;
}

export default function CodeEditorPage() {
  const [code, setCode] = useState<string>(
    "// Write your Solidity code here\npragma solidity ^0.8.0;\n\ncontract MyContract {\n    \n}"
  );
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  // Panel resizing state
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseMoveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const mouseUpHandlerRef = useRef<(() => void) | null>(null);

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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!containerRef.current) return;
    setIsDragging(true);

    // Store the initial mouse position and panel width when dragging starts
    const containerRect = containerRef.current.getBoundingClientRect();
    const initialMouseX = e.clientX;
    const initialLeftWidth = (leftPanelWidth / 100) * containerRect.width;

    // Define the move handler with closure over initial values
    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;

      const containerWidth = containerRect.width;
      const deltaX = moveEvent.clientX - initialMouseX;
      const newWidth = initialLeftWidth + deltaX;

      // Calculate new width percentage (with limits)
      const newWidthPercent = Math.min(
        Math.max((newWidth / containerWidth) * 100, 30),
        70
      );

      setLeftPanelWidth(newWidthPercent);
    };

    // Define the up handler
    const mouseUpHandler = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);

      // Clear refs
      mouseMoveHandlerRef.current = null;
      mouseUpHandlerRef.current = null;
    };

    // Store handlers in refs for cleanup
    mouseMoveHandlerRef.current = mouseMoveHandler;
    mouseUpHandlerRef.current = mouseUpHandler;

    // Add the event listeners
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  // Cleanup event listeners when component unmounts
  useEffect(() => {
    return () => {
      if (mouseMoveHandlerRef.current) {
        document.removeEventListener("mousemove", mouseMoveHandlerRef.current);
      }
      if (mouseUpHandlerRef.current) {
        document.removeEventListener("mouseup", mouseUpHandlerRef.current);
      }
    };
  }, []);
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

  const validateCode = async () => {
    setValidationStatus("validating");
    setShowValidation(true);
    try {
      const response = await fetch("/api/validate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
    setIsLoading(true);
    try {
      const response = await fetch("/api/freestyle-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      });

      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error getting suggestions:", error);
    } finally {
      setIsLoading(false);
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
              Solidity Code Editor
            </h1>
          </div>
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="p-2 rounded-full"
            style={{
              backgroundColor: "transparent",
              borderColor: colors.borderColor,
            }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun size={20} color={colors.textPrimary} />
            ) : (
              <Moon size={20} color={colors.textPrimary} />
            )}
          </Button>
        </div>

        {/* Resizable panels container */}
        <div
          ref={containerRef}
          className="flex-grow flex overflow-hidden relative"
          style={{ cursor: isDragging ? "col-resize" : "default" }}
        >
          {/* Left Column - Code Editor */}
          <div
            className="h-full overflow-hidden relative transition-all duration-150 ease-in-out"
            style={{ width: `${leftPanelWidth}%` }}
          >
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
                    className="text-xl font-bold flex items-center"
                    style={{ color: colors.textPrimary }}
                  >
                    <Code2 size={20} className="mr-2" />
                    Solidity Editor
                  </h2>
                </div>
                <Button
                  onClick={validateCode}
                  disabled={validationStatus === "validating"}
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

          {/* Resizer handle */}
          <div
            className="flex items-center justify-center z-20 cursor-col-resize w-4 h-full hover:bg-opacity-20"
            onMouseDown={handleMouseDown}
            style={{
              backgroundColor: isDragging
                ? `${colors.accent}20`
                : "transparent",
              transition: "background-color 0.2s",
            }}
          >
            <div
              className="h-16 w-1 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: isDragging
                  ? colors.accent
                  : colors.borderColor,
                transition: "background-color 0.2s",
              }}
            >
              <GripVertical
                size={16}
                className="opacity-70 hover:opacity-100 transition-opacity"
                color={isDragging ? colors.textPrimary : colors.textMuted}
              />
            </div>
          </div>

          {/* Right Column - Suggestions */}
          <div
            className="h-full overflow-hidden transition-all duration-150 ease-in-out"
            style={{ width: `${100 - leftPanelWidth}%` }}
          >
            <Card
              className="p-4 h-full overflow-auto scrollbar-thin scrollbar-track-transparent transition-colors duration-300"
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
                    className="text-xl font-bold flex items-center"
                    style={{ color: colors.textPrimary }}
                  >
                    <Zap size={20} className="mr-2" />
                    Code Suggestions
                  </h2>
                </div>
                <Button
                  onClick={getSuggestions}
                  disabled={isLoading}
                  style={{
                    backgroundColor: colors.primary,
                    color: theme === "dark" ? colors.textPrimary : "#ffffff",
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div
                        className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 mr-2"
                        style={{
                          borderColor:
                            theme === "dark" ? colors.textPrimary : "#ffffff",
                        }}
                      ></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    "Get Suggestions"
                  )}
                </Button>
              </div>

              {suggestions ? (
                <div>
                  {suggestions.compliments && (
                    <div className="mb-4">
                      <h4
                        className="font-medium mb-2 flex items-center"
                        style={{ color: colors.textPrimary }}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 mr-2 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        ></span>
                        Compliments:
                      </h4>
                      <div
                        className="p-3 rounded-md"
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#21211D" : "#F0FDF4",
                          borderLeft: "4px solid #4ADE80",
                        }}
                      >
                        <p style={{ color: colors.textSecondary }}>
                          {suggestions.compliments}
                        </p>
                      </div>
                    </div>
                  )}

                  {suggestions.errors && (
                    <div className="mb-4">
                      <h4
                        className="font-medium mb-2 flex items-center"
                        style={{ color: colors.textPrimary }}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 mr-2 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        ></span>
                        Issues:
                      </h4>
                      <div
                        className="p-3 rounded-md"
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#252428" : "#FEF2F2",
                          borderLeft: "4px solid #EF4444",
                        }}
                      >
                        <p style={{ color: colors.textSecondary }}>
                          {suggestions.errors}
                        </p>
                      </div>
                    </div>
                  )}

                  {suggestions.improvements && (
                    <div className="mb-4">
                      <h4
                        className="font-medium mb-2 flex items-center"
                        style={{ color: colors.textPrimary }}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 mr-2 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        ></span>
                        Improvements:
                      </h4>
                      <div
                        className="p-3 rounded-md"
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#1E1E25" : "#EFF6FF",
                          borderLeft: "4px solid #3B82F6",
                        }}
                      >
                        <p style={{ color: colors.textSecondary }}>
                          {suggestions.improvements}
                        </p>
                      </div>
                    </div>
                  )}

                  {suggestions.fixes &&
                    Array.isArray(suggestions.fixes) &&
                    suggestions.fixes.length > 0 && (
                      <div className="mb-4">
                        <h4
                          className="font-medium mb-2 flex items-center"
                          style={{ color: colors.textPrimary }}
                        >
                          <span
                            className="inline-block w-1.5 h-1.5 mr-2 rounded-full"
                            style={{ backgroundColor: colors.accent }}
                          ></span>
                          Suggested Fixes:
                        </h4>
                        <div className="space-y-2">
                          {suggestions.fixes.map((fix, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-md"
                              style={{
                                backgroundColor:
                                  theme === "dark" ? "#1E2025" : "#F5F7FA",
                                borderLeft: "4px solid #8B5CF6",
                              }}
                            >
                              <p style={{ color: colors.textSecondary }}>
                                {typeof fix.fixTitle === "object"
                                  ? JSON.stringify(fix.fixTitle)
                                  : fix.fixTitle}
                              </p>
                              {fix.description && (
                                <p
                                  style={{
                                    color: colors.textSecondary,
                                    marginTop: "0.5rem",
                                  }}
                                >
                                  {typeof fix.description === "object"
                                    ? JSON.stringify(fix.description)
                                    : fix.description}
                                </p>
                              )}
                              {fix.code_snippet && (
                                <pre className="mt-2 p-2 bg-gray-800 text-white rounded">
                                  <code>{fix.code_snippet}</code>
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  {suggestions.summary && (
                    <div>
                      <h4
                        className="font-medium mb-2 flex items-center"
                        style={{ color: colors.textPrimary }}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 mr-2 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        ></span>
                        Summary:
                      </h4>
                      <div
                        className="p-3 rounded-md"
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#212224" : "#F9FAFB",
                          borderLeft: "4px solid #9CA3AF",
                        }}
                      >
                        <p style={{ color: colors.textSecondary }}>
                          {suggestions.summary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100%-3rem)]">
                  <div
                    className="p-8 rounded-full mb-4"
                    style={{ backgroundColor: `${colors.accent}10` }}
                  >
                    <Code2 size={48} color={colors.accent} />
                  </div>
                  <p
                    className="text-lg text-center mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    No suggestions yet
                  </p>
                  <p
                    className="text-center max-w-md"
                    style={{ color: colors.textMuted }}
                  >
                    Write some Solidity code and click "Get Suggestions" for
                    feedback on your code's quality, potential improvements, and
                    best practices.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
