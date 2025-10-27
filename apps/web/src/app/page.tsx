import type { Metadata } from "next";
import AboutUsSection from "@/components/about-us";
import CourseSection from "@/components/courses";
import FaqSection from "@/components/faq";
import FeatureSections from "@/components/features";
import HeroSection from "@/components/hero";
import TestimonalSection from "@/components/testimonal";
import { CtaSection } from "../components/cta";
import DeepavaliOfferPopup from "../components/course-popup";
import { siteConfig } from "@/config/seo";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} - Improve Your English Fluency`,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
};

export default function Home() {
  return (
    <div>
      <DeepavaliOfferPopup />
      <HeroSection />
      <FeatureSections />
      <CourseSection />
      <TestimonalSection />
      <AboutUsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
