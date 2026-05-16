import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Heart } from 'lucide-react';
export function InvitationExportPdfPage() {
  const [searchParams] = useSearchParams();
  const draftKey = searchParams.get('draftKey') ?? '';
  const [invitation, setInvitation] = useState(null);

  useEffect(() => {
    if (!draftKey) return;
    const raw = sessionStorage.getItem(draftKey);
    if (!raw) return;
    try {
      setInvitation(JSON.parse(raw));
    } catch {
      setInvitation(null);
    }
  }, [draftKey]);

  useEffect(() => {
    if (invitation) {
      const timer = setTimeout(() => {
        window.print();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [invitation]);

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9974a] border-t-transparent" />
      </div>
    );
  }

  const theme = invitation.theme;

  return (
    <div className="min-h-screen p-12 flex items-center justify-center bg-neutral-100 print:p-0 print:bg-white">
      <div
        className="w-[210mm] h-[297mm] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center p-20 print:shadow-none print:w-screen print:h-screen"
        style={{
          backgroundColor: theme.background,
          color: theme.accent,
          fontFamily: "'Outfit', sans-serif"
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="absolute inset-10 border border-current opacity-20" />
        <div className="absolute inset-12 border border-current opacity-10" />

        <div className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-current" />
        <div className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-current" />
        <div className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-current" />
        <div className="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-current" />

        <div className="space-y-16 z-10 max-w-2xl">
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.6em] opacity-70">
              {invitation.couple.coverLabel || 'THE WEDDING OF'}
            </p>
            <div className="h-[1px] w-12 bg-current mx-auto opacity-30" />
          </div>

          <h1
            className="text-8xl leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            {invitation.couple.joinedName}
          </h1>

          <div className="flex items-center justify-center gap-6">
            <div className="h-[1px] flex-1 bg-current opacity-20" />
            <Heart className="h-6 w-6 fill-current opacity-40" />
            <div className="h-[1px] flex-1 bg-current opacity-20" />
          </div>

          <div className="space-y-10">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Save the Date</p>
              <div className="flex items-center justify-center gap-4 text-3xl font-light tracking-tight">
                <Calendar className="h-7 w-7 opacity-70" />
                <span>{invitation.couple.dateLabel}</span>
              </div>
            </div>

            {invitation.events.details[0] && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Location</p>
                <div className="flex items-center justify-center gap-3 text-xl font-medium opacity-90 max-w-md mx-auto leading-relaxed">
                  <MapPin className="h-5 w-5 shrink-0 opacity-70" />
                  <span>{invitation.events.details[0].location}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 max-w-lg mx-auto">
            <p className="text-lg italic font-light leading-relaxed opacity-70" style={{ fontFamily: "'Playfair Display', serif" }}>
              "{invitation.couple.quote || 'Two are better than one...'}"
            </p>
          </div>

          <div className="absolute bottom-20 left-0 right-0">
            <div className="flex flex-col items-center gap-2">
              <div className="h-px w-24 bg-current opacity-10" />
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-40">
                nvite.id/{invitation.slug}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        @media print {
          body { margin: 0; padding: 0; background: white; }
          @page { size: A4; margin: 0; }
          .no-print { display: none; }
        }
      ` }} />
    </div>
  );
}
