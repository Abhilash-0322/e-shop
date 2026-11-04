import Link from 'next/link';

export default function PrimePage() {
  return (
    <div className="min-h-[80vh]">
      <div className="bg-hz-gradient text-white py-20 rounded-b-[3rem]">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <div className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-semibold mb-4">Membership</div>
          <div className="text-5xl md:text-6xl font-extrabold mb-4">Halozon Plus</div>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Fast delivery, member-only deals, streaming perks, and more — wrapped in one colorful membership.
          </p>
          <Link href="/register" className="amazon-btn-yellow inline-block mt-8 !text-base !px-8 !py-3 shadow-lg">
            Start your free trial
          </Link>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { t: 'Fast delivery', d: 'Free expedited shipping on eligible items — track every step in your account.' },
          { t: 'Plus Video', d: 'Stream movies and series, including Halozon originals and indie gems.' },
          { t: 'Plus Music', d: 'Ad-free listening with curated playlists and offline downloads.' },
        ].map((f) => (
          <div key={f.t} className="panel p-6 hover:shadow-cardHover transition-shadow">
            <h3 className="text-xl font-bold mb-2 text-slate-900">{f.t}</h3>
            <p className="text-sm text-amazon-textMuted">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
