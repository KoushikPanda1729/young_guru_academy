import type { Metadata } from "next";

export const siteConfig = {
  name: "Young Guru Academy",
  description:
    "Transform your skills with flexible online courses. Offering personal and group batches for students, professionals, and homemakers.",
  url: "https://youngguruacademy.com",
  ogImage: "https://youngguruacademy.com/images/og-image.jpg",
  links: {
    twitter: "https://twitter.com/youngguruacademy",
    github: "https://github.com/youngguruacademy",
  },
  keywords: [
    "online courses",
    "skill development",
    "online learning",
    "education platform",
    "group batch",
    "personal batch",
    "demo class",
    "young guru academy",
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "Young Guru Academy",
      url: siteConfig.url,
    },
  ],
  creator: "Young Guru Academy",
  publisher: "Young Guru Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@youngguruacademy",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};
