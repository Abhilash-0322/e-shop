export default function PageSkeleton({rows = 8}: {rows?: number}) {
  return (
    <div className="shell py-12" aria-busy="true" aria-label="Loading page">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton mt-4 h-12 w-2/3 max-w-lg" />
      <div className="skeleton mt-3 h-4 w-full max-w-xl" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({length: rows}, (_, index) => (
          <div className="surface p-3" key={index}>
            <div className="skeleton aspect-square w-full" />
            <div className="skeleton mt-4 h-3 w-1/3" />
            <div className="skeleton mt-3 h-4 w-5/6" />
            <div className="skeleton mt-2 h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
