export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40 mt-auto">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 text-muted-foreground text-sm">
        <p className="text-center md:text-left">
          CodeSync. Real-time collaborative coding without the setup.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground transition-colors">
            Documentation
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
