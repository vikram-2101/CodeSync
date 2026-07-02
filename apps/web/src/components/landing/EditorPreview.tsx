export function EditorPreview() {
  return (
    <div className="mx-auto max-w-5xl mt-24 px-4 w-full opacity-80 pointer-events-none select-none relative -bottom-10">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/20 blur-[100px] -z-10 rounded-full"></div>

      <div className="rounded-t-2xl border-t border-l border-r border-border/50 bg-[#1e1e1e]/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[400px]">
        {/* Editor Header */}
        <div className="h-10 bg-[#252526]/90 border-b border-[#333] flex items-center px-4 justify-between">
          <div className="flex gap-2">
            <div className="size-3 rounded-full bg-destructive/80"></div>
            <div className="size-3 rounded-full bg-warning/80"></div>
            <div className="size-3 rounded-full bg-success/80"></div>
          </div>
          <div className="flex text-xs text-[#858585] gap-4">
            <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md">
              <div className="size-2 rounded-full bg-success"></div>
              <span>3 online</span>
            </div>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-64 bg-[#252526]/80 border-r border-[#333] p-4 hidden md:block">
            <div className="text-xs font-semibold text-[#858585] mb-4 tracking-wider">
              EXPLORER
            </div>
            <div className="space-y-3 text-sm text-[#ccc]">
              <div className="flex items-center gap-2 bg-[#37373d]/50 px-2 py-1 -mx-2 rounded-sm text-white">
                <span className="text-[#dcb67a]">JS</span> App.js
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#519aba]">#</span> styles.css
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#4b8db4]">M↓</span> README.md
              </div>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 bg-[#1e1e1e]/90 p-4 font-mono text-sm leading-loose overflow-hidden relative">
            <div className="text-[#569cd6]">
              export default function{" "}
              <span className="text-[#dcdcaa]">App</span>() {"{"}
            </div>
            <div className="pl-6 text-[#c586c0]">
              return <span className="text-[#d4d4d4]">(</span>
            </div>
            <div className="pl-12 text-[#808080]">
              &lt;<span className="text-[#569cd6]">div</span>{" "}
              <span className="text-[#9cdcfe]">className</span>=
              <span className="text-[#ce9178]">"app"</span>&gt;
            </div>
            <div className="pl-16 text-[#808080]">
              &lt;<span className="text-[#569cd6]">h1</span>&gt;
              <span className="text-[#d4d4d4]">CodeSync</span>&lt;/
              <span className="text-[#569cd6]">h1</span>&gt;
            </div>
            <div className="pl-16 text-[#808080]">
              &lt;<span className="text-[#569cd6]">p</span>&gt;
              <span className="text-[#d4d4d4]">
                Real-time collaborative coding
              </span>
              &lt;/<span className="text-[#569cd6]">p</span>&gt;
            </div>

            {/* Fake cursor 1 */}
            <div className="absolute top-[165px] left-[380px] flex flex-col pointer-events-none">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-purple-500 fill-purple-500 -ml-1"
              >
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" />
              </svg>
              <div className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap ml-2">
                Priya
              </div>
            </div>

            {/* Fake cursor 2 */}
            <div className="absolute top-[220px] left-[280px] flex flex-col pointer-events-none">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-500 fill-blue-500 -ml-1"
              >
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" />
              </svg>
              <div className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap ml-2">
                Rohit
              </div>
            </div>

            <div className="pl-12 text-[#808080]">
              &lt;/<span className="text-[#569cd6]">div</span>&gt;
            </div>
            <div className="pl-6 text-[#d4d4d4]">)</div>
            <div className="text-[#d4d4d4]">{"}"}</div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center text-xs text-[#858585] gap-2 items-center">
              <span>Built for developers. Designed for collaboration.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
