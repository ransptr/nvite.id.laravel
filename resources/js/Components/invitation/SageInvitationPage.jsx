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

const ACCENT = '#6b8c5e';
const BG = '#f4f7f0';
const SURFACE = '#dfebd5';
const TEXT = '#1e2d1a';
const RSVP_THEME = {
  accent: ACCENT,
  background: BG,
  surface: SURFACE,
  text: TEXT,
};

function BranchDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <div className="h-px flex-1" style={{background: `${ACCENT}44`}} />
      <svg width="48" height="16" viewBox="0 0 48 16" fill="none" className="opacity-50">
        <line x1="24" y1="8" x2="0" y2="8" stroke={ACCENT} strokeWidth="1" />
        <line x1="24" y1="8" x2="48" y2="8" stroke={ACCENT} strokeWidth="1" />
        <circle cx="24" cy="8" r="2.5" fill={ACCENT} />
        <circle cx="12" cy="8" r="1.5" fill={ACCENT} />
        <circle cx="36" cy="8" r="1.5" fill={ACCENT} />
        <line x1="12" y1="8" x2="9" y2="4" stroke={ACCENT} strokeWidth="1" />
        <line x1="36" y1="8" x2="39" y2="4" stroke={ACCENT} strokeWidth="1" />
      </svg>
      <div className="h-px flex-1" style={{background: `${ACCENT}44`}} />
    </div>
  );
}

function CoverScreen({invitation, guestName, onOpen}) {
  return (
    <motion.div
      key="cover"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0, transition: {duration: 1.0}}}
      className="fixed inset-0 z-50 flex md:flex-row flex-col"
      style={{background: BG}}
    >
      {/* Left panel */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-10 py-16 text-center md:items-start md:text-left md:px-20">
        <motion.div
          initial={{opacity: 0, x: -24}}
          animate={{opacity: 1, x: 0}}
          transition={{delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1]}}
          className="space-y-5"
        >
          <p className="text-xs uppercase tracking-[0.4em]" style={{color: ACCENT}}>{invitation.couple.coverLabel}</p>
          <h1 className="font-display text-5xl italic leading-tight md:text-6xl" style={{color: TEXT}}>
            {invitation.couple.joinedName}
          </h1>
          <BranchDivider />
          <p className="text-sm tracking-widest uppercase" style={{color: `${TEXT}88`}}>{invitation.couple.dateLabel}</p>
          {guestName !== 'Guest Name' && (
            <p className="text-sm" style={{color: `${TEXT}77`}}>
              For <span className="italic font-medium" style={{color: TEXT}}>{guestName}</span>
            </p>
          )}
          <button
            onClick={onOpen}
            className="mt-2 rounded-full px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85"
            style={{background: ACCENT}}
          >
            Open Invitation
          </button>
        </motion.div>
      </div>
      {/* Right panel — photo */}
      <motion.div
        initial={{opacity: 0, scale: 1.04}}
        animate={{opacity: 1, scale: 1}}
        transition={{delay: 0.2, duration: 1.4}}
        className="relative h-64 md:h-full md:w-[45%]"
      >
        <img src={invitation.media.coverImage} alt="" className="h-full w-full object-cover" loading="eager" decoding="async" />
        <div className="absolute inset-0" style={{background: `${SURFACE}33`}} />
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
      <div className="space-y-4 p-6">
        <h3 className="font-display text-2xl italic" style={{color: TEXT}}>Wedding Gift</h3>
        <BranchDivider />
        {accounts.map(acc => (
          <div key={acc.id} className="flex items-center justify-between rounded-2xl p-4" style={{background: SURFACE}}>
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{color: ACCENT}}>{acc.bank}</p>
              <p className="font-mono text-lg font-semibold" style={{color: TEXT}}>{acc.number}</p>
              <p className="text-sm" style={{color: `${TEXT}88`}}>{acc.holder}</p>
            </div>
            <button
              onClick={() => copy(acc.id, acc.number)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              style={{background: copied === acc.id ? ACCENT : `${ACCENT}22`, color: copied === acc.id ? '#fff' : ACCENT}}
            >
              {copied === acc.id ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export function SageInvitationPage({invitation, isTemplatePreview = false}) {
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
  const reveal = (delay = 0) => ({
    initial: {opacity: 0, y: 32},
    whileInView: {opacity: 1, y: 0},
    viewport: {once: true, margin: '-50px'},
    transition: {duration: 1.2, ease: easing, delay},
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
              className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg"
              style={{background: ACCENT, color: '#fff'}}
            >
              {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          {isTemplatePreview && (
            <div className="fixed right-4 top-4 z-50 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-widest" style={{borderColor: `${ACCENT}55`, background: `${BG}ee`, color: ACCENT}}>
              Template Preview
            </div>
          )}

          {giftOpen && <GiftModal accounts={invitation.gift.accounts} onClose={() => setGiftOpen(false)} />}

          {/* ── HERO SPLIT ── */}
          <section className="flex min-h-screen flex-col md:flex-row">
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 1.4}}
              className="relative h-[55vw] md:h-auto md:w-1/2"
            >
              <img src={invitation.media.heroPoster} alt="" className="h-full w-full object-cover" loading="eager" decoding="async" />
              <div className="absolute inset-0" style={{background: `linear-gradient(to right, transparent 70%, ${BG})`}} />
            </motion.div>
            <motion.div
              initial={{opacity: 0, x: 28}}
              animate={{opacity: 1, x: 0}}
              transition={{delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1]}}
              className="flex flex-1 flex-col justify-center px-10 py-16 md:px-16"
            >
              <p className="text-xs uppercase tracking-[0.4em] mb-5" style={{color: ACCENT}}>{invitation.couple.coverLabel}</p>
              <h2 className="font-display text-5xl italic leading-tight md:text-7xl" style={{color: TEXT}}>
                {invitation.couple.bride.nickname}
                <span className="block text-3xl md:text-4xl font-normal not-italic my-3" style={{color: `${TEXT}55`}}>&amp;</span>
                {invitation.couple.groom.nickname}
              </h2>
              <p className="mt-6 text-sm tracking-widest uppercase" style={{color: `${TEXT}66`}}>{invitation.couple.dateLabel}</p>
              <div className="mt-8">
                <BranchDivider />
              </div>
              <p className="mt-6 text-sm italic leading-relaxed max-w-xs" style={{color: `${TEXT}99`}}>
                &ldquo;{invitation.couple.quote}&rdquo;
              </p>
            </motion.div>
          </section>

          {/* ── SCRIPTURE ── */}
          <section className="px-8 py-20 text-center md:py-28" style={{background: SURFACE}}>
            <motion.div {...reveal()} className="mx-auto max-w-lg">
              <BranchDivider />
              <p className="mt-8 font-display text-xl italic leading-relaxed md:text-2xl" style={{color: TEXT}}>
                &ldquo;{invitation.couple.scripture.text}&rdquo;
              </p>
              <p className="mt-5 text-xs uppercase tracking-[0.3em]" style={{color: ACCENT}}>{invitation.couple.scripture.citation}</p>
              <div className="mt-8"><BranchDivider /></div>
            </motion.div>
          </section>

          {/* ── COUPLE PROFILES ── */}
          <section className="px-8 py-20 md:px-16 md:py-28">
            <div className="mx-auto max-w-3xl">
              <motion.p {...reveal()} className="mb-16 text-center text-xs uppercase tracking-[0.4em]" style={{color: ACCENT}}>
                The Couple
              </motion.p>
              <div className="grid gap-16 md:grid-cols-2">
                {[invitation.couple.bride, invitation.couple.groom].map((person, i) => (
                  <motion.div key={person.fullName} {...reveal(i * 0.12)} className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                      <div className="h-52 w-52 overflow-hidden rounded-[28px]" style={{boxShadow: `0 0 0 4px ${SURFACE}, 0 0 0 6px ${ACCENT}44`}}>
                        <img src={person.image} alt={person.fullName} className="h-full w-full object-cover" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.4em]" style={{color: ACCENT}}>{person.title}</p>
                      <h3 className="font-display text-3xl italic" style={{color: TEXT}}>{person.fullName}</h3>
                      <div className="pt-2 space-y-0.5 text-sm" style={{color: `${TEXT}77`}}>
                        {person.parents.map((p, j) => <p key={j}>{p}</p>)}
                      </div>
                      {person.instagram && (
                        <a href={person.instagram} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 pt-2 text-xs"
                          style={{color: ACCENT}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> Instagram
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── STORY ── */}
          {invitation.story.visible !== false && (
          <section className="px-8 py-20 md:px-16 md:py-28" style={{background: SURFACE}}>
            <div className="mx-auto max-w-4xl">
              <motion.div {...reveal()} className="mb-16 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{color: ACCENT}}>Our Story</p>
                <h2 className="font-display text-4xl italic md:text-5xl" style={{color: TEXT}}>{invitation.story.title}</h2>
              </motion.div>

              <div className="grid gap-8 md:grid-cols-3">
                {invitation.story.timeline.map((entry, i) => (
                  <motion.div key={i} {...reveal(i * 0.15)}
                    className="relative overflow-hidden rounded-3xl p-8"
                    style={{background: BG}}>
                    <span className="absolute top-4 right-5 font-display text-6xl italic opacity-10 select-none leading-none" style={{color: ACCENT}}>
                      {entry.year}
                    </span>
                    <p className="text-xs uppercase tracking-widest mb-3" style={{color: ACCENT}}>{entry.year}</p>
                    <h3 className="text-base font-semibold mb-4 leading-snug" style={{color: TEXT}}>{entry.title}</h3>
                    <p className="text-sm leading-relaxed line-clamp-[10]" style={{color: `${TEXT}99`}}>
                      {entry.body.split('\n\n')[0]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          )}

          {/* ── PHOTO STRIP ── */}
          <div className="flex h-72 overflow-hidden md:h-96">
            {invitation.media.storyImages.slice(0, 4).map((src, i) => (
              <div key={i} className="flex-1 overflow-hidden">
                <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>

          {/* ── COUNTDOWN ── */}
          <section className="px-8 py-24 text-center md:py-32">
            <motion.div {...reveal()} className="mx-auto max-w-sm">
              <BranchDivider />
              <p className="mt-10 mb-6 text-xs uppercase tracking-[0.35em]" style={{color: ACCENT}}>{invitation.countdown.label}</p>
              <Countdown target={invitation.countdown.target} />
              <a
                href={calendarUrl}
                download="invitation.ics"
                className="mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm uppercase tracking-wider text-white transition-opacity hover:opacity-85"
                style={{background: ACCENT}}
              >
                <CalendarPlus size={16} /> Save the Date
              </a>
              <div className="mt-10"><BranchDivider /></div>
            </motion.div>
          </section>

          {/* ── EVENTS ── */}
          <section className="px-8 py-20 md:px-16" style={{background: SURFACE}}>
            <div className="mx-auto max-w-2xl">
              <motion.div {...reveal()} className="mb-12 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{color: ACCENT}}>The Day</p>
                <h2 className="font-display text-4xl italic md:text-5xl" style={{color: TEXT}}>{invitation.events.title}</h2>
                <p className="mt-3 whitespace-pre-line text-sm" style={{color: `${TEXT}77`}}>{invitation.events.dateLabel}</p>
              </motion.div>
              <div className="space-y-4">
                {invitation.events.details.map((ev, i) => (
                  <motion.div key={i} {...reveal(i * 0.1)}
                    className="flex gap-6 rounded-2xl p-6 md:gap-8"
                    style={{background: BG}}>
                    <div className="pt-1">
                      <div className="h-2 w-2 rounded-full mt-1" style={{background: ACCENT}} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-1" style={{color: TEXT}}>{ev.title}</h3>
                      {ev.time && <p className="text-sm mb-1" style={{color: ACCENT}}>{ev.time}</p>}
                      {ev.location && <p className="text-sm" style={{color: `${TEXT}88`}}>{ev.location}</p>}
                      {ev.text && <p className="text-sm" style={{color: `${TEXT}88`}}>{ev.text}</p>}
                      {ev.link && (
                        <a href={ev.link} target="_blank" rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider"
                          style={{color: ACCENT}}>
                          <ExternalLink size={12} /> {ev.linkLabel ?? 'Open'}
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── GIFT ── */}
          {invitation.gift.visible !== false && (
          <section className="px-8 py-24 text-center">
            <motion.div {...reveal()} className="mx-auto max-w-lg">
              <BranchDivider />
              <div className="my-10">
                <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{color: ACCENT}}>Wedding Gift</p>
                <div className="relative mb-8 overflow-hidden rounded-3xl" style={{height: '240px'}}>
                  <img src={invitation.media.giftImage} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0" style={{background: `${ACCENT}33`}} />
                </div>
                <p className="mb-8 text-sm leading-relaxed" style={{color: `${TEXT}99`}}>{invitation.gift.intro}</p>
                <button
                  onClick={() => setGiftOpen(true)}
                  className="rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white transition-opacity hover:opacity-85"
                  style={{background: ACCENT}}
                >
                  View Gift Details
                </button>
              </div>
              <BranchDivider />
            </motion.div>
          </section>
          )}

          <RsvpSection invitation={invitation} initialGuestName={guestName} theme={RSVP_THEME} readOnly={isTemplatePreview} />

          {/* ── GALLERY ── */}
          <section className="px-8 py-20 md:px-16">
            <div className="mx-auto max-w-5xl">
              <motion.div {...reveal()} className="mb-10 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{color: ACCENT}}>Gallery</p>
                <h2 className="font-display text-4xl italic" style={{color: TEXT}}>Captured Moments</h2>
              </motion.div>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                {invitation.media.gallery.slice(0, 12).map((src, i) => (
                  <motion.div
                    key={i}
                    {...reveal((i % 4) * 0.06)}
                    className="overflow-hidden rounded-xl"
                    style={{aspectRatio: '3/4'}}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <section className="px-8 py-24 text-center" style={{background: SURFACE}}>
            <motion.div {...reveal()} className="mx-auto max-w-lg">
              <BranchDivider />
              <div className="my-10">
                <h2 className="font-display text-6xl italic md:text-8xl leading-none" style={{color: TEXT}}>
                  {invitation.footer.closingTitle.join(' ')}
                </h2>
                <p className="mt-6 text-sm leading-relaxed" style={{color: `${TEXT}99`}}>{invitation.footer.closingText}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-5">
                  {invitation.footer.links.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs uppercase tracking-wider hover:underline"
                      style={{color: ACCENT}}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              <BranchDivider />
              <p className="mt-8 text-xs" style={{color: `${TEXT}44`}}>
                <a href={invitation.footer.creditUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {invitation.footer.creditLabel}
                </a>
              </p>
            </motion.div>
          </section>
        </>
      )}
    </div>
  );
}
