export default function Loading() {
  return (
    <div className="shell py-12" aria-label="Loading" role="status">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton mt-4 h-12 max-w-xl" />
      <div className="skeleton mt-3 h-5 max-w-md" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="surface p-3" key={index}>
            <div className="skeleton aspect-square w-full" />
            <div className="skeleton mt-4 h-4 w-4/5" />
            <div className="skeleton mt-2 h-3 w-2/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

