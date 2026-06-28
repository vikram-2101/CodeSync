export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="max-w-xl p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-3xl font-bold mb-4">CodeSync AI</h1>
        <p className="text-slate-300">
          Real-time collaborative editor scaffold. Start the frontend with{" "}
          <code className="rounded bg-slate-800 px-2 py-1">
            pnpm --filter codesync-frontend dev
          </code>
          .
        </p>
      </div>
    </div>
  );
}
