import type { Metadata } from "next";

export const siteConfig = {
  name: "Talk2Partners™",
  description:
    "Real time communication platform to improve English fluency and confidence.",
  url: "https://talk2partners.com", // Replace with your actual domain
  ogImage: "https://talk2partners.com/images/og-image.jpg", // Replace with your actual OG image
  links: {
    twitter: "https://twitter.com/talk2partners", // Replace with actual Twitter
    github: "https://github.com/talk2partners", // Replace with actual GitHub
  },
  keywords: [
    "English learning",
    "English fluency",
    "communication platform",
    "language learning",
    "English practice",
    "speaking practice",
    "English conversation",
    "improve English",
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
      name: "Talk2Partners",
      url: siteConfig.url,
    },
  ],
  creator: "Talk2Partners",
  publisher: "Talk2Partners",
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
    creator: "@talk2partners", // Replace with actual Twitter handle
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
