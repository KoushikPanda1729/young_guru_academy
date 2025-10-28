"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { AppStoreDialog } from "./app-store-dialog";

export function CtaSection() {
  const offerPrice = 499;
  const mrpPrice = 600;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <section
      id="cta"
      className="bg-primary rounded-3xl p-8 md:p-12 max-w-6xl mx-auto mt-20"
    >
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-6 text-left">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Offer – Spoken English Course
          </h2>
          <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-lg">
            Join <strong>Young Guru Academy&trade;</strong> and get expert-led
            courses.
          </p>

          {/* Offer Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-3xl md:text-4xl font-bold text-white">
              {formatPrice(offerPrice)}
            </span>
            <span className="text-lg md:text-xl line-through text-white/70">
              {formatPrice(mrpPrice)}
            </span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
              Save {Math.round(((mrpPrice - offerPrice) / mrpPrice) * 100)}%
            </span>
          </div>

          {/* Enroll Button */}
          <Link
            href="https://play.google.com/store/apps/details?id=co.classplus.yga"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <PlayCircle className="w-5 h-5" /> Enroll Now – ₹{offerPrice} 🎉
          </Link>

          {/* Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="https://play.google.com/store/apps/details?id=co.classplus.yga"
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

            <AppStoreDialog>
              <Image
                src="/badges/app-store-badge.svg"
                alt="Download on the App Store"
                width={160}
                height={47}
                className="h-12 w-auto"
              />
            </AppStoreDialog>
          </div>
        </div>

        {/* Right Phone Mockup */}
        <div className="hidden lg:flex justify-center md:justify-end">
          <div className="relative">
            <div className="w-64 h-[520px] bg-gray-800 rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
                <Image
                  src={"/images/phone.png"}
                  alt="Young Guru Academy app preview"
                  fill
                  className="object-cover rounded-[2.5rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
