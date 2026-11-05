import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alfabetiza.aitecnologia.xyz"),
  title: "Alfabetiza AÍ — Alfabetização por Voz com Inteligência Artificial",
  description:
    "Ambiente de alfabetização e consciência fonológica 100% por voz com Inteligência Artificial para crianças nos anos iniciais, estudantes neurodivergentes (TEA/TDAH) e EJA.",
  keywords: [
    "Alfabetiza AÍ",
    "alfabetização por voz",
    "alfabetização com IA",
    "consciência fonológica",
    "alfabetização TEA TDAH",
    "alfabetização EJA",
    "BNCC alfabetização",
  ],
  alternates: {
    canonical: "https://alfabetiza.aitecnologia.xyz/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://alfabetiza.aitecnologia.xyz/",
    siteName: "Alfabetiza AÍ",
    title: "Alfabetiza AÍ — Alfabetização por Voz com Inteligência Artificial",
    description:
      "Tutoria de alfabetização e letramento 100% por voz, sem necessidade de digitação, para anos iniciais, inclusão (TEA/TDAH) e EJA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alfabetiza AÍ — Alfabetização por Voz com IA",
    description:
      "Tutoria de alfabetização e letramento 100% por voz para crianças, inclusão (TEA/TDAH) e EJA.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Alfabetiza AÍ",
  url: "https://alfabetiza.aitecnologia.xyz/",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "pt-BR",
  description:
    "Ambiente de alfabetização e consciência fonológica 100% por voz para anos iniciais, estudantes neurodivergentes (TEA/TDAH) e turmas de EJA.",
  provider: {
    "@type": "Organization",
    name: "AÍ Tecnologia e Educação",
    url: "https://aitecnologia.xyz",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <html
        lang="pt-BR"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-lg"
          >
            Pular para o conteúdo principal
          </a>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
          <CookieConsent />
        </body>
      </html>
    </ClerkProvider>
  );
}
