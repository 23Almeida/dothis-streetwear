"use client";

import Image from "next/image";

export default function Logo3D() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/Logo.png"
        alt="DOTHIS"
        width={280}
        height={96}
        className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-all duration-700 hover:drop-shadow-[0_0_60px_rgba(255,255,255,0.25)]"
        priority
      />
    </div>
  );
}
