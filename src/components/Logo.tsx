export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
        <path d="M2 27 13 8l5 8 3-5 9 16Z" fill="currentColor" />
        <path d="m13 8 2.6 4.2-2.6-1-2.4 1.6Z" fill="#0b0d0c" opacity=".45" />
      </svg>
      <span className="text-[15px] font-semibold tracking-[0.32em]">ALTUS</span>
    </span>
  )
}
