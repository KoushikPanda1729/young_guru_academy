"use client";

import { FaInstagram, FaFacebookSquare, FaWhatsapp } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { IoMdMail } from "react-icons/io";
import Link from "next/link";
import Logo from "./logo";
import Image from "next/image";

const data = {
  facebookLink:
    "https://www.facebook.com/groups/FreeOnlineEnglishSpeakingCoursegroups",
  instaLink: "https://www.instagram.com/youngguruacademy2018/?hl=en",
  youtubeLink: "https://www.youtube.com/c/YOUNGGURUACADEMY2020/featured",

  quickLinks: {
    home: "#home",
    courses: "#courses",
    aboutUs: "#about",
    features: "#features",
    testimonal: "#testimonial",
  },

  supportLinks: {
    faqs: "#faq",
    refundPolicy: "/policies/refund",
    termsOfServices: "/policies/terms",
    privacyPolicy: "/policies/privacy",
  },

  contact: {
    email: "info@bunnieducation.com",
    whatsapp: "+91 95609 98990",
  },

  company: {
    name: "Young Guru Academy",
  },

  stores: {
    playStore:
      "https://play.google.com/store/apps/details?id=com.app.talk2partners",
    appStore: "#",
  },
};

const contactInfo = [
  {
    icon: IoMdMail,
    label: "Email",
    text: data.contact.email,
    link: `mailto:${data.contact.email}`,
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    text: data.contact.whatsapp,
    link: `https://wa.me/${data.contact.whatsapp.replace(/\D/g, "")}`,
  },
];

const socialLinks = [
  { icon: FaInstagram, label: "Instagram", href: data.instaLink },
  { icon: FaFacebookSquare, label: "Facebook", href: data.facebookLink },
  { icon: IoLogoYoutube, label: "Youtube", href: data.youtubeLink },
];

const quickLinks = [
  { text: "Home", href: data.quickLinks.home },
  { text: "Courses", href: data.quickLinks.courses },
  { text: "Testimonal", href: data.quickLinks.testimonal },
  { text: "About Us", href: data.quickLinks.aboutUs },
];

const supportLinks = [
  { text: "FAQs", href: data.supportLinks.faqs },
  { text: "Refund Policy", href: data.supportLinks.refundPolicy },
  { text: "Terms of Services", href: data.supportLinks.termsOfServices },
  { text: "Privacy Policy", href: data.supportLinks.privacyPolicy },
];

export default function FooterSection() {
  return (
    <footer className="mt-16 w-full place-self-end rounded-t-xl bg-secondary dark:bg-secondary/20">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Section: Logo & Store Links */}
          <div>
            <div className="flex flex-col gap-4 text-primary sm:items-start items-center">
              <Logo />
              <p className="text-muted-foreground text-sm text-center sm:text-left">
                Managed by Bunni Education Service Pvt Ltd
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="https://play.google.com/store/apps/details?id=com.app.talk2partners"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/badges/google-play-badge.png"
                    alt="Get it on Google Play"
                    width={160}
                    height={47}
                    className="h-12 w-auto"
                  />
                </Link>

                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/badges/app-store-badge.svg"
                    alt="Download on the App Store"
                    width={160}
                    height={47}
                    className="h-12 w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Middle and Right Section: Links & Contact */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Quick Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {quickLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition hover:text-primary"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Support</p>
              <ul className="mt-8 space-y-4 text-sm">
                {supportLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition hover:text-primary"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info + Socials */}
            <div className="sm:col-span-2">
              <p className="text-center sm:text-left text-lg font-medium">
                Contact
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, link, label }) => (
                  <li key={label}>
                    <Link
                      href={link}
                      className="flex items-center gap-3 justify-center sm:justify-start text-secondary-foreground/70 hover:text-primary transition"
                    >
                      <Icon className="text-primary size-5 shrink-0" />
                      <span>{text}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Icons */}
              <ul className="mt-8 flex justify-center sm:justify-start gap-6 md:gap-8">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-primary hover:text-primary/80 transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="sr-only">{label}</span>
                      <Icon className="size-6" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 border-t pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-secondary-foreground/70">
              &copy; 2025 {data.company.name}
            </p>
            <p className="text-sm mt-4 sm:mt-0">All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
