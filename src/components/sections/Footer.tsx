export function Footer() {
  return (
    <footer className="border-t border-surface-2 px-(--spacing-gutter) py-14">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <p className="font-(family-name:--font-display) text-2xl tracking-tight">
            StepPal
          </p>
          <p className="mt-2 max-w-[30ch] text-sm text-ink-soft">
            Put money on your step goal. Open source, built on Stellar.
          </p>
        </div>

        <nav className="flex gap-14 text-sm" aria-label="Footer">
          <div className="flex flex-col gap-3">
            <span className="t-label">Project</span>
            <a href="https://github.com/steppal" className="text-ink-soft hover:text-ink">
              GitHub
            </a>
            <a href="#contribute" className="text-ink-soft hover:text-ink">
              Contribute
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="t-label">Legal</span>
            <a href="/privacy" className="text-ink-soft hover:text-ink">
              Privacy
            </a>
            <a href="/terms" className="text-ink-soft hover:text-ink">
              Terms
            </a>
          </div>
        </nav>
      </div>

      <p className="mt-14 font-(family-name:--font-mono) text-xs text-ink-faint">
        Apache-2.0 · Not yet available. Nothing here is financial advice.
      </p>
    </footer>
  );
}
