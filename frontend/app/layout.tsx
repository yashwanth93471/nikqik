import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Document Q&A Assistant | RAG-Powered AI",
  description: "Upload documents and ask questions answered with AI using Retrieval-Augmented Generation",
  keywords: "AI, RAG, Document QA, Question Answering, OpenAI, GPT-4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
