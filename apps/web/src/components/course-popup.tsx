"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  PlayCircle,
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@t2p-admin/ui/components/dialog";
import { Button } from "@t2p-admin/ui/components/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DiwaliOfferPopup = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const course = {
    title: "App Launch Offer – Spoken English Course",
    description: `
Is Course ko humne is tarah se ready kiya hai jisme "Timing" ki koi problem nahi hai.
Koi bhi Admission le sakta hai — ✅ Working person, ✅ Student, ✅ Housewife ya ✅ Competitive Exams ki preparation kar rahe ho.
Aapko milega:
1) 65+ Recorded Videos (Jab chahe Aap Dekh Sakte hain)
2) 1500+ Vocabularies
3) 600+ Daily Use Sentences
4) Live Chat Facility
5) Audio Calling Practice Facility with Same Level Students.
Yeh Course bahut hi Easy Language me Prepare kiya gaya hai.
🕒 Duration - 01 Month
💥 Special App launch Offer – Sirf ₹9!`,
    durationValue: 30,
    durationUnit: "Days",
    price: 9,
    mrp: 899,
    thumbnails: [
      "/images/offer.jpeg",
      "/images/offer_2.jpg",
      "/images/offer_3.png",
    ],
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert("Sharable link copied!");
    }
  };

  const handleEnroll = () => {
    router.push(
      "https://play.google.com/store/apps/details?id=co.classplus.yga"
    );
    setOpen(false);
  };

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % course.thumbnails.length);

  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + course.thumbnails.length) % course.thumbnails.length
    );

  // 🟢 AUTO-SCROLL every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % course.thumbnails.length);
    }, 4000); // change slide every 4s

    return () => clearInterval(interval);
  }, [course.thumbnails.length]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-5xl xl:max-w-6xl max-h-[95vh] overflow-y-auto p-0 gap-0 border-2 border-yellow-400 rounded-2xl shadow-[0_0_30px_rgba(255,180,0,0.3)] animate-pulse-slow no-scrollbar">
        <DialogHeader className="sr-only">
          <DialogTitle>App Launch Offer</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all hover:scale-110"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="bg-primary text-white text-center py-2 font-semibold tracking-wide text-sm md:text-base">
            App Launch Offer – Enroll Now & Save 99%!
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7 p-5 md:p-7">
            {/* Left side */}
            <div className="space-y-4 md:space-y-5">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                <Sparkles className="text-yellow-500 w-6 h-6" /> {course.title}
              </h2>

              <p
                style={{ whiteSpace: "pre-line" }}
                className="hidden lg:block text-sm md:text-base text-gray-700 leading-relaxed"
              >
                {course.description}
              </p>

              <div className="hidden lg:block bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-5 space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                  What you&apos;ll get:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {[
                    `Valid for ${course.durationValue} ${course.durationUnit}`,
                    "Mobile access",
                    "Expert support",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                      <span className="text-sm md:text-base text-gray-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="space-y-4 md:space-y-5">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <div className="relative aspect-video group">
                  {course.thumbnails.map((thumbnail, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                        index === currentSlide
                          ? "translate-x-0 opacity-100"
                          : "translate-x-full opacity-0"
                      }`}
                    >
                      <Image
                        width={400}
                        height={200}
                        src={thumbnail}
                        alt={`${course.title} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {course.thumbnails.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md hover:scale-110 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md hover:scale-110 transition-all"
                      >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
                      </button>
                    </>
                  )}
                </div>

                <div className="p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex gap-2 items-baseline">
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">
                        {formatPrice(course.price)}
                      </span>
                      <span className="text-lg md:text-xl line-through text-gray-500">
                        {formatPrice(course.mrp)}
                      </span>
                    </div>
                    <div className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold">
                      Save{" "}
                      {Math.round(
                        ((course.mrp - course.price) / course.mrp) * 100
                      )}
                      %
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary-foreground text-white hover:text-black font-semibold shadow-lg text-sm md:text-base h-10 md:h-12"
                    onClick={handleEnroll}
                  >
                    <PlayCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Enroll Now – App Launch Offer 🎉
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-sm md:text-base h-10 md:h-11 border-2 hover:bg-yellow-50"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Share with Friends
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiwaliOfferPopup;
