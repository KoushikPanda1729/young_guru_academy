"use client";

import { AvatarCollections } from "./ui/avater-collection";
import PhoneMockup from "./ui/phone-mockup";
import { motion, AnimatePresence } from "motion/react";

interface PhoneWithOverlayUIProps {
  imageUrl: string;
}

export default function PhoneWithOverlayUI({
  imageUrl,
}: PhoneWithOverlayUIProps) {
  return (
    <div className="relative flex items-center justify-center px-4">
      {/* Floating card - Get Partner */}
      <div className="absolute z-15 left-0 top-[20%] bg-white rounded-xl shadow-xl p-4 w-[200px]">
        <h3 className="text-lg font-semibold text-blue-600">Get Partner</h3>
        <p className="text-sm text-gray-600">Start Spoken English Practice</p>
        <div className="flex mt-3 space-x-2">
          <AvatarCollections />
        </div>
      </div>

      {/* Floating card - Practice Now */}
      <div className="absolute z-20 right-0 top-[50%] bg-white rounded-xl shadow-xl p-4 w-[180px]">
        <p className="text-sm text-gray-700 mb-2">
          Practice speaking in a safe, comfortable space daily
        </p>
        <button className="w-full bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700 transition">
          Practice Now
        </button>
      </div>

      <PhoneMockup>
        <AnimatePresence mode="wait">
          <motion.img
            key={imageUrl}
            src={imageUrl}
            alt="Phone content"
            className="absolute inset-0 h-[600px] w-full object-cover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
      </PhoneMockup>
    </div>
  );
}
