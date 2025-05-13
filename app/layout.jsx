import { TiHeartFullOutline } from "react-icons/ti";
import {
  Courgette,
  Playwrite_IN,
  Monsieur_La_Doulaise,
  Edu_SA_Beginner,
  Edu_AU_VIC_WA_NT_Hand,
} from "next/font/google";
import "./globals.css";
import Navbar from "./navigation";
import Link from "next/link";

const courgette = Courgette({
  variable: "--font-courgette",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const playwrite_IN = Playwrite_IN({
  variable: "--font-playwrite",
  subsets: ["latin"],
  weight: "300",
  display: "swap",
});

const monsieur_La_Doulaise = Monsieur_La_Doulaise({
  variable: "--font-monsieur-la-doulaise",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const edu_SA_Beginner = Edu_SA_Beginner({
  variable: "--font-edu-sa-beginner",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const edu_AU_VIC_WA_NT_Hand = Edu_AU_VIC_WA_NT_Hand({
  variable: "--font-edu-au-vic-wa-nt-hand",
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

export const metadata = {
  title: "Taste Forge",
  description: "AI forging unique tastes",
  openGraph: {
    title: "Taste Forge",
    description: "AI forging unique tastes",
    url: "https://tasteforge.netlify.app/",
    siteName: "Taste Forge",

    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${courgette.variable} ${playwrite_IN.variable} ${monsieur_La_Doulaise.variable} ${edu_SA_Beginner.variable} ${edu_AU_VIC_WA_NT_Hand.variable} antialiased ${edu_AU_VIC_WA_NT_Hand.className} selection:bg-primary selection:text-background `}
      >
        <Navbar />
        <div className="min-h-screen pt-20">{children}</div>
        <footer
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "0.9rem",
            color: "#888",
            marginBottom: "1rem",
          }}
        >
          <div className="text-lg text-foreground w-fit mx-auto">
            <Link
              href="https://thesujalpatel.github.io/"
              className="flex justify-center items-center"
            >
              made with
              <TiHeartFullOutline className="inline text-red-500 mx-[0.3ch]" />
              by Sujal
            </Link>
          </div>
          &copy; {new Date().getFullYear()} Sujal Patel. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
