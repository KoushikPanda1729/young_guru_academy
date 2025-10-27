import { ReactNode } from "react";

export default function PhoneMockup({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 mx-auto border-card bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
      {/* Side buttons */}
      <div className="h-[32px] w-[3px] bg-card absolute -start-[17px] top-[72px] rounded-s-lg" />
      <div className="h-[46px] w-[3px] bg-card absolute -start-[17px] top-[124px] rounded-s-lg" />
      <div className="h-[46px] w-[3px] bg-card absolute -start-[17px] top-[178px] rounded-s-lg" />
      <div className="h-[64px] w-[3px] bg-card absolute -end-[17px] top-[142px] rounded-e-lg" />

      {/* Screen area */}
      <div className="relative rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-muted-foreground">
        {children}
      </div>
    </div>
  );
}
