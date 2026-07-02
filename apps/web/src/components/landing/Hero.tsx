export function Hero() {
  return (
    <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-16 md:py-24 lg:py-32 text-center">
      <div className="inline-flex items-center rounded-full border border-border/40 bg-surface px-3 py-1 text-sm font-medium shadow-sm">
        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
        Real-time collaborative code editor
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-7xl leading-tight text-foreground">
        Code Together.
        <br />
        <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          In Real Time.
        </span>
      </h1>
      <p className="max-w-[700px] text-lg text-muted-foreground mt-4">
        Create a room, share the link, and start coding with anyone instantly.{" "}
        <br className="hidden sm:inline" />
        No sign up required.
      </p>
    </section>
  );
}
