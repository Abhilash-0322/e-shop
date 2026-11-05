export default function Loading() {
  return (
    <div className="shell py-16" aria-label="Loading Halozon" role="status">
      <div className="h-3 w-28 rounded bg-indigo-100 animate-pulse" />
      <div className="h-12 w-2/3 max-w-xl rounded bg-slate-200 mt-4 animate-pulse" />
      <div className="h-4 w-full max-w-lg rounded bg-slate-100 mt-4 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        {[1, 2, 3, 4].map((item) => <div className="discovery-skeleton h-64" key={item} />)}
      </div>
      <span className="sr-only">Loading content…</span>
    </div>
  );
}
