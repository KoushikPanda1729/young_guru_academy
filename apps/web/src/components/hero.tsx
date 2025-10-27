import { ContainerTextFlip } from "@t2p-admin/ui/components/container-text-flip";
import React from "react";
import Link from "next/link";
import PhoneWithCardOverlay from "./phone";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col md:flex-row items-center lg:justify-center justify-start gap-12 px-6 md:px-20 py-12 mt-20 lg:mt-[50px]"
    >
      {/* Left Side - Text */}
      <div className="max-w-2xl text-left space-y-6">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          <span>Transform Your Skills.</span>
          <br />
          <ContainerTextFlip
            words={["Learn", "Grow", "Succeed"]}
            interval={3000}
            animationDuration={700}
            className="inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            textClassName="text-primary"
          />
          {" with Expert Guidance"}
        </div>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
          <strong>Young Guru Academy</strong> offers comprehensive online
          courses designed for students, working professionals, and homemakers.
          Choose from flexible Group Batches for collaborative learning or
          Personal Batches for one-on-one attention. Start with a free demo
          class and experience quality education at your own pace.
        </p>

        {/* Store Buttons */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Link
            href="https://play.google.com/store/apps/details?id=com.app.talk2partners"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Image
              src="/badges/google-play-badge.png"
              alt="Get it on Google Play"
              width={160}
              height={47}
              className="h-12 w-auto"
            />
          </Link>

          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
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

      {/* Right Side - Image */}
      <div className="w-full max-w-md mt-10">
        <PhoneWithCardOverlay imageUrl={"/images/phone.png"} />
      </div>
    </section>
  );
}
