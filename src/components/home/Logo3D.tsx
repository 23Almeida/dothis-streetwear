"use client";

import Image from "next/image";

export default function Logo3D() {
  return (
    <div className="flex items-center justify-center" style={{ perspective: "800px" }}>
      <div className="logo-spin">
        <Image
          src="/Logo.png"
          alt="DOTHIS"
          width={220}
          height={80}
          className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          priority
        />
      </div>
    </div>
  );
}
