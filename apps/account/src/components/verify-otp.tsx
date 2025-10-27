"use client"

import React from "react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@t2p-admin/ui/components/form"
import { Input } from "@t2p-admin/ui/components/input"
import { Button } from "@t2p-admin/ui/components/button"
import { AuthCard } from "./auth-card"
import { useAuth } from "@/providers/auth-provider"

export default function VerifyOtpForm() {
  const {
    phoneVerifyForm,
    loading,
    phoneVerifyHandler,
    resendOtpHandler,
    resendTimer,
    canResend,
  } = useAuth()

  return (
    <AuthCard
      title="Verify OTP"
      description="Enter the code sent to your phone"
      cardFooterLink="/auth/login"
    >
      <Form {...phoneVerifyForm}>
        <form
          onSubmit={phoneVerifyForm.handleSubmit(phoneVerifyHandler)}
          className="space-y-4"
        >
          <FormField
            control={phoneVerifyForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP Code</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter the 6-digit code"
                    maxLength={6}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-left">
                  Check your messages for the verification code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-primary cursor-pointer">
            Verify OTP
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={resendOtpHandler}
              disabled={!canResend || loading}
              className="text-primary hover:underline font-medium"
            >
              {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
            </button>
          </div>
        </form>
      </Form>
    </AuthCard>
  )
}
