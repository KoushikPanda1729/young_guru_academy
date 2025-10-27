import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href={"/"}>
      <Image
        src="https://yt3.googleusercontent.com/XgCAEu0Ar62WrwLCvpd9QDF26kyru58_PwmkL7ANdquIqnKRbdj8KQL3GOY97ZvrIQGcbw19=s160-c-k-c0x00ffffff-no-rj"
        alt="Talk2Partners Logo"
        width={50}
        height={50}
        className="object-contain rounded-full"
      />
    </Link>
  );
}
