import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "sale" | "new" | "sold-out" | "limited";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-white",
    sale: "bg-red-600 text-white",
    new: "bg-white text-black",
    "sold-out": "bg-neutral-700 text-neutral-400",
    limited: "bg-amber-500 text-black",
  };

  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-widest",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
