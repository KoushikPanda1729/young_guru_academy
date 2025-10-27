import { Button } from "@t2p-admin/ui/components/button";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Button asChild variant={"ghost"} size={"lg"} className="p-6">
      <Link href={`${process.env.NEXT_PUBLIC_WEBSITE_URL!}`}>
        <h1 className="text-2xl font-bold whitespace-nowrap">
          <span className="text-gray-800 dark:text-white">Talk</span>
          <span className="text-primary">2</span>
          <span className="text-gray-800 dark:text-white">Partners</span>
        </h1>
      </Link>
    </Button>
  );
}
