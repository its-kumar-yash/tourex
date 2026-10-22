import Image from "next/image";
import { Mandala } from "@/components/ui/motifs";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[72vh] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-maroon lg:block">
        <Image src="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=70" alt="" fill sizes="50vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2b0d14]/90 to-transparent" />
        <Mandala className="absolute -right-16 -top-16 h-72 w-72 text-marigold/30" />
        <div className="absolute inset-x-10 bottom-10 text-white">
          <p className="font-display text-3xl text-marigold">अतिथि देवो भव</p>
          <p className="mt-2 max-w-sm text-white/85">Sign in to reserve trips, track your bookings and travel with us like family.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">{children}</div>
      </div>
    </div>
  );
}
