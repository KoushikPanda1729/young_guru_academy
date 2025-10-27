import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { brico, geistMono, geistSans } from "@/components/fonts";
import Navbar from "@/components/navbar";
import FooterSection from "@/components/footer";
import { defaultMetadata } from "@/config/seo";
import {
  OrganizationStructuredData,
  WebSiteStructuredData,
  EducationalOrganizationStructuredData,
} from "@/components/structured-data";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationStructuredData />
        <WebSiteStructuredData />
        <EducationalOrganizationStructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${brico.variable} font-sans bg-background`}
      >
        <Navbar />
        {children}
        <FooterSection />
        <GoogleAnalytics gaId="G-GY7DWB0ZEQ" />
      </body>
    </html>
  );
}
