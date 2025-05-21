"use client";

import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/header.css";
import "./styles/home.css";
import "./styles/signIn.css";
import "./styles/faqbot.css";
import "./styles/font-face.css";

import SessionWrapper from "@/components/SessionWrapper";
import { Header } from "@/components/header"


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper >
          <Header />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
