export default function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p data-reveal className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-mist/60">
      <span className="tabular-nums text-ember">{index}</span>
      <span className="h-px w-8 bg-mist/30" />
      {children}
    </p>
  )
}
