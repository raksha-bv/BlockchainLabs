import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solidity Practice Arena",
  description:
    "Practice Solidity smart contract development with AI-powered validation",
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="practice-layout">{children}</div>;
}
