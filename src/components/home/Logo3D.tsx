"use client";

import Image from "next/image";

export default function Logo3D() {
  return (
    <div className="flex items-center justify-center" style={{ perspective: "800px" }}>
      <div
        style={{
          animation: "spin3d 4s linear infinite",
          transformStyle: "preserve-3d",
          display: "inline-block",
        }}
      >
        <Image
          src="/Logo.png"
          alt="DOTHIS"
          width={220}
          height={80}
          className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          priority
        />
      </div>

      <style jsx global>{`
        @keyframes spin3d {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
