import {AnimatePresence, motion} from 'framer-motion';
import {Check, ChevronLeft, ChevronRight, Copy, LoaderCircle} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';

import {
  usePointerParallax,
  useSectionParallax,
} from '@/Components/shared/CinematicParallax';
import {RevealOnScroll} from '@/Components/shared/RevealOnScroll';
import {createQrValue, getQrPreviewUrl} from '@/lib/guest';

const COMMENTS_PER_PAGE = 5;

const DEFAULT_THEME = {
  accent: '#d8b181',
  background: '#000000',
  surface: '#f4efe8',
  text: '#ffffff',
  muted: '#888888',
};

export function RsvpSection({
  invitation,
  initialGuestName,
  maxGuestsOverride,
  readOnly = false,
  theme = DEFAULT_THEME,
}) {
  const sectionParallax = useSectionParallax({y: [-36, 42]});
  const imagePointer = usePointerParallax({strength: 16, rotate: 4});
  const [guestName, setGuestName] = useState(initialGuestName);
  const [attendance, setAttendance] = useState('attending');
  const [guestCount, setGuestCount] = useState(1);
  const [wishes, setWishes] = useState('');
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const maxGuests = maxGuestsOverride ?? invitation.rsvp.maxGuestsDefault;
  const qrValue = createQrValue(invitation.slug, guestName);
  const qrPreview = getQrPreviewUrl(qrValue);
  const introY = sectionParallax.y;
  const qrTextColor = theme.background === '#000000' ? theme.background : theme.text;

  const isLightText = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.5;
  };

  const visibleRecords = useMemo(() => {
    const start = page * COMMENTS_PER_PAGE;
    return records.slice(start, start + COMMENTS_PER_PAGE);
  }, [page, records]);

  const previewRecords = useMemo(
    () => invitation.rsvp.comments.map((comment, index) => ({
      id: `preview-${index}`,
      invitation_id: 'template-preview',
      guest_name: comment.guestName,
      attendance: 'attending',
      guest_count: 1,
      wishes: comment.wishes,
      qr_value: null,
      created_at: comment.createdAt,
    })),
    [invitation.rsvp.comments],
  );

  const totalPages = Math.max(1, Math.ceil(records.length / COMMENTS_PER_PAGE));

  useEffect(() => {
    setGuestName(initialGuestName);
  }, [initialGuestName]);

  useEffect(() => {
    if (readOnly) {
      setRecords(previewRecords);
      setLoadError(null);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        const res = await fetch(`/i/${invitation.slug}/rsvps`);
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if (active) setRecords(data);
      } catch {
        if (active) {
          setLoadError('Unable to load wishes right now. You can still send your RSVP.');
        }
      }
    };
    void load();

    return () => {
      active = false;
    };
  }, [invitation.slug, previewRecords, readOnly]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (readOnly) {
      setSubmitMessage('Template preview mode. RSVP submission is disabled on this page.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch(`/i/${invitation.slug}/rsvp`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          guest_name: guestName.trim(),
          attendance,
          guest_count: attendance === 'attending' ? guestCount : 0,
          wishes: wishes.trim(),
          qr_value: qrValue,
        }),
      });

      if (!response.ok) {
        setSubmitMessage('We could not submit your RSVP. Please try again in a moment.');
      } else {
        const data = await response.json();
        setRecords((current) => [data, ...current]);
        setPage(0);
        setSubmitMessage('Your RSVP has been recorded. Thank you for celebrating with us.');
        setWishes('');
        setAttendance('attending');
        setGuestCount(1);
      }
    } catch {
      setSubmitMessage('We could not submit your RSVP. Please try again in a moment.');
    }

    setIsSubmitting(false);
  };

  return (
    <section ref={sectionParallax.ref} id="rsvp" className="border-t px-5 py-24 md:px-10" style={{background: theme.background, color: theme.text}}>
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-2 lg:gap-8">
        <RevealOnScroll className="self-start">
          <motion.img
            {...imagePointer.bind}
            style={{...sectionParallax.style, ...imagePointer.style}}
            src={invitation.media.rsvpImage}
            alt={`${invitation.couple.joinedName} portrait`}
            className="w-full scale-[0.7] object-contain object-top"
            referrerPolicy="no-referrer"
          />
        </RevealOnScroll>

        <div className="space-y-8">
          <RevealOnScroll>
            <motion.h2 style={{y: introY}} className="font-display text-xl leading-relaxed md:text-3xl">
              We kindly request your prompt response to confirm your attendance at our upcoming event. Alongside your RSVP, please take a moment to extend your warm regards and best wishes.
            </motion.h2>
          </RevealOnScroll>

          <RevealOnScroll className="p-6 md:p-8">
            <div style={{
              '--input-bg': theme.text + '08',
              '--input-color': theme.text,
              '--input-border': theme.text + '30',
              '--input-focus': theme.accent,
              '--input-focus-bg': theme.text + '10',
              '--input-placeholder': theme.muted ? theme.muted + 'aa' : theme.text + '80',
            }}>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <Field label="Name" theme={theme}>
                  <input
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    className="invitation-input"
                    placeholder="Guest Name"
                    required
                  />
                </Field>

                <div className="p-5" style={{background: theme.surface, color: theme.text}}>
                  <p className="text-[10px] uppercase tracking-[0.35em]" style={{color: qrTextColor + 'aa'}}>
                    {invitation.couple.coverLabel}
                  </p>
                  <h3 className="mt-3 font-display text-3xl italic md:text-4xl" style={{color: qrTextColor}}>
                    {invitation.couple.joinedName}
                  </h3>
                  <div className="mt-6 flex flex-col items-center gap-5 text-center">
                    {invitation.rsvp.qr_enabled !== false && (
                      <>
                        <img src={qrPreview} alt="QR preview" className="h-40 w-40 border p-2" style={{borderColor: qrTextColor + '20', background: 'white'}} />
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.35em]" style={{color: qrTextColor + 'aa'}}>Dear</p>
                          <p className="mt-2 font-display text-3xl italic" style={{color: qrTextColor}}>{guestName || 'Guest Name'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(qrValue);
                              setCopiedId(qrValue);
                              window.setTimeout(() => setCopiedId(null), 2000);
                            } catch {
                              setSubmitMessage('Copy is unavailable on this device/browser.');
                            }
                          }}
                          className="inline-flex items-center gap-2 border px-4 py-2 text-[10px] uppercase tracking-[0.32em] transition"
                          style={{borderColor: qrTextColor + '30', color: qrTextColor + 'cc'}}
                        >
                          {copiedId === qrValue ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          Copy check-in code
                        </button>
                        <p className="max-w-sm text-sm leading-relaxed" style={{color: qrTextColor + 'b3'}}>
                          Scan this QR code at the event for check-in. If it does not appear, please state your name upon arrival.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <Field label="Attendance" theme={theme}>
                  <div role="radiogroup" aria-label="Attendance" className="grid gap-3 sm:grid-cols-2">
                    {[
                      {label: 'Excited to Attend', value: 'attending'},
                      {label: 'Unable to Attend', value: 'not_attending'},
                    ].map((option) => {
                      const active = attendance === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          aria-pressed={active}
                          onClick={() => setAttendance(option.value)}
                          className="rounded-[1.25rem] border px-4 py-3 text-left text-sm transition"
                          style={{
                            ...(active ? {
                              borderColor: theme.text,
                              background: theme.text,
                              color: isLightText(theme.text) ? '#000000' : '#ffffff',
                            } : {
                              borderColor: theme.text + '30',
                              background: theme.text + '08',
                              color: theme.text + 'bf',
                            }),
                          }}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <AnimatePresence initial={false}>
                  {attendance === 'attending' && (
                    <motion.div
                      initial={{opacity: 0, height: 0}}
                      animate={{opacity: 1, height: 'auto'}}
                      exit={{opacity: 0, height: 0}}
                      className="overflow-hidden"
                    >
                      <Field label={`No of Guest (Max ${maxGuests})`} theme={theme}>
                        <input
                          type="number"
                          min={1}
                          max={maxGuests}
                          value={guestCount}
                          onChange={(event) =>
                            setGuestCount(
                              Math.max(1, Math.min(maxGuests, Number(event.target.value))),
                            )
                          }
                          className="invitation-input"
                        />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field label="Wishes" theme={theme}>
                  <textarea
                    value={wishes}
                    onChange={(event) => setWishes(event.target.value)}
                    className="invitation-input min-h-32 resize-y"
                    placeholder="Share a note for the couple"
                    rows={4}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting || readOnly}
                  className="inline-flex items-center gap-3 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.34em] transition disabled:cursor-not-allowed disabled:opacity-60"
                  style={{background: theme.accent, color: isLightText(theme.accent) ? '#000000' : '#ffffff'}}
                >
                  {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  Submit RSVP
                </button>

                {readOnly ? (
                  <p className="text-sm leading-relaxed" style={{color: theme.muted || theme.text + 'aa'}}>
                    Template preview mode: RSVP is disabled here.
                  </p>
                ) : null}

                {submitMessage ? (
                  <p className="text-sm leading-relaxed" style={{color: theme.muted || theme.text + 'aa'}}>{submitMessage}</p>
                ) : null}
              </form>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <RevealOnScroll className="mx-auto mt-16 max-w-[1440px]">
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em]" style={{color: theme.muted || theme.text + '88'}}>Wishes</p>
              <h3 className="mt-3 font-display text-4xl italic md:text-5xl" style={{color: theme.text}}>Messages for the Couple</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-[10px] uppercase tracking-[0.32em] sm:block" style={{color: theme.muted || theme.text + '88'}}>
                Page {page + 1} of {totalPages}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {loadError ? (
              <p className="text-sm" style={{color: theme.muted || theme.text + '99'}}>
                {loadError}
              </p>
            ) : null}

            {!loadError && visibleRecords.length === 0 ? (
              <p className="text-sm" style={{color: theme.muted || theme.text + '99'}}>
                No wishes yet. Be the first guest to leave a message.
              </p>
            ) : null}

            {visibleRecords.map((record) => (
              <article
                key={record.id}
                className="space-y-3 pb-6 border-b"
                style={{borderColor: theme.text + '20'}}
              >
                <div className="flex items-start justify-between gap-4">
                  <strong className="font-copy text-base font-medium" style={{color: theme.text}}>{record.guest_name}</strong>
                  <small className="shrink-0 text-[10px] uppercase tracking-[0.24em]" style={{color: theme.muted || theme.text + '80'}}>
                    {new Date(record.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </small>
                </div>
                <p className="text-sm leading-relaxed" style={{color: theme.muted || theme.text + 'b3'}}>
                  {record.wishes || 'Will celebrate with joy and gratitude.'}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border-t pt-5" style={{borderColor: theme.text + '20'}}>
            <span className="text-[10px] uppercase tracking-[0.32em] sm:hidden" style={{color: theme.muted || theme.text + '88'}}>
              Page {page + 1} / {totalPages}
            </span>
            <div className="ml-auto flex gap-3">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                className="border p-3 transition disabled:cursor-not-allowed disabled:opacity-30"
                style={{borderColor: theme.text + '30', color: theme.text + 'cc'}}
                aria-label="Previous comments page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                className="border p-3 transition disabled:cursor-not-allowed disabled:opacity-30"
                style={{borderColor: theme.text + '30', color: theme.text + 'cc'}}
                aria-label="Next comments page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}

function Field({label, children, theme}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] uppercase tracking-[0.32em]" style={{color: theme.muted || theme.text + '88'}}>{label}</span>
      {children}
    </label>
  );
}
