import type { Metadata } from "next";
import { PolicyClient } from "./policy-client";
import { slugToPolicyType } from "./slug-to-policy-type";
import { siteConfig } from "@/config/seo";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  const titles: Record<string, string> = {
    "privacy-policy": "Privacy Policy",
    "terms-of-service": "Terms of Service",
  };

  const descriptions: Record<string, string> = {
    "privacy-policy": `Read our privacy policy to understand how ${siteConfig.name} collects, uses, and protects your personal information.`,
    "terms-of-service": `Review the terms of service for using ${siteConfig.name} platform and services.`,
  };

  const title = titles[slug] || "Policy";
  const description = descriptions[slug] || `${siteConfig.name} policy document.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: "website",
      url: `${siteConfig.url}/policies/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PolicyPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const policyType = slugToPolicyType(slug);
  return <PolicyClient policyType={policyType} />;
}
