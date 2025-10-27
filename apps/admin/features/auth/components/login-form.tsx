"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@t2p-admin/ui/components/form";
import { Button } from "@t2p-admin/ui/components/button";
import { AuthCard } from "./auth-card";
import { PhoneInput } from "./phone-input";
import { useAuth } from "../provider/auth-provider";
import GoogleButton from "./google-button";

export default function LoginForm() {
  const { loginForm, loading, phoneLoginHandler } = useAuth();

  return (
    <AuthCard
      title="Welcome Back!"
      description="Enter your email below to login"
      cardFooterLink="/auth/signup"
    >
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(phoneLoginHandler)}
          className="space-y-4"
        >
          <FormField
            control={loginForm.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry="IN"
                    className="space-x-1"
                    placeholder="Enter a phone number"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-left">
                  Enter a phone number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-primary"
          >
            SendOTP
          </Button>
          <div className="flex gap-x-4 items-center justify-center w-full">
            <div className="bg-gray-800 w-1/2 h-[1px] rounded-full" />
            <span className="text-xs font-semibold">OR</span>
            <div className="bg-gray-800 w-1/2 h-[1px] rounded-full" />
          </div>
          <div className="space-y-2">
            <GoogleButton />
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
