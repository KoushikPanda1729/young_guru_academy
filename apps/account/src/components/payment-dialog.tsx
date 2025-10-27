"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@t2p-admin/ui/components/button";
import { Input } from "@t2p-admin/ui/components/input";
import { Badge } from "@t2p-admin/ui/components/badge";
import { Separator } from "@t2p-admin/ui/components/separator";
import { v4 as uuidv4 } from "uuid";
import {
  Award,
  PlayCircle,
  X,
  CreditCard,
  Shield,
  Clock,
  Users,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ApplyCouponType, CourseDetails, CreateOrderInput } from "../lib/zod";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useSession } from "../lib/auth";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

interface PaymentDialogProps {
  course: CourseDetails;
  signedUrl?: string;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  course,
  signedUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session } = useSession();
  const { error, isLoading, Razorpay } = useRazorpay();
  const router = useRouter();

  const mrp = course.mrp ?? course.price ?? 0;
  const basePrice = course.price || mrp;
  const courseDiscountAmount = mrp > basePrice ? mrp - basePrice : 0;

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      couponDiscountAmount = (basePrice * appliedCoupon.discountValue) / 100;
    } else {
      couponDiscountAmount = appliedCoupon.discountValue;
    }
  }

  const priceAfterDiscount = basePrice - couponDiscountAmount;
  const gstAmount = Math.round(priceAfterDiscount * 0.18);
  const internetHandlingFees = Math.round((priceAfterDiscount * 2) / 100);
  const totalAmount = priceAfterDiscount + gstAmount + internetHandlingFees;

  // --- Apply coupon API ---
  const applyCoupon = async () => {
    if (!couponCode.trim() || !session) return;

    const payload: ApplyCouponType = {
      couponCode: couponCode.trim(),
      orderAmount: basePrice,
      courseId: course.id,
    };

    try {
      const { data } = await api.coupon.applyCoupon(payload);

      if (!data) return;

      if (data.isValid) {
        setAppliedCoupon({
          code: data.coupon!.code,
          discountType: data.coupon!.discountType,
          discountValue: data.coupon!.discountValue,
        });
        toast.success(
          `Coupon applied! ${
            data.coupon!.discountType === "PERCENTAGE"
              ? `${data.coupon!.discountValue}%`
              : `₹${data.coupon!.discountValue}`
          } off`
        );
        setCouponCode("");
      } else {
        toast.error(data.error || "Invalid coupon");
      }
    } catch (err) {
      toast.error("Failed to apply coupon");
      console.error(err);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  // --- Create order API + Razorpay ---
  const handlePayment = async () => {
    if (!session || !Razorpay) return;
    setIsProcessing(true);

    const orderPayload: CreateOrderInput = {
      amount: totalAmount,
      currency: "INR",
      customer: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phoneNumber ?? undefined,
      },
      items: [
        {
          price: basePrice,
          courseId: course.id,
          courseName: course.title,
          coursePrice: basePrice,
          originalPrice: course.mrp ?? basePrice,
          finalPrice: totalAmount,
          durationUnit: course.durationUnit,
          durationValue: course.durationValue ?? undefined,
        },
      ],
      couponCode: appliedCoupon?.code ?? undefined,
      notes: {
        courseId: course.id,
        courseName: course.title,
      },
      idempotencyKey: uuidv4(),
      userAgent: navigator.userAgent,
    };

    try {
      const { data: order } = await api.order.createOrder(orderPayload);

      if (!order) return;

      const options: RazorpayOrderOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
        amount: totalAmount,
        currency: "INR",
        name: "Talk2Partners",
        description: course.title,
        order_id: order.razorpay_order_id,
        handler: async function (response) {
          try {
            setIsProcessing(true);

            await api.payment.verify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              gatewayResponse: response,
            });

            toast.success("Payment verified and successful 🎉 Redirecting...");
            setTimeout(() => {
              router.push(`/dashboard/my-courses/${course.id}`);
            }, 1500);
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
            console.error(err);
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
        theme: { color: "#3b82f6" },
        prefill: {
          name: session.user.name,
          email: session.user.email,
          contact: session.user.phoneNumber ?? undefined,
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment failed, try again");
      console.error(err);
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <>
      <Button
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4"
        onClick={() => setIsOpen(true)}
      >
        <Award className="w-5 h-5 mr-2" /> Enroll Now
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-5xl w-full bg-white rounded-xl shadow-xl overflow-hidden grid md:grid-cols-2">
            {/* Left side */}
            <div className="relative bg-gray-50">
              <div className="aspect-video w-full relative">
                {signedUrl ? (
                  <Image
                    src={signedUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white/80" />
                  </div>
                )}
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-purple-600 text-white">COURSE</Badge>
              </div>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {course.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {course.totalStudents && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {course.totalStudents}{" "}
                      students
                    </div>
                  )}
                  {course.durationValue && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {course.durationValue}{" "}
                      {course.durationUnit}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="p-6 bg-white flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Payment Summary
                </h3>

                <div className="space-y-2 text-sm mt-4">
                  <div className="flex justify-between">
                    <span>MRP</span>
                    <span className="line-through text-gray-500">
                      {formatPrice(mrp)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Course Price</span>
                    <span>{formatPrice(basePrice)}</span>
                  </div>
                  {courseDiscountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Course Discount</span>
                      <span>-{formatPrice(courseDiscountAmount)}</span>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>{appliedCoupon.code} Applied</span>
                      <span>-{formatPrice(couponDiscountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(priceAfterDiscount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>{formatPrice(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee</span>
                    <span>{formatPrice(internetHandlingFees)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Enter coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  {appliedCoupon ? (
                    <Button variant="outline" onClick={removeCoupon}>
                      Remove
                    </Button>
                  ) : (
                    <Button onClick={applyCoupon} disabled={!couponCode.trim()}>
                      Apply
                    </Button>
                  )}
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded mt-3">
                    Error loading Razorpay: {error}
                  </div>
                )}
                {isLoading && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded mt-3">
                    Loading Razorpay...
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || isLoading || !Razorpay || !!error}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 font-semibold flex items-center justify-center"
                >
                  {isProcessing || isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  {isProcessing
                    ? "Processing..."
                    : isLoading
                      ? "Loading..."
                      : "Pay with Razorpay"}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
                  <Shield className="w-4 h-4 text-green-600" /> Secure payment
                  powered by Razorpay
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
