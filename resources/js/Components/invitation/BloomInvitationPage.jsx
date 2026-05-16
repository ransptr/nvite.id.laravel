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

const ACCENT = '#d4896a';
const BG = '#fdf6ee';
const SURFACE = '#f5e6d8';
const TEXT = '#2c1a0e';
const RSVP_THEME = {
  accent: ACCENT,
  background: BG,
  surface: SURFACE,
  text: TEXT,
};

function LeafDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <div className="h-px flex-1 bg-[#d4896a]/30" />
      <svg width="22" height="14" viewBox="0 0 22 14" fill="none" className="opacity-60">
        <path d="M11 1C11 1 3 4 2 10C5 10 8 8 11 7C14 8 17 10 20 10C19 4 11 1 11 1Z" fill="#d4896a" />
        <line x1="11" y1="7" x2="11" y2="13" stroke="#d4896a" strokeWidth="1" />
      </svg>
      <div className="h-px flex-1 bg-[#d4896a]/30" />
    </div>
  );
}

function CoverScreen({invitation, guestName, onOpen}) {
  return (
    <motion.div
      key="cover"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0, transition: {duration: 0.8}}}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{background: BG}}
    >
      <div className="absolute inset-0">
        <img
          src={invitation.media.coverImage}
          alt=""
          className="h-full w-full object-cover opacity-30"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0" style={{background: `linear-gradient(to bottom, ${BG}bb 0%, ${BG}22 40%, ${BG}99 100%)`}} />
      </div>

      <motion.div
        initial={{opacity: 0, y: 32}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1]}}
        className="relative z-10 flex flex-col items-center gap-6 px-8 text-center"
      >
        <p className="text-xs uppercase tracking-[0.32em]" style={{color: ACCENT}}>{invitation.couple.coverLabel}</p>
        <h1 className="font-display text-5xl italic leading-tight md:text-7xl" style={{color: TEXT}}>
          {invitation.couple.joinedName}
        </h1>
        <p className="text-sm tracking-widest uppercase" style={{color: `${TEXT}99`}}>{invitation.couple.dateLabel}</p>
        {guestName !== 'Guest Name' && (
          <p className="text-sm" style={{color: `${TEXT}88`}}>Dear, <span className="italic" style={{color: TEXT}}>{guestName}</span></p>
        )}
        <button
          onClick={onOpen}
          className="mt-4 rounded-full border px-8 py-3 text-sm uppercase tracking-[0.22em] transition-all duration-300 hover:text-white"
          style={{borderColor: ACCENT, color: ACCENT, background: 'transparent'}}
          onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ACCENT; }}
        >
          Open Invitation
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
      <div className="space-y-4 p-6">
        <h3 className="font-display text-2xl italic" style={{color: TEXT}}>Wedding Gift</h3>
        <LeafDivider />
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

export function BloomInvitationPage({invitation, isTemplatePreview = false}) {
  const audioRef = useRef(null);
  const [stage, setStage] = useState('cover');
  const [guestName, setGuestName] = useState('Guest Name');
  const [giftOpen, setGiftOpen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [storyIndex, setStoryIndex] = useState(0);

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
    if (invitation.media.storyImages.length <= 1) return;
    const t = window.setInterval(() => {
      setStoryIndex(i => (i + 1) % invitation.media.storyImages.length);
    }, 3500);
    return () => window.clearInterval(t);
  }, [invitation.media.storyImages.length]);

  useEffect(() => {
    if (stage !== 'open' || !audioRef.current) return;
    if (isAudioEnabled) audioRef.current.play().catch(() => undefined);
    else audioRef.current.pause();
  }, [isAudioEnabled, stage]);

  const openInvitation = () => {
    setStage('open');
    if (audioRef.current && isAudioEnabled) audioRef.current.play().catch(() => undefined);
  };

  const ease = [0.22, 1, 0.36, 1];
  const revealUp = {
    initial: {opacity: 0, y: 40},
    whileInView: {opacity: 1, y: 0},
    viewport: {once: true, margin: '-60px'},
    transition: {duration: 1.0, ease},
  };

  const currentStoryImage = invitation.media.storyImages[storyIndex] ?? invitation.media.heroPoster;

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
              className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all"
              style={{background: ACCENT, color: '#fff'}}
            >
              {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          {isTemplatePreview && (
            <div className="fixed right-4 top-4 z-50 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-widest backdrop-blur-md" style={{borderColor: `${ACCENT}44`, background: `${BG}cc`, color: ACCENT}}>
              Template Preview
            </div>
          )}

          {giftOpen && (
            <GiftModal accounts={invitation.gift.accounts} onClose={() => setGiftOpen(false)} />
          )}

          {/* ── HERO ── */}
          <motion.section
            className="relative min-h-screen overflow-hidden"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1.2}}
          >
            <img
              src={invitation.media.heroPoster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0" style={{background: `linear-gradient(160deg, ${BG}dd 0%, ${BG}66 50%, transparent 100%)`}} />
            <div className="relative z-10 flex min-h-screen flex-col justify-end px-8 pb-20 md:px-16 md:pb-28">
              <motion.div {...revealUp} className="max-w-2xl">
                <p className="mb-4 text-xs uppercase tracking-[0.35em]" style={{color: ACCENT}}>{invitation.couple.coverLabel}</p>
                <h2 className="font-display text-6xl italic leading-none md:text-9xl" style={{color: TEXT}}>
                  {invitation.couple.bride.nickname}
                </h2>
                <p className="my-3 text-2xl md:text-3xl" style={{color: `${TEXT}66`}}>&amp;</p>
                <h2 className="font-display text-6xl italic leading-none md:text-9xl" style={{color: TEXT}}>
                  {invitation.couple.groom.nickname}
                </h2>
                <p className="mt-6 text-sm tracking-widest uppercase" style={{color: `${TEXT}77`}}>{invitation.couple.dateLabel}</p>
              </motion.div>
            </div>
          </motion.section>

          {/* ── SCRIPTURE ── */}
          <section className="px-8 py-20 md:px-16 md:py-28">
            <motion.div {...revealUp} className="mx-auto max-w-2xl text-center">
              <LeafDivider />
              <p className="mt-10 font-display text-2xl italic leading-relaxed md:text-3xl" style={{color: TEXT}}>
                &ldquo;{invitation.couple.scripture.text}&rdquo;
              </p>
              <p className="mt-5 text-xs uppercase tracking-[0.3em]" style={{color: ACCENT}}>
                {invitation.couple.scripture.citation}
              </p>
              <div className="mt-10">
                <LeafDivider />
              </div>
            </motion.div>
          </section>

          {/* ── COUPLE PROFILES ── */}
          <section className="px-8 py-10 md:px-16 md:py-16">
            <div className="mx-auto max-w-5xl">
              <motion.p {...revealUp} className="mb-12 text-center text-xs uppercase tracking-[0.35em]" style={{color: ACCENT}}>
                The Happy Couple
              </motion.p>
              <div className="grid gap-10 md:grid-cols-2">
                {[invitation.couple.bride, invitation.couple.groom].map((person) => (
                  <motion.div key={person.fullName} {...revealUp} className="flex flex-col items-center gap-5 rounded-3xl p-8 text-center" style={{background: SURFACE}}>
                    <div className="h-48 w-48 overflow-hidden rounded-full" style={{outline: `4px solid ${ACCENT}44`, outlineOffset: '3px'}}>
                      <img src={person.image} alt={person.fullName} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-1" style={{color: ACCENT}}>{person.title}</p>
                      <h3 className="font-display text-3xl italic" style={{color: TEXT}}>{person.fullName}</h3>
                      <div className="mt-3 space-y-0.5 text-sm" style={{color: `${TEXT}77`}}>
                        {person.parents.map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                      {person.instagram && (
                        <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs" style={{color: ACCENT}}>
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
          <section className="px-8 py-16 md:px-16 md:py-24" style={{background: SURFACE}}>
            <div className="mx-auto max-w-3xl">
              <motion.div {...revealUp} className="mb-16 text-center">
                <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{color: ACCENT}}>Our Journey</p>
                <h2 className="font-display text-4xl italic md:text-5xl" style={{color: TEXT}}>{invitation.story.title}</h2>
              </motion.div>

              <div className="relative">
                <div className="absolute left-16 top-0 bottom-0 w-px md:left-24" style={{background: `${ACCENT}33`}} />
                <div className="space-y-16">
                  {invitation.story.timeline.map((entry, i) => (
                    <motion.div key={i} {...revealUp} transition={{...revealUp.transition, delay: i * 0.15}} className="relative flex gap-8 md:gap-12">
                      <div className="w-14 shrink-0 text-right md:w-20">
                        <span className="font-display text-3xl italic md:text-4xl" style={{color: ACCENT}}>{entry.year}</span>
                      </div>
                      <div className="relative pb-4">
                        <div className="absolute -left-[33px] top-2 h-3 w-3 rounded-full md:-left-[41px]" style={{background: ACCENT}} />
                        <h3 className="mb-3 text-lg font-semibold" style={{color: TEXT}}>{entry.title}</h3>
                        <div className="space-y-4 text-sm leading-relaxed" style={{color: `${TEXT}aa`}}>
                          {entry.body.split('\n\n').map((para, j) => <p key={j}>{para}</p>)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          )}

          {/* ── STORY IMAGE ── */}
          <section className="relative h-[60vw] max-h-[520px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentStoryImage}
                src={currentStoryImage}
                alt=""
                initial={{opacity: 0, scale: 1.04}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0}}
                transition={{duration: 1.2}}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0" style={{background: `linear-gradient(to bottom, transparent 60%, ${BG})`}} />
          </section>

          {/* ── COUNTDOWN ── */}
          <section className="px-8 py-20 md:px-16 md:py-28">
            <motion.div {...revealUp} className="mx-auto max-w-xl text-center">
              <LeafDivider />
              <p className="mt-10 mb-6 text-xs uppercase tracking-[0.35em]" style={{color: ACCENT}}>{invitation.countdown.label}</p>
              <Countdown target={invitation.countdown.target} />
              <a
                href={calendarUrl}
                download="invitation.ics"
                className="mt-10 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm uppercase tracking-wider transition-all hover:opacity-80"
                style={{borderColor: ACCENT, color: ACCENT}}
              >
                <CalendarPlus size={16} /> Save the Date
              </a>
              <div className="mt-10">
                <LeafDivider />
              </div>
            </motion.div>
          </section>

          {/* ── EVENTS ── */}
          <section className="px-8 py-16 md:px-16 md:py-20" style={{background: SURFACE}}>
            <div className="mx-auto max-w-3xl">
              <motion.div {...revealUp} className="mb-12 text-center">
                <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{color: ACCENT}}>Wedding Day</p>
                <h2 className="font-display text-4xl italic md:text-5xl" style={{color: TEXT}}>{invitation.events.title}</h2>
                <p className="mt-3 text-sm whitespace-pre-line" style={{color: `${TEXT}88`}}>{invitation.events.dateLabel}</p>
              </motion.div>
              <div className="space-y-5">
                {invitation.events.details.map((ev, i) => (
                  <motion.div key={i} {...revealUp} transition={{...revealUp.transition, delay: i * 0.1}}
                    className="rounded-2xl p-6" style={{background: BG}}>
                    <h3 className="text-base font-semibold mb-1" style={{color: TEXT}}>{ev.title}</h3>
                    {ev.time && <p className="text-sm mb-1" style={{color: ACCENT}}>{ev.time}</p>}
                    {ev.location && <p className="text-sm" style={{color: `${TEXT}99`}}>{ev.location}</p>}
                    {ev.text && <p className="text-sm" style={{color: `${TEXT}99`}}>{ev.text}</p>}
                    {ev.link && (
                      <a href={ev.link} target="_blank" rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider"
                        style={{color: ACCENT}}>
                        <ExternalLink size={12} /> {ev.linkLabel ?? 'Open'}
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── GIFT ── */}
          {invitation.gift.visible !== false && (
          <section className="px-8 py-20 md:px-16 md:py-24">
            <motion.div {...revealUp} className="mx-auto max-w-xl text-center">
              <LeafDivider />
              <div className="my-10">
                <p className="text-xs uppercase tracking-[0.35em] mb-4" style={{color: ACCENT}}>Wedding Gift</p>
                <div className="relative h-56 overflow-hidden rounded-3xl mb-6">
                  <img src={invitation.media.giftImage} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0" style={{background: `${ACCENT}44`}} />
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{color: `${TEXT}99`}}>{invitation.gift.intro}</p>
                <button
                  onClick={() => setGiftOpen(true)}
                  className="rounded-full border px-8 py-3 text-sm uppercase tracking-wider transition-all hover:text-white"
                  style={{borderColor: ACCENT, color: ACCENT}}
                  onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ACCENT; }}
                >
                  View Gift Details
                </button>
              </div>
              <LeafDivider />
            </motion.div>
          </section>
          )}

          <RsvpSection invitation={invitation} initialGuestName={guestName} theme={RSVP_THEME} readOnly={isTemplatePreview} />

          {/* ── GALLERY ── */}
          <section className="px-8 py-16 md:px-16 md:py-20">
            <div className="mx-auto max-w-5xl">
              <motion.div {...revealUp} className="mb-10 text-center">
                <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{color: ACCENT}}>Gallery</p>
                <h2 className="font-display text-4xl italic" style={{color: TEXT}}>Our Moments</h2>
              </motion.div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {invitation.media.gallery.slice(0, 12).map((src, i) => (
                  <motion.div
                    key={i}
                    {...revealUp}
                    transition={{...revealUp.transition, delay: (i % 4) * 0.08}}
                    className={`overflow-hidden rounded-2xl ${i === 0 || i === 7 ? 'col-span-2 row-span-2' : ''}`}
                    style={{aspectRatio: i === 0 || i === 7 ? '1/1' : '3/4'}}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <section className="px-8 py-24 md:px-16 md:py-32 text-center" style={{background: SURFACE}}>
            <motion.div {...revealUp} className="mx-auto max-w-xl">
              <LeafDivider />
              <div className="my-10">
                <h2 className="font-display text-6xl italic md:text-8xl" style={{color: TEXT}}>
                  {invitation.footer.closingTitle.join(' ')}
                </h2>
                <p className="mt-6 text-sm leading-relaxed" style={{color: `${TEXT}99`}}>{invitation.footer.closingText}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  {invitation.footer.links.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs uppercase tracking-wider hover:underline" style={{color: ACCENT}}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              <LeafDivider />
              <p className="mt-8 text-xs" style={{color: `${TEXT}55`}}>
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
