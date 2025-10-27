"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, phoneVerifyFormSchema } from "@/lib/zod";
import { phoneNumber, signIn, signOut } from '@/features/auth/core/auth';
import { z } from "zod";

const RESEND_DELAY = 60;

interface AuthContextType {
  loginForm: ReturnType<typeof useForm<z.infer<typeof LoginFormSchema>>>;
  phoneVerifyForm: ReturnType<typeof useForm<z.infer<typeof phoneVerifyFormSchema>>>;
  phoneLoginHandler: (values: z.infer<typeof LoginFormSchema>) => Promise<void>;
  phoneVerifyHandler: (values: z.infer<typeof phoneVerifyFormSchema>) => Promise<void>;
  resendOtpHandler: () => Promise<void>;
  socialSignInHandler: (provider: "google") => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string;
  success: string;
  resendTimer: number;
  canResend: boolean;
}



const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ 
  children,
}: { 
  children: ReactNode
}) => {
  const router = useRouter();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);
  const [startResendTimer, setStartResendTimer] = useState(false);

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    mode: "onBlur",
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const phoneVerifyForm = useForm<z.infer<typeof phoneVerifyFormSchema>>({
    mode: "onBlur",
    resolver: zodResolver(phoneVerifyFormSchema),
    defaultValues: {
      phoneNumber: "",
      code: "",
    },
  });

  useEffect(() => {
    const storedPhone = localStorage.getItem("phoneNumber");
    if (storedPhone) {
      phoneVerifyForm.setValue("phoneNumber", storedPhone);
    }
  }, [phoneVerifyForm]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startResendTimer && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    if (resendTimer === 0) setStartResendTimer(false);
    return () => clearInterval(timer);
  }, [startResendTimer, resendTimer]);

  async function phoneLoginHandler(values: z.infer<typeof LoginFormSchema>) {
    try {
      await phoneNumber.sendOtp(
        { phoneNumber: values.phoneNumber },
        {
          onRequest: () => {
            setLoading(true);
            setError("");
            setSuccess("");
          },
          onResponse: () => setLoading(false),
          onSuccess: () => {
            setSuccess("Your OTP has been sent successfully");
            localStorage.setItem("phoneNumber", values.phoneNumber);
            phoneVerifyForm.setValue("phoneNumber", values.phoneNumber);
            setResendTimer(RESEND_DELAY);
            setStartResendTimer(true);
            router.replace("/auth/verify-otp");
          },
          onError: (ctx) => setError(ctx.error.message),
        }
      );
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function phoneVerifyHandler(values: z.infer<typeof phoneVerifyFormSchema>) {
    try {
      await phoneNumber.verify(
        {
          phoneNumber: values.phoneNumber,
          code: values.code,
        },
        {
          onRequest: () => {
            setLoading(true);
            setError("");
            setSuccess("");
          },
          onResponse: () => setLoading(false),
          onSuccess: () => {
            setSuccess("Phone number verified successfully.");
            localStorage.removeItem("phoneNumber");
            router.replace("/dashboard/overview");
          },
          onError: (ctx) => setError(ctx.error.message),
        }
      );
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function resendOtpHandler() {
    const phone = phoneVerifyForm.getValues("phoneNumber");
    if (!phone) {
      setError("Phone number missing. Please go back and login again.");
      return;
    }

    try {
      await phoneNumber.sendOtp(
        { phoneNumber: phone },
        {
          onRequest: () => {
            setLoading(true);
            setError("");
            setSuccess("");
          },
          onResponse: () => setLoading(false),
          onSuccess: () => {
            setSuccess("OTP resent successfully.");
            setResendTimer(RESEND_DELAY);
            setStartResendTimer(true);
          },
          onError: (ctx) => setError(ctx.error.message),
        }
      );
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function logout() {
    try {
      await signOut()
      router.push("/auth/login")
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function socialSignInHandler(provider: "google") {
    try {
      await signIn.social(
        {
          provider,
          callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard/overview`,
        },
        {
          onRequest: () => {
            setLoading(true);
            setError("");
            setSuccess("");
          },
          onResponse: () => setLoading(false),
          onSuccess: () => setSuccess("You have logged in successfully."),
          onError: (ctx) => setError(ctx.error.message),
        }
      );
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        loginForm,
        phoneVerifyForm,
        phoneLoginHandler,
        phoneVerifyHandler,
        resendOtpHandler,
        socialSignInHandler,
        logout,
        loading,
        error,
        success,
        resendTimer,
        canResend: !startResendTimer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

