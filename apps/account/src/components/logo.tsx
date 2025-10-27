import { Button } from "@t2p-admin/ui/components/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <Button asChild variant={"ghost"} size={"lg"} className="p-6">
      <Link href={`${process.env.NEXT_PUBLIC_WEBSITE_URL!}`}>
        <Image
          src="https://yt3.googleusercontent.com/XgCAEu0Ar62WrwLCvpd9QDF26kyru58_PwmkL7ANdquIqnKRbdj8KQL3GOY97ZvrIQGcbw19=s160-c-k-c0x00ffffff-no-rj"
          alt="Talk2Partners Logo"
          width={50}
          height={50}
          className="object-contain rounded-full"
        />
      </Link>
    </Button>
  );
}
