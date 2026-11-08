import { cn } from "@/lib/utils";

/** Plain card wrapper (hover tilt removed: moved too much for a hover). */
export default function TiltCard({ children, className }: { children: React.ReactNode; className?: string; max?: number }) {
  return <div className={cn("relative h-full", className)}>{children}</div>;
}
