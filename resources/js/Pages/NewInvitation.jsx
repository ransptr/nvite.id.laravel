import {useNavigate} from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import {Link} from 'react-router-dom';
import {TEMPLATES} from '@/lib/templates';

const TEMPLATE_META = {
  lumiere: {
    tagline: 'Dark, cinematic & romantic',
    previewBg: 'linear-gradient(160deg, #050505 0%, #111111 60%, #1a1410 100%)',
    palette: ['#050505', '#111111', '#d8b181', '#e7e1db'],
  },
  bloom: {
    tagline: 'Fresh, floral & airy',
    previewBg: 'linear-gradient(160deg, #fdf6ee 0%, #f5e6d8 50%, #f0d8c0 100%)',
    palette: ['#fdf6ee', '#f5e6d8', '#d4896a', '#fff8f3'],
  },
  sage: {
    tagline: 'Earthy, botanical & calm',
    previewBg: 'linear-gradient(160deg, #f4f7f0 0%, #dfebd5 50%, #c8d9bf 100%)',
    palette: ['#f4f7f0', '#dfebd5', '#6b8c5e', '#f0f4ec'],
  },
  onyx: {
    tagline: 'Minimal, modern & bold',
    previewBg: 'linear-gradient(160deg, #0a0a0a 0%, #141414 50%, #1a1a1a 100%)',
    palette: ['#0a0a0a', '#141414', '#e0e0e0', '#f5f5f5'],
  },
};

export function NewInvitationPage() {
  const navigate = useNavigate();

  const handleSelect = (slug) => {
    navigate(`/create?template=${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <header className="border-b border-[#e8ddd4] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-[#8a7a6e] hover:text-[#1a1612]"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <span className="text-[#e8ddd4]">/</span>
          <span className="text-sm font-medium text-[#1a1612]">Choose a template</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl italic text-[#1a1612]">Pick your design</h1>
          <p className="mt-2 text-sm text-[#8a7a6e]">
            Each template has a unique look and feel. You can customise all content after selecting.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => {
            const meta = TEMPLATE_META[t.slug] ?? TEMPLATE_META.lumiere;
            const joinedName = t.content?.couple?.joinedName ?? t.name;
            const dateLabel = t.content?.couple?.dateLabel ?? '';
            const coverImage = t.content?.media?.coverImage;
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => handleSelect(t.slug)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#e8ddd4] bg-white text-left shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
              >
                <div
                  className="relative h-52 w-full overflow-hidden"
                  style={{background: meta.previewBg}}
                >
                  {coverImage && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-20"
                      style={{backgroundImage: `url(${coverImage})`}}
                    />
                  )}
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {meta.palette.map((c) => (
                      <span
                        key={c}
                        className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                        style={{background: c}}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center" style={{color: meta.palette[2]}}>
                      <p className="text-[8px] uppercase tracking-[0.35em] opacity-70">The Wedding of</p>
                      <p className="font-display text-2xl italic leading-tight">{joinedName}</p>
                      <p className="mt-1 text-[8px] uppercase tracking-[0.22em] opacity-70">{dateLabel}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/10 group-hover:opacity-100">
                    <span className="rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1a1612] shadow">
                      Use this →
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-1 p-4">
                  <p className="text-sm font-semibold text-[#1a1612]">{t.name}</p>
                  <p className="text-xs text-[#8a7a6e]">{meta.tagline}</p>
                </div>

                <div className="border-t border-[#f0ebe4] px-4 py-2.5">
                  <a
                    href={`/templates/${t.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] uppercase tracking-[0.28em] text-[#c9974a] hover:underline"
                  >
                    Preview template →
                  </a>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
