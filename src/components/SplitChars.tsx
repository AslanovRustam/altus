/** Renders text as words → chars spans (aria-hidden; give the parent an aria-label). */
export default function SplitChars({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi}>
          <span className="inline-block whitespace-nowrap">
            {[...word].map((ch, ci) => (
              <span key={ci} data-char className="inline-block will-change-transform">
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 && ' '}
        </span>
      ))}
    </>
  )
}
