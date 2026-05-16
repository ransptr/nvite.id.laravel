import React, {useEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {
  ArrowRight,
  CalendarPlus,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Mail,
  MessageCircle,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

import {RsvpSection} from '@/Components/invitation/RsvpSection';
import {TwoAreBetterThanOneSection} from '@/Components/invitation/TwoAreBetterThanOneSection';
import {
  usePointerParallax,
  useSectionParallax,
} from '@/Components/shared/CinematicParallax';
import {Countdown} from '@/Components/shared/Countdown';
import {Marquee} from '@/Components/shared/Marquee';
import {Modal} from '@/Components/shared/Modal';
import {ParallaxImage} from '@/Components/shared/ParallaxImage';
import {RevealOnScroll} from '@/Components/shared/RevealOnScroll';
import {buildCalendarDataUrl} from '@/lib/calendar';
import {resolveGuestName} from '@/lib/guest';
import {cn} from '@/lib/utils';

const NAV_ITEMS = [
  {id: 'home', label: 'Home'},
  {id: 'profile', label: 'Profile'},
  {id: 'lovestory', label: 'Love Story'},
  {id: 'weddingevent', label: 'Wedding Event'},
  {id: 'rsvp', label: 'RSVP'},
  {id: 'weddinggift', label: 'Wedding Gift'},
  {id: 'gallery', label: 'Gallery'},
];


export function InvitationPage({invitation, isTemplatePreview = false}) {
  const withFallback = (value) => value?.trim() || undefined;
  const heroVideoUrl = invitation.media.heroVideo?.trim() ?? '';
  const heroPosterUrl = invitation.media.heroPoster?.trim() ?? '';
  const isDirectVideoFile = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(heroVideoUrl);
  const canUseHeroVideo = Boolean(heroVideoUrl) && isDirectVideoFile;
  const normalizedVideoUrl = (() => {
    const raw = invitation.media.videoUrl?.trim();
    if (!raw) return '';

    const buildEmbed = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
    try {
      const url = new URL(raw);
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtube-nocookie.com')) {
        if (url.pathname.startsWith('/live/')) {
          const id = url.pathname.split('/')[2];
          if (id) return buildEmbed(id);
        }
        if (url.pathname.startsWith('/shorts/')) {
          const id = url.pathname.split('/')[2];
          if (id) return buildEmbed(id);
        }
        if (url.pathname === '/watch') {
          const v = url.searchParams.get('v');
          if (v) return buildEmbed(v);
        }
        if (url.pathname.startsWith('/embed/')) {
          const id = url.pathname.split('/')[2];
          return id ? buildEmbed(id) : raw;
        }
      }
      if (url.hostname === 'youtu.be') {
        const id = url.pathname.replace('/', '');
        if (id) return buildEmbed(id);
      }
      return raw;
    } catch {
      return raw;
    }
  })();
  const audioRef = useRef(null);
  const heroVideoRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState('loading');
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [storyScaleHydrated, setStoryScaleHydrated] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [guestName, setGuestName] = useState('Guest Name');
  const [copiedAccount, setCopiedAccount] = useState(null);

  const {scrollYProgress} = useScroll();
  const heroSection = useSectionParallax({
    y: [-90, 120],
    scale: [1.16, 1.04],
  });
  const storyIntroSection = useSectionParallax({
    y: [-90, 90],
    scale: [1.12, 1.02],
  });
  const timelineSection = useSectionParallax({y: [-36, 36]});
  const countdownSection = useSectionParallax({y: [-56, 56]});
  const eventsSection = useSectionParallax({y: [-48, 48]});
  const giftSection = useSectionParallax({y: [-48, 56]});
  const heroPointer = usePointerParallax({strength: 24, rotate: 6});

  const heroContentY = useTransform(heroSection.progress, [0, 1], shouldReduceMotion ? [0, 0] : [-12, 58]);
  const heroOpacity = useTransform(
    heroSection.progress,
    [0, 0.24, 0.95],
    shouldReduceMotion ? [1, 1, 1] : [1, 0.82, 0.2],
  );
  const heroFadeOut = useTransform(heroSection.progress, [0.3, 1], [1, 0]);
  const heroBlackFade = useTransform(heroSection.progress, [0.58, 1], shouldReduceMotion ? [0.72, 0.72] : [0, 1]);
  const heroMarqueeNear = useTransform(heroSection.progress, [0, 1], shouldReduceMotion ? [0, 0] : [-10, 62]);
  const heroScriptureY = useTransform(heroSection.progress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 34]);
  const storyTitleY = useTransform(storyIntroSection.progress, [0, 1], shouldReduceMotion ? [0, 0] : [-20, 52]);
  const storyBackdropY = useTransform(storyIntroSection.progress, [0, 1], shouldReduceMotion ? [0, 0] : [-100, 110]);
  const {scrollYProgress: storyImageProgress} = useScroll({
    target: storyScaleHydrated ? storyIntroSection.ref : undefined,
    offset: ['start 120%', 'start 0%'],
  });
  const storyImageScale = useTransform(storyImageProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0.8, 1]);
  const countdownMarqueeY = useTransform(countdownSection.progress, [0, 1], shouldReduceMotion ? [0, 0] : [-24, 28]);
  const countdownTextY = useTransform(countdownSection.progress, [0, 1], shouldReduceMotion ? [0, 0] : [-20, 36]);
  const eventsHeadingY = useTransform(eventsSection.progress, [0, 1], shouldReduceMotion ? [0, 0] : [-20, 44]);
  const giftTextY = useTransform(giftSection.progress, [0, 1], shouldReduceMotion ? [0, 0] : [-18, 34]);

  useEffect(() => {
    resolveGuestName(window.location.search, invitation.guestQueryParam).then(setGuestName);
  }, [invitation.guestQueryParam]);

  useEffect(() => {
    if (!storyScaleHydrated && storyIntroSection.ref.current) {
      setStoryScaleHydrated(true);
    }
  }, [storyScaleHydrated, storyIntroSection.ref]);

  useEffect(() => {
    if (stage !== 'loading') return;

    const LOADER_DURATION_MS = 3000;
    const start = performance.now();

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const nextProgress = Math.min(100, (elapsed / LOADER_DURATION_MS) * 100);
      setLoaderProgress(nextProgress);

      if (elapsed >= LOADER_DURATION_MS) {
        window.clearInterval(interval);
        setLoaderProgress(100);
        setStage('cover');
      }
    }, 30);

    return () => window.clearInterval(interval);
  }, [stage]);

  const currentStoryImage = invitation.media.storyImages[storyIndex] ?? invitation.media.heroPoster;

  useEffect(() => {
    if (invitation.media.storyImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setStoryIndex((current) => (current + 1) % invitation.media.storyImages.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [invitation.media.storyImages.length]);

  useEffect(() => {
    if (stage !== 'open' || !audioRef.current) return;

    if (videoOpen) {
      audioRef.current.pause();
      return;
    }

    if (isAudioEnabled) {
      audioRef.current.play().catch(() => undefined);
    } else {
      audioRef.current.pause();
    }
  }, [isAudioEnabled, stage, videoOpen]);

  useEffect(() => {
    document.title = invitation.seo.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', invitation.seo.description);

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

  const calendarUrl = useMemo(
    () => buildCalendarDataUrl(invitation.countdown.calendar),
    [invitation.countdown.calendar],
  );

  const openInvitation = () => {
    setStage('open');
    if (audioRef.current && isAudioEnabled) {
      audioRef.current.play().catch(() => undefined);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled((current) => !current);
  };

  const playVideo = (video) => {
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.play().catch(() => undefined);
  };

  useEffect(() => {
    if (stage !== 'open') return;

    playVideo(heroVideoRef.current);
  }, [stage, invitation.media.heroVideo]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <audio ref={audioRef} src={withFallback(invitation.media.audio)} loop preload="none" />

      <AnimatePresence mode="wait">
        {stage === 'loading' ? (
          <FakeLoader invitation={invitation} progress={loaderProgress} />
        ) : stage === 'cover' ? (
          <CoverScreen
            invitation={invitation}
            guestName={guestName}
            onOpen={openInvitation}
          />
        ) : (
          <motion.main
            key="invitation"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="relative"
          >
            <motion.div
              style={{scaleX: scrollYProgress}}
              className="fixed left-0 right-0 top-0 z-[90] h-px origin-left bg-[#d8b181]"
            />

            <FloatingUi
              navOpen={navOpen}
              onOpenNav={() => setNavOpen(true)}
              onToggleAudio={toggleAudio}
              audioEnabled={isAudioEnabled}
            />

            {isTemplatePreview ? (
              <div className="fixed right-4 top-4 z-[95] rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-white/75 backdrop-blur-md">
                Template Preview
              </div>
            ) : null}

            <NavigationOverlay
              open={navOpen}
              invitation={invitation}
              onClose={() => setNavOpen(false)}
            />

            <motion.section ref={heroSection.ref} id="home" style={{opacity: heroFadeOut}} className="relative min-h-screen overflow-hidden">
              <motion.div
                {...heroPointer.bind}
                style={{...heroSection.style, ...heroPointer.style}}
                className="absolute inset-0 z-0"
              >
                {canUseHeroVideo ? (
                  <video
                    ref={heroVideoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={heroPosterUrl || undefined}
                    src={heroVideoUrl}
                    onLoadedData={(event) => playVideo(event.currentTarget)}
                    onCanPlay={(event) => playVideo(event.currentTarget)}
                  />
                ) : heroPosterUrl ? (
                  <img src={withFallback(heroPosterUrl)} alt="Hero" className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" referrerPolicy="no-referrer" />
                ) : (
                  <div className="absolute inset-0 bg-[#111]" />
                )}
              </motion.div>
              <motion.div
                style={{opacity: heroBlackFade}}
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[42vh] bg-gradient-to-b from-transparent via-black/72 to-black"
              />

              <div className="absolute inset-x-0 top-0 z-40">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 pt-12 pb-6 md:px-10 md:pt-11 md:pb-7">
                  <span className="text-[14px] md:text-[25px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.38)]">{invitation.couple.coverLabel}</span>
                  <span className="text-[14px] md:text-[25px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.38)]">{invitation.couple.dateLabel}</span>
                </div>
              </div>

              <motion.div style={{y: heroMarqueeNear, opacity: heroOpacity}} className="absolute inset-x-0 top-[13vh] z-40 px-4 md:px-0">
                <div className="[text-shadow:0_2px_20px_rgba(0,0,0,0.42)]">
                  <Marquee bride={invitation.couple.joinedName.replace(/&/g, '')} splitBySpace groom="" className="hero-marquee text-white" />
                </div>
              </motion.div>

              <motion.div
                style={{y: heroContentY, opacity: heroOpacity}}
                className="relative z-40 mx-auto flex min-h-screen w-full max-w-[1440px] px-5 pt-[35vh] md:px-10 md:pt-[34vh]"
              >
                <RevealOnScroll className="max-w-[25rem] md:max-w-[31rem]">
                  <motion.p style={{y: heroScriptureY}} className="font-copy text-sm leading-relaxed text-white [text-shadow:0_3px_20px_rgba(0,0,0,0.42)] md:text-[1.5rem] md:leading-[1.45]">
                    &ldquo;{invitation.couple.scripture.text}&rdquo;
                  </motion.p>
                  <p className="mt-4 text-[12px] uppercase tracking-[0.01em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.42)] md:mt-5">
                    {invitation.couple.scripture.citation}
                  </p>
                </RevealOnScroll>
              </motion.div>
            </motion.section>

            <TwoAreBetterThanOneSection invitation={invitation} />

            <section id="profile" className="bg-[#000000] px-5 py-10 pb-24 md:px-10 md:pb-[600px]">
              <div className="mx-auto max-w-[1440px] space-y-[400px] md:space-y-[600px]">
                <ProfileCard person={invitation.couple.bride} align="left" accent={invitation.theme.accent} />
                <ProfileCard person={invitation.couple.groom} align="right" accent={invitation.theme.accent} />
              </div>
            </section>

            <section ref={storyIntroSection.ref} id="lovestory" className="relative md:min-h-screen overflow-hidden bg-[#000000]">
              {/* Mobile: Landscape image with title overlay */}
              <div className="relative h-[56.25vw] w-full md:hidden">
                <motion.div
                  style={{scale: storyImageScale}}
                  className="absolute inset-0"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStoryImage}
                      initial={{opacity: 0.35, scale: 1.04}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0.35, scale: 1.02}}
                      style={{y: storyBackdropY}}
                      transition={{duration: 1.4, ease: [0.22, 1, 0.36, 1]}}
                      className="absolute inset-0"
                    >
                      <img
                        src={withFallback(currentStoryImage)}
                        alt="Love story backdrop"
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/55" />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
                  <RevealOnScroll className="text-center">
                    <motion.h2 style={{y: storyTitleY}} className="font-display text-4xl italic leading-none text-white">
                      {invitation.story.title}
                    </motion.h2>
                  </RevealOnScroll>
                </div>
              </div>

              {/* Desktop: Full screen with image */}
              <div className="hidden md:block md:h-full md:min-h-screen">
                <motion.div
                  style={{scale: storyImageScale}}
                  className="absolute inset-0"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStoryImage}
                      initial={{opacity: 0.35, scale: 1.04}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0.35, scale: 1.02}}
                      style={{y: storyBackdropY}}
                      transition={{duration: 1.4, ease: [0.22, 1, 0.36, 1]}}
                      className="absolute inset-0"
                    >
                      <img
                        src={withFallback(currentStoryImage)}
                        alt="Love story backdrop"
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/55" />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                <div className="relative z-10 flex min-h-screen items-center justify-center px-10">
                  <RevealOnScroll className="text-center">
                    <motion.h2 style={{y: storyTitleY}} className="font-display text-8xl italic leading-none text-white">
                      {invitation.story.title}
                    </motion.h2>
                  </RevealOnScroll>
                </div>
              </div>
            </section>

            {invitation.story.visible !== false && (
              <section ref={timelineSection.ref} className="bg-[#000000] px-5 py-24 md:px-10">
                <motion.div style={{y: timelineSection.y}} className="mx-auto max-w-[1320px] space-y-16">
                  {invitation.story.timeline.map((entry, index) => (
                    <div key={entry.year}>
                      <TimelineEntryRow entry={entry} index={index} />
                    </div>
                  ))}
                </motion.div>
              </section>
            )}

            <section ref={countdownSection.ref} id="weddingevent" className="bg-[#000000] px-5 py-24 pb-[200px] md:px-10">
              <div className="mx-auto max-w-[1440px] space-y-10">
                <motion.div style={{y: countdownMarqueeY}}>
                  <Marquee text={invitation.countdown.label} muted className="text-white/25" />
                </motion.div>

                <div className="mx-auto max-w-2xl space-y-4 text-center">
                  <RevealOnScroll>
                    <ParallaxImage
                      src={withFallback(invitation.countdown.image) ?? ''}
                      alt="Countdown scene"
                      className="min-h-[480px] -mt-[200px]"
                      overlayOpacity={0.18}
                      targetRef={countdownSection.ref}
                      enablePointer
                      mouseStrength={16}
                    />
                  </RevealOnScroll>

                  <RevealOnScroll delay={0.08}>
                    <motion.p style={{y: countdownTextY}} className="text-2xl uppercase tracking-[0.35em] text-white/45">Countdown</motion.p>
                    <motion.div style={{y: countdownTextY}} className="mt-4">
                      <Countdown target={invitation.countdown.target} />
                    </motion.div>
                    <a
                      href={calendarUrl}
                      className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/12 px-6 py-3 text-[10px] uppercase tracking-[0.32em] text-white/75 transition hover:border-white/24 hover:bg-white hover:text-black"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      Add to Calendar
                    </a>
                  </RevealOnScroll>
                </div>
              </div>
            </section>

            <section ref={eventsSection.ref} className="border-t border-black/6 bg-[#ece6de] px-5 py-24 text-[#111] md:px-10">
              <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.44fr_0.56fr]">
                <RevealOnScroll>
                  <motion.p style={{y: eventsHeadingY}} className="text-[10px] uppercase tracking-[0.4em] text-black/45">{invitation.events.title}</motion.p>
                </RevealOnScroll>

                <div className="space-y-14">
                  <RevealOnScroll>
                    <motion.h2 style={{y: eventsHeadingY}} className="whitespace-pre-line font-display text-4xl italic leading-[0.92] sm:text-5xl md:text-6xl lg:text-8xl">
                      {invitation.events.dateLabel}
                    </motion.h2>
                  </RevealOnScroll>

                  <div className="space-y-7">
                    {invitation.events.details.map((detail, index) => (
                      <div key={detail.title}>
                        <EventDetailRow detail={detail} index={index} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {invitation.gift.visible !== false && (
              <section ref={giftSection.ref} id="weddinggift" className="bg-[#ece6de] px-5 py-24 text-[#111] md:px-10">
                <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.98fr_1.02fr]">
                  {/* Image first on mobile */}
                  <RevealOnScroll delay={0.1} className="md:order-2">
                    <img
                      src={invitation.media.giftImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
                      alt="Gift section"
                      className="w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </RevealOnScroll>

                  {/* Text and button second on mobile */}
                  <RevealOnScroll className="md:order-1">
                    <motion.p style={{y: giftTextY}} className="max-w-3xl font-display text-2xl leading-tight text-black md:text-5xl">
                      {invitation.gift.intro}
                    </motion.p>
                    <button
                      type="button"
                      onClick={() => setGiftOpen(true)}
                      className="mt-10 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 text-[10px] uppercase tracking-[0.35em] text-white transition hover:bg-[#2a211a]"
                    >
                      View Gift Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </RevealOnScroll>
                </div>
              </section>
            )}

            <RsvpSection invitation={invitation} initialGuestName={guestName} readOnly={isTemplatePreview} />

            {normalizedVideoUrl && (
              <VideoSection
                invitation={invitation}
                onOpenVideo={() => setVideoOpen(true)}
              />
            )}

            <GallerySection
              invitation={invitation}
              onOpenImage={(image) => setLightboxImage(image)}
            />

            <ThankYouSection invitation={invitation} />

            <Modal open={giftOpen} onClose={() => setGiftOpen(false)} title="Bank Account">
              <div className="grid gap-4 p-6 md:grid-cols-3 md:p-10">
                {invitation.gift.accounts.map((account) => (
                  <div key={account.id}>
                    <GiftCard
                      account={account}
                      copiedAccount={copiedAccount}
                      onCopy={async () => {
                        try {
                          await navigator.clipboard.writeText(account.number);
                          setCopiedAccount(account.id);
                          window.setTimeout(() => setCopiedAccount(null), 1800);
                        } catch {
                          setCopiedAccount(null);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </Modal>

            <Modal
              open={videoOpen}
              onClose={() => setVideoOpen(false)}
              title="Play Film"
              className="max-w-6xl"
            >
              <div className="aspect-video bg-black">
                {normalizedVideoUrl ? (
                  <iframe
                    key={normalizedVideoUrl}
                    src={normalizedVideoUrl}
                    title={`${invitation.couple.joinedName} wedding film`}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-white/70">
                    <span>No video URL set</span>
                    <span className="text-xs text-white/45">Use a YouTube watch, shorts, live, youtu.be, or embed link.</span>
                  </div>
                )}
              </div>
            </Modal>

            <Modal
              open={Boolean(lightboxImage)}
              onClose={() => setLightboxImage(null)}
              title="Gallery Preview"
              className="max-w-[90vw]"
            >
              {lightboxImage ? (
                <img
                  src={withFallback(lightboxImage)}
                  alt="Gallery preview"
                  className="max-h-[86vh] w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : null}
            </Modal>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

function CoverScreen({
  invitation,
  guestName,
  onOpen,
}) {
  const withFallback = (value) => value?.trim() || undefined;
  const coverParallax = useSectionParallax({
    y: [-24, 34],
    scale: [1.04, 1.01],
  });
  const coverPointer = usePointerParallax({strength: 12, rotate: 3.5});
  const coverVideoRef = useRef(null);
  const heroVideoUrl = invitation.media.heroVideo?.trim() ?? '';
  const heroPosterUrl = invitation.media.heroPoster?.trim() ?? '';
  const canUseHeroVideo = Boolean(heroVideoUrl) && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(heroVideoUrl);

  useEffect(() => {
    const video = coverVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.play().catch(() => undefined);
  }, [invitation.media.heroVideo]);

  return (
    <motion.section
      ref={coverParallax.ref}
      key="cover"
      initial={{opacity: 1}}
      exit={{opacity: 0, scale: 1.03}}
      transition={{duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
      className="fixed inset-0 z-[110] overflow-hidden"
    >
      <motion.div
        {...coverPointer.bind}
        style={{...coverParallax.style, ...coverPointer.style}}
        className="absolute inset-0"
      >
        {canUseHeroVideo ? (
          <video
            ref={coverVideoRef}
            className="h-full w-full object-cover saturate-[0.88] brightness-[0.94]"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroPosterUrl || undefined}
            src={heroVideoUrl}
            onLoadedData={(event) => event.currentTarget.play().catch(() => undefined)}
            onCanPlay={(event) => event.currentTarget.play().catch(() => undefined)}
          />
        ) : heroPosterUrl ? (
          <img
            src={withFallback(heroPosterUrl)}
            alt="Cover"
            className="h-full w-full object-cover saturate-[0.88] brightness-[0.94]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full bg-[#111]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(241,238,233,0.16),rgba(20,17,13,0.03)_26%,rgba(20,17,13,0.24)_100%)]" />
      </motion.div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-8 text-white md:px-10 md:py-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center">
          <RevealOnScroll>
            <p className="text-[11px] tracking-[0.01em] text-white/94 md:text-[1.05rem]">The Wedding of</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.04}>
            <h1 className="mt-2 font-display text-[13vw] italic leading-[0.9] tracking-[-0.055em] text-white [text-shadow:0_10px_26px_rgba(0,0,0,0.18)] md:text-[5rem] lg:text-[5.5rem]">
              {invitation.couple.joinedName}
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08}>
            <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-white/92 md:mt-4 md:text-[11px]">
              {invitation.couple.dateLabel.toUpperCase()}
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.12}>
            <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-white/82 md:text-[11px]">
              {guestName}
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.16}>
            <button
              type="button"
              onClick={onOpen}
              className="mt-7 inline-flex items-center gap-2.5 bg-[#101010] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:bg-black md:mt-8"
            >
              <Mail className="h-3.5 w-3.5" />
              Let&apos;s Open
            </button>
          </RevealOnScroll>
        </div>
      </div>
    </motion.section>
  );
}

function FakeLoader({
  invitation,
  progress,
}) {
  const burstImages = invitation.media.gallery.length
    ? invitation.media.gallery.slice(0, 6)
    : [invitation.media.coverImage];
  const burstIndex = Math.floor(progress / 4) % burstImages.length;
  const activeBurstImage = burstImages[burstIndex];

  return (
    <motion.section
      key="loader"
      initial={{opacity: 1}}
      exit={{opacity: 0, scale: 1.02}}
      transition={{duration: 0.55, ease: [0.22, 1, 0.36, 1]}}
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#f5f4f1] text-[#222]"
    >
      <div className="flex w-full max-w-[940px] items-center justify-center gap-8 px-8 md:gap-16 md:px-12">
        <motion.span
          initial={{opacity: 0, x: -18}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.55, ease: [0.22, 1, 0.36, 1]}}
          className="text-[10px] uppercase tracking-[0.3em] text-black/68"
        >
          {invitation.couple.coverLabel}
        </motion.span>
        <div className="relative h-[88px] w-[72px] overflow-hidden shadow-[0_18px_36px_rgba(0,0,0,0.12)] md:h-[108px] md:w-[84px]">
          <AnimatePresence>
            <motion.div
              key={activeBurstImage}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.15, ease: [0.22, 1, 0.36, 1]}}
              className="absolute inset-0"
            >
              <img
                src={activeBurstImage}
                alt="Loader preview"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.span
          initial={{opacity: 0, x: 18}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1]}}
          className="text-[10px] uppercase tracking-[0.3em] text-black/68"
        >
          {invitation.couple.joinedName.toUpperCase()}
        </motion.span>
      </div>

      <div className="absolute bottom-8 left-6 md:bottom-10 md:left-9">
        <p className="text-sm text-black/78 md:text-base">
          LOADING... {Math.round(Math.min(progress, 100))}%
        </p>
      </div>
    </motion.section>
  );
}

function FloatingUi({
  navOpen,
  onOpenNav,
  onToggleAudio,
  audioEnabled,
}) {
  return (
    <>
      {!navOpen ? (
        <button
          type="button"
          onClick={onOpenNav}
          className="fixed right-5 top-8 z-[95] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-md transition hover:border-white/22 hover:bg-white hover:text-black md:right-8 md:top-10"
          aria-expanded={navOpen}
          aria-label="Open navigation"
        >
          <span className="flex flex-col gap-[5px]">
            <span className="block h-[1.5px] w-5 bg-current" />
            <span className="block h-[1.5px] w-5 bg-current" />
          </span>
        </button>
      ) : null}

      <button
        type="button"
        onClick={onToggleAudio}
        className="fixed bottom-5 left-5 z-[118] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-md transition hover:border-white/22 hover:bg-white hover:text-black md:bottom-8 md:left-8"
        aria-label={audioEnabled ? 'Mute invitation audio' : 'Play invitation audio'}
      >
        {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>
    </>
  );
}

function NavigationOverlay({
  open,
  invitation,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, open]);

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (item.id === 'lovestory') return invitation.story.visible !== false;
    if (item.id === 'weddinggift') return invitation.gift.visible !== false;
    return true;
  });

  const previewImage = invitation.media.gallery[1] ?? invitation.media.thankYouImage;

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          className="fixed inset-0 z-[115] overflow-auto bg-[#f4f3f0] px-6 py-6 text-[#202020] md:px-10 md:py-8"
        >
          <button
            type="button"
            onClick={onClose}
            className="fixed right-5 top-5 z-[116] text-[#202020] transition hover:opacity-60 md:right-8 md:top-7"
            aria-label="Close navigation"
          >
            <X className="h-10 w-10 stroke-[1.75]" />
          </button>

          <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1120px] items-center">
            <div className="grid w-full items-center gap-12 md:grid-cols-[0.88fr_1.12fr] md:gap-20">
              <motion.div
                initial={{opacity: 0, x: -30}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -18}}
                transition={{duration: 0.5, ease: [0.22, 1, 0.36, 1]}}
                className="mx-auto w-full max-w-[410px]"
              >
                <div className="aspect-square overflow-hidden bg-[#e5e1da] shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                  <img
                    src={previewImage}
                    alt="Navigation preview"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{opacity: 0, x: 30}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 18}}
                transition={{duration: 0.52, delay: 0.05, ease: [0.22, 1, 0.36, 1]}}
                className="mx-auto w-full max-w-[430px]"
              >
                <nav className="flex flex-col items-start gap-1">
                  {filteredNavItems.map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={onClose}
                      initial={{opacity: 0, y: 12}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: 8}}
                      transition={{duration: 0.42, delay: 0.08 + index * 0.04, ease: [0.22, 1, 0.36, 1]}}
                      className="font-display text-[3rem] leading-[0.96] tracking-[-0.04em] text-[#222] transition hover:translate-x-1 hover:text-black md:text-[5rem]"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </nav>

                <p className="mt-8 max-w-[14rem] text-sm leading-relaxed text-[#9c9993] md:mt-10">
                  Please click one of the menu options above to navigate directly to your desired page.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

function ProfileCard({
  person,
  align,
  accent,
}) {
  const isRight = align === 'right';
  const profileParallax = useSectionParallax({y: [-36, 48]});
  const [profileScaleHydrated, setProfileScaleHydrated] = useState(false);
  const {scrollYProgress: imageProgress} = useScroll({
    target: profileScaleHydrated ? profileParallax.ref : undefined,
    offset: ['start 120%', 'start 0%'],
  });
  const imagePointer = usePointerParallax({strength: 18, rotate: 5});
  const textY = useTransform(profileParallax.progress, [0, 1], profileParallax.shouldReduceMotion ? [0, 0] : [-16, 26]);
  const imageY = useTransform(profileParallax.progress, [0, 1], profileParallax.shouldReduceMotion ? [0, 0] : [-52, 64]);
  const imageScale = useTransform(imageProgress, [0, 1], profileParallax.shouldReduceMotion ? [1, 1] : [0.8, 1]);

  useEffect(() => {
    if (!profileScaleHydrated && profileParallax.ref.current) {
      setProfileScaleHydrated(true);
    }
  }, [profileScaleHydrated, profileParallax.ref]);

  return (
    <div ref={profileParallax.ref} className="grid gap-8 lg:grid-cols-[0.2fr_0.2fr_0.6fr] lg:items-center">
      {/* Title - First on mobile */}
      {isRight && (
        <RevealOnScroll className="lg:order-1">
          <div className="text-center lg:pt-20">
            <p className="text-xl uppercase tracking-[0.36em] text-white/45">{person.title}</p>
          </div>
        </RevealOnScroll>
      )}

      {!isRight && (
        <RevealOnScroll className="lg:order-1">
          <div className="text-center lg:pt-20">
            <p className="text-xl uppercase tracking-[0.36em] text-white/45">{person.title}</p>
          </div>
        </RevealOnScroll>
      )}

      {/* Image - Second on mobile */}
      <RevealOnScroll delay={0.1} className="lg:order-2 lg:col-start-2">
        <motion.div
          {...imagePointer.bind}
          style={{y: imageY, scale: imageScale, ...imagePointer.style}}
          className="relative flex justify-center"
        >
          <img
            src={person.image}
            alt={person.fullName}
            className="aspect-[4/5] w-full max-w-[280px] scale-[1.06] object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </RevealOnScroll>

      {/* Text (Name, Parents, Link) - Third on mobile */}
      {isRight && (
        <RevealOnScroll className="lg:order-3 lg:pt-20">
          <motion.div style={{y: textY}} className="space-y-5">
            <div>
              <span className="font-display text-3xl not-italic leading-[0.94] text-white md:text-5xl">
                ({person.nickname})
              </span>
              <br />
              <span className="font-display text-4xl leading-[0.94] text-white md:text-6xl">
                {person.fullName}
              </span>
            </div>
            <div className="space-y-1 text-base leading-relaxed text-white/68 md:text-lg">
              {person.parents.map((line, i) => (
                <p key={line} className={i > 0 ? 'tracking-tight' : ''}>{line}</p>
              ))}
            </div>
            {person.instagram ? (
              <a
                href={person.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/55 transition hover:text-white"
              >
                Follow Story
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </motion.div>
        </RevealOnScroll>
      )}

      {!isRight && (
        <RevealOnScroll className="lg:order-3 lg:text-left lg:pt-20">
          <motion.div style={{y: textY}} className="space-y-5">
            <div>
              <span className="font-display text-3xl not-italic leading-[0.94] text-white md:text-5xl">
                ({person.nickname})
              </span>
              <br />
              <span className="font-display text-4xl leading-[0.94] text-white md:text-6xl">
                {person.fullName}
              </span>
            </div>
            <div className="space-y-1 text-base leading-relaxed text-white/68 md:text-lg">
              {person.parents.map((line, i) => (
                <p key={line} className={i > 0 ? 'tracking-tight' : ''}>{line}</p>
              ))}
            </div>
            {person.instagram ? (
              <a
                href={person.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/55 transition hover:text-white"
              >
                Follow Story
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </motion.div>
        </RevealOnScroll>
      )}
    </div>
  );
}

function TimelineEntryRow({
  entry,
  index,
}) {
  const rowParallax = useSectionParallax({y: [-28, 34]});
  const headingY = useTransform(rowParallax.progress, [0, 1], rowParallax.shouldReduceMotion ? [0, 0] : [-24, 22]);
  const copyY = useTransform(rowParallax.progress, [0, 1], rowParallax.shouldReduceMotion ? [0, 0] : [28, -18]);

  return (
    <div
      ref={rowParallax.ref}
      className="grid gap-10 border-b border-white/8 pb-14 last:border-b-0 last:pb-0 md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr]"
    >
      <RevealOnScroll direction={index % 2 === 0 ? 'up' : 'right'}>
        <motion.div style={{y: headingY}}>
          <p className="font-display text-5xl italic text-[#d8b181] md:text-6xl">
            {entry.year}
          </p>
          <p className="mt-4 text-lg text-white/88">/ {entry.title}</p>
        </motion.div>
      </RevealOnScroll>
      <RevealOnScroll delay={0.12}>
        <motion.div style={{y: copyY}} className="space-y-5 text-base leading-relaxed text-white/72 md:text-lg">
          {entry.body.split('\n\n').map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </motion.div>
      </RevealOnScroll>
    </div>
  );
}

function EventDetailRow({
  detail,
  index,
}) {
  const rowParallax = useSectionParallax({y: [-18, 24]});
  const rowY = useTransform(
    rowParallax.progress,
    [0, 1],
    rowParallax.shouldReduceMotion
      ? [0, 0]
      : [index % 2 === 0 ? -20 : 20, index % 2 === 0 ? 18 : -18],
  );

  return (
    <div ref={rowParallax.ref}>
      <RevealOnScroll delay={index * 0.06}>
        <motion.article style={{y: rowY}} className="grid gap-6 border-t border-black/10 pt-7 md:grid-cols-[220px_1fr_auto] md:items-start">
          <div>
            <h3 className="font-bold text-xl leading-tight text-black">{detail.title}</h3>
            {detail.time ? (
              <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-black/45">
                {detail.time}
              </p>
            ) : null}
          </div>

          <div className="space-y-3 text-base leading-relaxed text-black/68">
            {detail.location ? <p className="font-semibold">{detail.location}</p> : null}
            {detail.text ? <p>{detail.text}</p> : null}
          </div>

          {detail.link ? (
            <a
              href={detail.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-black/55 transition hover:text-black"
            >
              {detail.linkLabel ?? 'Open'}
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : null}
        </motion.article>
      </RevealOnScroll>
    </div>
  );
}

function VideoSection({
  invitation,
  onOpenVideo,
}) {
  const isVideoUrlValid = (() => {
    try {
      const raw = invitation.media.videoUrl?.trim();
      if (!raw) return false;
      const url = new URL(raw);
      return url.hostname.includes('youtube.com') || url.hostname.includes('youtube-nocookie.com') || url.hostname === 'youtu.be';
    } catch {
      return false;
    }
  })();
  const canUseFilmPoster = isVideoUrlValid && Boolean(invitation.media.filmPoster?.trim());
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [videoScaleHydrated, setVideoScaleHydrated] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const {scrollYProgress} = useScroll({
    target: videoScaleHydrated ? sectionRef : undefined,
    offset: ['start 120%', 'start 0%'],
  });
  const sectionScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0.8, 1]);

  useEffect(() => {
    if (!videoScaleHydrated && sectionRef.current) {
      setVideoScaleHydrated(true);
    }
  }, [videoScaleHydrated]);

  return canUseFilmPoster ? (
    <section ref={sectionRef} className="bg-[#000000] md:h-screen">
      <motion.div
        style={{scale: sectionScale}}
        className={cn('group relative h-[56.25vw] w-full md:h-full', hovering && !shouldReduceMotion && 'cursor-none')}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={(event) => {
          cursorX.set(event.clientX);
          cursorY.set(event.clientY);
        }}
      >
        <button type="button" onClick={onOpenVideo} className="block h-full w-full cursor-none">
            <img
              src={invitation.media.filmPoster}
              alt=""
              className="h-full w-full object-cover hover:brightness-100"
              referrerPolicy="no-referrer"
            />
          </button>

        <AnimatePresence>
          {hovering && !shouldReduceMotion ? (
            <motion.div
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.9}}
              className="pointer-events-none fixed z-[96] hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/72 text-[11px] uppercase tracking-[0.35em] text-white backdrop-blur-md md:flex"
              style={{left: cursorX, top: cursorY}}
            >
              PLAY
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </section>
  ) : null;
}

function GallerySection({
  invitation,
  onOpenImage,
}) {
  const sectionRef = useRef(null);
  const leftColumnRef = useRef(null);
  const leftRailRef = useRef(null);
  const [leftRailStyle, setLeftRailStyle] = useState({});

  useEffect(() => {
    const section = sectionRef.current;
    const leftColumn = leftColumnRef.current;
    const leftRail = leftRailRef.current;

    if (!section || !leftColumn || !leftRail) return;

    let frame = 0;

    const updateRail = () => {
      frame = 0;

      const topOffset = 0;
      const sectionRect = section.getBoundingClientRect();
      const leftColumnRect = leftColumn.getBoundingClientRect();
      const railHeight = leftRail.offsetHeight;

      if (sectionRect.top > topOffset) {
        setLeftRailStyle({});
        return;
      }

      if (sectionRect.bottom <= topOffset + railHeight) {
        setLeftRailStyle({position: 'absolute', left: 0, right: 0, bottom: 0});
        return;
      }

      setLeftRailStyle({
        position: 'fixed',
        top: topOffset,
        left: leftColumnRect.left,
        width: leftColumnRect.width,
      });
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateRail);
    };

    updateRail();
    window.addEventListener('scroll', scheduleUpdate, {passive: true});
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  return (
    <section ref={sectionRef} id="gallery" className="bg-[#cfcfcf] px-5 py-24 text-[#111] md:px-10">
      <div className="mx-auto max-w-[1440px] md:grid md:grid-cols-[minmax(240px,0.68fr)_1fr] md:items-stretch md:gap-10 lg:grid-cols-[minmax(280px,0.72fr)_1fr] lg:gap-12 xl:gap-16">
        <div ref={leftColumnRef} className="hidden md:block relative mb-8 md:mb-0">
          <div
            ref={leftRailRef}
            style={leftRailStyle}
            className="z-30 bg-[#cfcfcf] pb-5 pt-6 md:sticky md:top-0 md:pb-8 md:pt-10 lg:pt-14"
          >
            <div className="max-w-[22rem] pr-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/45">Gallery</p>
            <h2 className="mt-4 font-display text-4xl leading-[0.92] md:text-6xl lg:text-7xl">
              Our Pre-wedding Celebration.
            </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[36%_64%] items-start gap-4 md:hidden">
          <div className="sticky top-0 z-40 h-screen self-start bg-[#cfcfcf] py-5 pr-2">
            <div className="pt-1">
              <p className="text-[10px] uppercase tracking-[0.4em] text-black/45">Gallery</p>
              <h2 className="mt-4 font-display text-3xl leading-[0.92] -mr-40">
                Our Pre-wedding Celebration.
              </h2>
            </div>
          </div>
          <div className="space-y-8 py-[400px]">
            {invitation.media.gallery.map((image, index) => (
              <div key={image}>
                <GalleryCard image={image} index={index} onOpenImage={onOpenImage} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: original layout */}
        <div className="hidden md:block space-y-8 py-[200px]">
          {invitation.media.gallery.map((image, index) => (
            <div key={image}>
              <GalleryCard image={image} index={index} onOpenImage={onOpenImage} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({
  image,
  index,
  onOpenImage,
}) {
  return (
    <button
      type="button"
      onClick={() => onOpenImage(image)}
      className="block w-full bg-white/40 text-left"
    >
      <img
        src={image}
        alt={`Gallery ${index + 1}`}
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
    </button>
  );
}

function ThankYouSection({invitation}) {
  const thanksParallax = useSectionParallax({y: [-24, 30]});
  const imageFloat = useTransform(thanksParallax.progress, [0, 1], thanksParallax.shouldReduceMotion ? [0, 0] : [-18, 24]);
  const textFloat = useTransform(thanksParallax.progress, [0, 1], thanksParallax.shouldReduceMotion ? [0, 0] : [-14, 14]);
  const guestPairLabel = invitation.couple.joinedName.replace(/\s*&\s*/g, ' - ').toUpperCase();

  return (
    <section className="bg-[#000000] min-h-screen px-5 py-10 text-white md:px-10 md:py-8">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col">
        <div className="flex flex-1 items-center justify-center py-12 md:py-16">
          <RevealOnScroll className="mx-auto flex w-full max-w-[980px] flex-col items-center text-center">
            <motion.div style={{y: textFloat}} className="flex flex-col items-center justify-center gap-8 sm:gap-10 md:gap-12">
              <motion.div
                style={{y: imageFloat}}
                className="h-[44px] w-[72px] overflow-hidden bg-[#121212] shadow-[0_10px_26px_rgba(0,0,0,0.35)] sm:h-[50px] sm:w-[86px] md:h-[62px] md:w-[106px]"
              >
                <img
                  src={invitation.media.thankYouImage}
                  alt="Thank you portrait"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="flex items-end justify-center">
                <span className="font-display text-[1.65rem] leading-none tracking-[-0.04em] text-[#a9a4a0] sm:text-[2.7rem] md:text-[3.6rem] lg:text-[4.4rem]">
                  {invitation.footer.closingTitle.join(' ')}
                </span>
              </div>
            </motion.div>

              <motion.p
                style={{y: textFloat}}
               className="mt-6 max-w-[720px] font-display text-[1.1rem] leading-[1.08] tracking-[-0.02em] text-[#DEDEDE] sm:mt-7 sm:text-[1.3rem] md:text-[1.8rem] lg:text-[2.1rem]"
              >
                {invitation.footer.closingText}
              </motion.p>

            <motion.p style={{y: textFloat}} className="mt-5 text-[10px] uppercase tracking-[0.28em] text-[#8a8580] md:mt-6 md:text-[11px]">
              {guestPairLabel}
            </motion.p>
          </RevealOnScroll>
        </div>

        <div className="flex flex-col items-center gap-2 pb-3 text-center">
          <a
            href={invitation.footer.creditUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.24em] text-white/42 transition hover:text-white/80 md:text-[9px]"
          >
            {invitation.footer.creditLabel}
            <ExternalLink className="h-3 w-3" />
          </a>

          <p className="text-[8px] text-white/38 md:text-[9px]">
            &copy; All rights reserved by nvite.id
          </p>
        </div>
      </div>
    </section>
  );
}

function GiftCard({
  account,
  copiedAccount,
  onCopy,
}) {
  const copied = copiedAccount === account.id;

  return (
    <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6">
      <p className="text-[10px] uppercase tracking-[0.34em] text-white/45">{account.bank}</p>
      <h3 className="mt-6 font-display text-4xl italic text-white">{account.number}</h3>
      <p className="mt-4 text-sm leading-relaxed text-white/62">{account.holder}</p>
      <button
        type="button"
        onClick={onCopy}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/72 transition hover:border-white/18 hover:text-white"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy Number'}
      </button>
    </div>
  );
}
