import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href={"/"}>
      <h1 className="text-2xl font-bold whitespace-nowrap">
        <span className="text-gray-800 dark:text-white">Talk</span>
        <span className="text-primary">2</span>
        <span className="text-gray-800 dark:text-white">Partners&trade;</span>
      </h1>
    </Link>
  );
}
