"use client";

interface TonLogoProps {
  className?: string;
  size?: number;
}

export default function TonLogo({ className = "", size = 64 }: TonLogoProps) {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1774296137/image-removebg-preview_64_kzynu3.png"
        alt="TON Logo"
        className="w-full h-full object-contain drop-shadow-sm"
      />
      {/* Subtle outer glow for premium feel */}
      <div className="absolute inset-0 bg-black/5 blur-2xl rounded-full -z-10" />
    </div>
  );
}
