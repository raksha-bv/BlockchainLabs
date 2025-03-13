"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Code2 } from "lucide-react";

type ValidationStatus = null | "validating" | "valid" | "invalid";
type ThemeMode = "dark" | "light";

interface ValidationResult {
  status: boolean;
  syntax_correct: boolean;
  compilable_code: boolean;
  error: string;
}

interface ProblemStatement {
  title: string;
  description: string;
  requirements: string[];
  hints: string[];
}

interface CodeEditorProps {
  theme: ThemeMode;
  code: string;
  setCode: (code: string) => void;
  problemStatement: ProblemStatement | null;
  colors: {
    cardBg: string;
    cardBgSecondary: string;
    borderColor: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    primary: string;
  };
  validationStatus: ValidationStatus;
  validationResult: ValidationResult | null;
  validateCode: () => Promise<void>;
  showValidation: boolean;
  setShowValidation: (show: boolean) => void;
  isFreestyleMode?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  theme,
  code,
  setCode,
  problemStatement,
  colors,
  validationStatus,
  validationResult,
  validateCode,
  showValidation,
  setShowValidation,
  isFreestyleMode = false,
}) => {
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
          "editor.background": colors.cardBg,
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
          "editor.background": "#FAF3FF", // Using our warmer card background
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

  return (
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
              {isFreestyleMode ? "Solidity Editor" : "Challenge Editor"}
            </h2>
          </div>
          <Button
            onClick={validateCode}
            disabled={
              (!isFreestyleMode && !problemStatement) ||
              validationStatus === "validating"
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
              theme === "dark" ? "solidityDarkTheme" : "solidityLightTheme"
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
                      color: validationResult.status ? "#4ADE80" : "#EF4444",
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
                      backgroundColor: theme === "dark" ? "#1A1A1A" : "#F9FAFB",
                    }}
                  >
                    <p style={{ color: colors.textSecondary }}>Error:</p>
                    <div
                      className="w-full h-32 rounded overflow-hidden mt-2 border transition-colors duration-300"
                      style={{
                        borderColor: theme === "dark" ? "#2D2D2D" : "#E5E7EB",
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
                <span className="ml-3" style={{ color: colors.textSecondary }}>
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
  );
};

export default CodeEditor;
