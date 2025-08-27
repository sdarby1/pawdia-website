
import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/header.css";
import "./styles/home.css";
import "./styles/signIn.css";
import "./styles/faqbot.css";
import "./styles/font-face.css";
import "./styles/profile.css";
import "./styles/animal.css"
import "./styles/footer.css"

import SessionWrapper from "@/components/SessionWrapper";
import { Header } from "@/components/header"
import Footer from "@/components/footer";
import CookieConsentBanner from "@/components/CookieConsentBanner";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper >
          <Header />
          {children}
          <Footer/>
          <CookieConsentBanner />
        </SessionWrapper>
      </body>
    </html>
  );
}
