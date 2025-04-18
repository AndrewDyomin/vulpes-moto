import { Roboto } from "next/font/google";
import "./globals.css";
import headerImage from "../../public/pageHeader.png";
import logo from "../../public/logo-vulpes.png";
import Image from "next/image";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Vulpes Moto",
  description: "Vulpes Moto — професійний тюнінг, аксесуари та захист для мотоциклів, скутерів і квадроциклів. Продукція провідних європейських брендів в Україні.",
  keywords: [
    "тюнінг мотоциклів",
    "аксесуари для мотоциклів",
    "мото тюнінг Україна",
    "Vulpes Moto",
    "захист для мотоциклів",
    "мотоциклетні аксесуари",
    "сучасний мото тюнінг",
    "мото комплектуючі",
    "мото естетика",
    "ConStands",
    "Bagtecs",
    "Craftride",
    "мотооборудование",
    "запчастини для скутера",
    "тюнинг квадроцикла"
  ],
  other: {
    "google-site-verification": "LFzL05vfJF8gEKJvfuHLL3CkUbxPJj-Px10ALJbDtJE"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <header className={"header"}>
          <Image
            src={headerImage}
            alt="Backgrond motor"
            fill
            style={{ objectFit: "contain" }}
          />
          <div className={"container"}>
            <Image
              src={logo}
              alt="Vulpes Moto"
              width={200}
              height={50}
              priority
              className="logoImage"
            />
            <nav className={"nav"}>
              <a href=".//#contact">Контакти</a>
              <a 
                href="https://vulpes.com.ua/kataloh" 
                className="link"
                target="_blank" 
                rel="noopener noreferrer"
              >Каталог</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
