import {useEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {
  CalendarPlus,
  Check,
  Copy,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react';

import {RsvpSection} from '@/Components/invitation/RsvpSection';
import {Countdown} from '@/Components/shared/Countdown';
import {Modal} from '@/Components/shared/Modal';
import {buildCalendarDataUrl} from '@/lib/calendar';
import {resolveGuestName} from '@/lib/guest';

const ACCENT = '#e0e0e0';
const BG = '#0a0a0a';
const SURFACE = '#141414';
const SURFACE2 = '#1f1f1f';
const TEXT = '#f0f0f0';
const MUTED = '#666666';
const RSVP_THEME = {
  accent: ACCENT,
  background: BG,
  surface: SURFACE,
  text: TEXT,
  muted: MUTED,
};

function Rule() {
  return <div className="w-full" style={{height: '1px', background: SURFACE2}} />;
}

function CoverScreen({invitation, guestName, onOpen}) {
  return (
    <motion.div
      key="cover"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0, transition: {duration: 0.4}}}
      className="fixed inset-0 z-50 flex flex-col items-start justify-between overflow-hidden px-8 py-10 md:px-16 md:py-14"
      style={{background: BG}}
    >
      <motion.p
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.3, duration: 0.5}}
        className="text-[10px] uppercase tracking-[0.5em]"
        style={{color: MUTED}}
      >
        {invitation.couple.coverLabel}
      </motion.p>

      <motion.div
        initial={{opacity: 0, y: 40}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1]}}
        className="space-y-2"
      >
        <h1
          className="font-display leading-none tracking-tight"
          style={{
            color: TEXT,
            fontSize: 'clamp(3.5rem, 12vw, 10rem)',
            fontStyle: 'normal',
            letterSpacing: '-0.02em',
          }}
        >
          {invitation.couple.bride.nickname}
          <br />
          <span style={{color: MUTED}}>&</span>
          <br />
          {invitation.couple.groom.nickname}
        </h1>
      </motion.div>

      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.9, duration: 0.6}}
        className="flex w-full items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <p className="text-xs font-mono" style={{color: MUTED}}>{invitation.couple.dateLabel}</p>
          {guestName !== 'Guest Name' && (
            <p className="text-xs font-mono" style={{color: MUTED}}>For {guestName}</p>
          )}
        </div>
        <button
          onClick={onOpen}
          className="text-xs uppercase tracking-[0.35em] transition-colors hover:opacity-60"
          style={{color: ACCENT}}
        >
          Open →
        </button>
      </motion.div>
    </motion.div>
  );
}

function GiftModal({accounts, onClose}) {
  const [copied, setCopied] = useState(null);
  const copy = (id, number) => {
    navigator.clipboard.writeText(number).catch(() => undefined);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };
  return (
    <Modal open onClose={onClose}>
      <div className="space-y-4 p-6" style={{background: SURFACE, color: TEXT}}>
        <h3 className="font-display text-2xl" style={{color: TEXT}}>Gift</h3>
        <Rule />
        {accounts.map(acc => (
          <div key={acc.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{color: MUTED}}>{acc.bank}</p>
              <p className="font-mono text-base" style={{color: TEXT}}>{acc.number}</p>
              <p className="text-xs mt-0.5" style={{color: MUTED}}>{acc.holder}</p>
            </div>
            <button
              onClick={() => copy(acc.id, acc.number)}
              className="flex h-9 w-9 items-center justify-center transition-colors"
              style={{color: copied === acc.id ? ACCENT : MUTED}}
            >
              {copied === acc.id ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export function OnyxInvitationPage({invitation, isTemplatePreview = false}) {
  const audioRef = useRef(null);
  const [stage, setStage] = useState('cover');
  const [guestName, setGuestName] = useState('Guest Name');
  const [giftOpen, setGiftOpen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const calendarUrl = useMemo(() => buildCalendarDataUrl(invitation.countdown.calendar), [invitation.countdown.calendar]);

  useEffect(() => {
    resolveGuestName(window.location.search, invitation.guestQueryParam).then(setGuestName);
  }, [invitation.guestQueryParam]);

  useEffect(() => {
    document.title = invitation.seo.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', invitation.seo.description);

    const setMeta = (name, content, isProperty = false) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(isProperty ? 'property' : 'name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const ogImage = invitation.media.ogImage || invitation.media.coverImage || 'https://nvite.id/og-image-default.png';
    setMeta('og:image', ogImage, true);
    setMeta('og:title', invitation.seo.title, true);
    setMeta('og:description', invitation.seo.description, true);
    setMeta('og:url', `https://nvite.id/${invitation.slug ?? ''}`, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:image', ogImage);
  }, [invitation]);

  useEffect(() => {
    if (stage !== 'open' || !audioRef.current) return;
    if (isAudioEnabled) audioRef.current.play().catch(() => undefined);
    else audioRef.current.pause();
  }, [isAudioEnabled, stage]);

  const openInvitation = () => {
    setStage('open');
    if (audioRef.current && isAudioEnabled) audioRef.current.play().catch(() => undefined);
  };

  const easing = [0.22, 1, 0.36, 1];
  const cut = (delay = 0) => ({
    initial: {opacity: 0},
    whileInView: {opacity: 1},
    viewport: {once: true, margin: '-40px'},
    transition: {duration: 0.4, ease: 'linear', delay},
  });

  const slideIn = (delay = 0) => ({
    initial: {opacity: 0, x: -20},
    whileInView: {opacity: 1, x: 0},
    viewport: {once: true, margin: '-40px'},
    transition: {duration: 0.5, ease: easing, delay},
  });

  return (
    <div className="min-h-screen" style={{background: BG, color: TEXT}}>
      <audio ref={audioRef} src={invitation.media.audio || undefined} loop preload="none" />

      <AnimatePresence>
        {stage === 'cover' && (
          <CoverScreen invitation={invitation} guestName={guestName} onOpen={openInvitation} />
        )}
      </AnimatePresence>

      {stage === 'open' && (
        <>
          {/* Audio toggle */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setIsAudioEnabled(a => !a)}
              className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
              style={{color: MUTED}}
            >
              {isAudioEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
          </div>

          {isTemplatePreview && (
            <div className="fixed right-4 top-4 z-50 border px-3 py-1.5 text-[10px] uppercase tracking-widest font-mono" style={{borderColor: SURFACE2, color: MUTED, background: BG}}>
              Template Preview
            </div>
          )}

          {giftOpen && <GiftModal accounts={invitation.gift.accounts} onClose={() => setGiftOpen(false)} />}

          {/* ── HERO — TYPOGRAPHIC ── */}
          <section
            className="flex min-h-screen flex-col justify-between px-8 py-14 md:px-16"
            style={{background: BG}}
          >
            <motion.p {...cut()} className="text-[10px] uppercase tracking-[0.5em]" style={{color: MUTED}}>
              {invitation.couple.coverLabel}
            </motion.p>

            <motion.h1
              initial={{opacity: 0, y: 60}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1]}}
              className="font-display leading-none"
              style={{
                fontSize: 'clamp(4rem, 14vw, 12rem)',
                letterSpacing: '-0.025em',
                color: TEXT,
              }}
            >
              {invitation.couple.bride.nickname}
              <br />
              <span style={{color: SURFACE2}}>&amp;</span>
              <br />
              {invitation.couple.groom.nickname}
            </motion.h1>

            <motion.div {...cut(0.5)} className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="font-mono text-xs" style={{color: MUTED}}>{invitation.couple.dateLabel}</p>
                {guestName !== 'Guest Name' && (
                  <p className="font-mono text-xs" style={{color: MUTED}}>— {guestName}</p>
                )}
              </div>
              <div style={{width: '1px', height: '64px', background: SURFACE2}} />
            </motion.div>
          </section>

          <Rule />

          {/* ── SCRIPTURE ── */}
          <section className="px-8 py-24 md:px-16 md:py-32">
            <motion.div {...cut()} className="max-w-xl">
              <p className="mb-8 text-[10px] uppercase tracking-[0.5em]" style={{color: MUTED}}>Scripture</p>
              <p className="text-lg leading-relaxed md:text-xl" style={{color: ACCENT}}>
                &ldquo;{invitation.couple.scripture.text}&rdquo;
              </p>
              <p className="mt-5 text-xs font-mono" style={{color: MUTED}}>{invitation.couple.scripture.citation}</p>
            </motion.div>
          </section>

          <Rule />

          {/* ── COUPLE PROFILES ── */}
          <section className="px-8 py-20 md:px-16">
            <motion.p {...cut()} className="mb-12 text-[10px] uppercase tracking-[0.5em]" style={{color: MUTED}}>
              The Couple
            </motion.p>
            <div className="grid gap-12 md:grid-cols-2">
              {[invitation.couple.bride, invitation.couple.groom].map((person, i) => (
                <motion.div key={person.fullName} {...slideIn(i * 0.1)} className="flex gap-6">
                  <div className="h-20 w-20 shrink-0 overflow-hidden" style={{borderRadius: '4px'}}>
                    <img src={person.image} alt={person.fullName} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] mb-2" style={{color: MUTED}}>{person.title}</p>
                    <h3 className="font-display text-2xl mb-3" style={{color: TEXT, letterSpacing: '-0.02em'}}>{person.fullName}</h3>
                    <div className="space-y-0.5 text-xs" style={{color: MUTED}}>
                      {person.parents.map((p, j) => <p key={j}>{p}</p>)}
                    </div>
                    {person.instagram && (
                      <a href={person.instagram} target="_blank" rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider"
                        style={{color: MUTED}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> Instagram
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <Rule />

          {/* ── STORY — ALTERNATING PANELS ── */}
          {invitation.story.visible !== false && (
          <section>
            <div className="px-8 pt-20 pb-4 md:px-16">
              <motion.p {...cut()} className="text-[10px] uppercase tracking-[0.5em]" style={{color: MUTED}}>
                Our Story — {invitation.story.title}
              </motion.p>
            </div>
            {invitation.story.timeline.map((entry, i) => (
              <motion.div
                key={i}
                {...cut(i * 0.08)}
                className="grid gap-0 md:grid-cols-2"
                style={{background: i % 2 === 0 ? BG : SURFACE}}
              >
                {/* Image column — appears on right for even, left for odd on desktop */}
                <div
                  className={`relative h-72 overflow-hidden md:h-auto md:min-h-[400px] ${i % 2 !== 0 ? 'md:order-first' : 'md:order-last'}`}
                >
                  <img
                    src={invitation.media.storyImages[i] ?? invitation.media.heroPoster}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0" style={{background: `${BG}44`}} />
                </div>
                {/* Text column */}
                <div className="flex flex-col justify-center px-8 py-12 md:px-14 md:py-16">
                  <p className="font-display mb-2" style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    color: SURFACE2,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                  }}>
                    {entry.year}
                  </p>
                  <h3 className="text-lg font-semibold mb-5" style={{color: TEXT, letterSpacing: '-0.01em'}}>{entry.title}</h3>
                  <div className="space-y-4 text-sm leading-relaxed" style={{color: MUTED}}>
                    {entry.body.split('\n\n').slice(0, 2).map((para, j) => <p key={j}>{para}</p>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </section>
          )}

          <Rule />

          {/* ── COUNTDOWN ── */}
          <section className="px-8 py-24 md:px-16 md:py-32">
            <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
              <motion.div {...cut()} className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.5em]" style={{color: MUTED}}>{invitation.countdown.label}</p>
                <Countdown target={invitation.countdown.target} />
              </motion.div>
              <motion.div {...cut(0.15)}>
                <a
                  href={calendarUrl}
                  download="invitation.ics"
                  className="inline-flex items-center gap-2 border px-6 py-3 text-xs uppercase tracking-[0.3em] transition-opacity hover:opacity-60"
                  style={{borderColor: SURFACE2, color: ACCENT}}
                >
                  <CalendarPlus size={14} /> Save the Date
                </a>
              </motion.div>
            </div>
          </section>

          <Rule />

          {/* ── EVENTS ── */}
          <section className="px-8 py-20 md:px-16">
            <motion.p {...cut()} className="mb-12 text-[10px] uppercase tracking-[0.5em]" style={{color: MUTED}}>
              {invitation.events.title}
            </motion.p>
            <p className="mb-10 font-display text-3xl md:text-4xl" style={{color: TEXT, letterSpacing: '-0.02em', whiteSpace: 'pre-line'}}>
              {invitation.events.dateLabel}
            </p>
            <div className="space-y-0">
              {invitation.events.details.map((ev, i) => (
                <motion.div key={i} {...cut(i * 0.07)}>
                  <Rule />
                  <div className="grid py-6 md:grid-cols-3 md:gap-8">
                    <h3 className="text-sm font-semibold mb-2 md:mb-0" style={{color: TEXT}}>{ev.title}</h3>
                    <div className="md:col-span-2 space-y-1">
                      {ev.time && <p className="text-sm font-mono" style={{color: ACCENT}}>{ev.time}</p>}
                      {ev.location && <p className="text-sm" style={{color: MUTED}}>{ev.location}</p>}
                      {ev.text && <p className="text-sm" style={{color: MUTED}}>{ev.text}</p>}
                      {ev.link && (
                        <a href={ev.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider mt-1"
                          style={{color: ACCENT}}>
                          <ExternalLink size={11} /> {ev.linkLabel ?? 'Open'}
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <Rule />
            </div>
          </section>

          <Rule />

          {/* ── GALLERY — GRID ── */}
          <section className="px-8 py-20 md:px-16">
            <motion.p {...cut()} className="mb-10 text-[10px] uppercase tracking-[0.5em]" style={{color: MUTED}}>
              Gallery
            </motion.p>
            <div className="grid grid-cols-4 gap-1 md:grid-cols-6">
              {invitation.media.gallery.slice(0, 12).map((src, i) => (
                <motion.div
                  key={i}
                  {...cut((i % 6) * 0.05)}
                  className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                  style={{aspectRatio: '1/1'}}
                >
                  <img src={src} alt="" className="h-full w-full object-cover transition-opacity duration-500 hover:opacity-70" />
                </motion.div>
              ))}
            </div>
          </section>

          <Rule />

          {/* ── GIFT ── */}
          {invitation.gift.visible !== false && (
          <section className="px-8 py-20 md:px-16">
            <motion.div {...cut()} className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3 max-w-sm">
                <p className="text-[10px] uppercase tracking-[0.5em]" style={{color: MUTED}}>Wedding Gift</p>
                <p className="text-sm leading-relaxed" style={{color: MUTED}}>{invitation.gift.intro}</p>
              </div>
              <button
                onClick={() => setGiftOpen(true)}
                className="inline-flex items-center gap-2 border px-6 py-3 text-xs uppercase tracking-[0.3em] transition-opacity hover:opacity-60 self-start"
                style={{borderColor: SURFACE2, color: ACCENT}}
              >
                View Details
              </button>
            </motion.div>
          </section>
          )}

          <Rule />

          <RsvpSection invitation={invitation} initialGuestName={guestName} theme={RSVP_THEME} readOnly={isTemplatePreview} />

          {/* ── FOOTER ── */}
          <section className="flex min-h-[60vh] flex-col justify-between px-8 py-16 md:px-16">
            <motion.p {...cut()} className="text-[10px] uppercase tracking-[0.5em]" style={{color: MUTED}}>
              {invitation.couple.coverLabel}
            </motion.p>

            <motion.h2
              {...cut(0.1)}
              className="font-display leading-none"
              style={{
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                letterSpacing: '-0.025em',
                color: SURFACE2,
              }}
            >
              {invitation.footer.closingTitle.join('\n')}
            </motion.h2>

            <motion.div {...cut(0.2)} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <p className="text-sm max-w-xs" style={{color: MUTED}}>{invitation.footer.closingText}</p>
              <div className="flex flex-col gap-2 text-right">
                {invitation.footer.links.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-wider hover:opacity-60"
                    style={{color: MUTED}}>
                    {l.label}
                  </a>
                ))}
                <a href={invitation.footer.creditUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-2 text-[10px] hover:opacity-60"
                  style={{color: SURFACE2}}>
                  {invitation.footer.creditLabel}
                </a>
              </div>
            </motion.div>
          </section>
        </>
      )}
    </div>
  );
}
