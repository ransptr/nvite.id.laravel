import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Eye,
  LoaderCircle,
  Plus,
  Trash2,
  X,
  Heart,
  Calendar,
  BookOpen,
  MapPin,
  Gift,
  Image as ImageIcon,
  Settings,
  Smartphone,
  Monitor,
  Maximize2,
  FileText
} from 'lucide-react';

import { useInvitations } from '@/hooks/useInvitations';
import { useAuth } from '@/hooks/useAuth';
import { PhotoUpload } from '@/Components/shared/PhotoUpload';
import { DateTimeInput } from '@/Components/shared/DateTimeInput';
import { getTemplateBySlug } from '@/lib/templates';

import { cn } from '@/lib/utils';

// ── Default template (Lumière) ────────────────────────────────────────────────
const DEFAULT_CONTENT = {
  slug: '',
  seo: { title: 'Our Wedding', description: 'Join us to celebrate our special day.' },
  theme: { accent: '#d8b181', background: '#050505', surface: '#111111', softSurface: '#e7e1db' },
  guestQueryParam: 'to',
  couple: {
    joinedName: 'Partner A & Partner B',
    coverLabel: 'THE WEDDING OF',
    dateLabel: 'Saturday, 1 January 2027',
    scripture: {
      text: "But at the beginning of creation God 'made them male and female.' 'For this reason a man will leave his father and mother and be united to his wife, and the two will become one flesh.'",
      citation: 'Mark 10:6-7',
    },
    quote: 'Two are better than one, for they have a good return for their labor.',
    bride: {
      title: 'THE BRIDE',
      fullName: '',
      nickname: '',
      parents: ['The Daughter of', '', ''],
      instagram: '',
      image: '',
    },
    groom: {
      title: 'THE GROOM',
      fullName: '',
      nickname: '',
      parents: ['The Son of', '', ''],
      instagram: '',
      image: '',
    },
  },
  media: {
    audio: '',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    heroVideo: '',
    heroPoster: '',
    quoteImages: [],
    storyImages: [],
    giftImage: '',
    rsvpImage: '',
    videoPoster: '',
    filmPoster: '',
    videoUrl: '',
    thankYouImage: '',
    gallery: [],
    ogImage: '',
  },
  story: { title: 'Our Love Story', timeline: [] },
  countdown: {
    label: 'Almost Time For Our Celebration',
    target: '2027-01-01T09:00:00+07:00',
    calendar: {
      title: 'Our Wedding',
      description: 'Join us for our wedding celebration.',
      location: '',
      start: '2027-01-01T09:00:00+07:00',
      end: '2027-01-01T12:00:00+07:00',
    },
    image: '',
  },
  events: {
    title: 'Wedding / Details',
    dateLabel: 'Saturday\n01.01.2027',
    details: [],
  },
  gift: {
    intro: 'For those of you who want to give a token of love, you can use the account number below:',
    accounts: [],
  },
  rsvp: {
    intro: 'We kindly request your response to confirm your attendance.',
    maxGuestsDefault: 2,
    comments: [],
  },
  footer: {
    closingTitle: ['Thank', 'You'],
    closingText: 'It is a pleasure and honor for us if you are willing to attend and give us your blessing.',
    creditLabel: 'By nvite.id',
    creditUrl: 'https://nvite.id',
    links: [],
  },
};

// ── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'couple', label: 'Couple', icon: Heart },
  { id: 'date', label: 'Date & Venue', icon: Calendar },
  { id: 'story', label: 'Story', icon: BookOpen },
  { id: 'events', label: 'Events', icon: MapPin },
  { id: 'gifts', label: 'Gifts', icon: Gift },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function deepMerge(base, overrides) {
  const result = { ...base };
  for (const key of Object.keys(overrides)) {
    const v = overrides[key];
    if (v !== undefined && v !== null) {
      if (typeof v === 'object' && !Array.isArray(v) && typeof result[key] === 'object' && !Array.isArray(result[key])) {
        result[key] = deepMerge(result[key], v);
      } else {
        result[key] = v;
      }
    }
  }
  return result;
}

// ── Field component ───────────────────────────────────────────────────────────
function Field({ label, children, hint }) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7a6e]">{label}</span>
      {children}
      {hint && <p className="text-[10px] leading-relaxed text-[#b0a095]">{hint}</p>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, className, readOnly }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      className={cn(
        'w-full rounded-xl border border-[#e8ddd4] bg-white px-4 py-2.5 text-sm font-medium text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-4 focus:ring-[#c9974a]/10',
        readOnly && 'bg-[#f5f0eb] text-[#9a9088] cursor-not-allowed',
        className
      )}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y rounded-xl border border-[#e8ddd4] bg-white px-4 py-2.5 text-sm font-medium text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-4 focus:ring-[#c9974a]/10"
    />
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-4 w-1 rounded-full bg-[#c9974a]" />
        <h3 className="text-[10px] font-display uppercase tracking-[0.25em] text-[#1a1612]">
          {title}
        </h3>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

// ── Tab panels ────────────────────────────────────────────────────────────────

function CoupleTab({ c, userId, invId, onChange }) {
  const couple = c.couple;
  const set = (path, value) => {
    const next = JSON.parse(JSON.stringify(couple));
    let cur = next;
    for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
    cur[path[path.length - 1]] = value;
    onChange({ couple: next });
  };

  return (
    <div className="space-y-12">
      <Section title="General">
        <Field label="Joined Name" hint="The primary title shown on the invitation cover (will use first two names with space in between).">
          <TextInput
            value={couple.joinedName}
            onChange={(v) => set(['joinedName'], v)}
            placeholder="e.g. Dexter Hualin"
          />
        </Field>
        <Field label="Cover Label">
          <TextInput value={couple.coverLabel} onChange={(v) => set(['coverLabel'], v)} />
        </Field>
        <Field label="Scripture text">
          <TextArea value={couple.scripture.text} onChange={(v) => set(['scripture', 'text'], v)} rows={3} />
        </Field>
        <Field label="Scripture citation">
          <TextInput value={couple.scripture.citation} onChange={(v) => set(['scripture', 'citation'], v)} placeholder="e.g. Mark 10:6-9" />
        </Field>
        <Field label="Quote">
          <TextArea value={couple.quote} onChange={(v) => set(['quote'], v)} rows={2} />
        </Field>
      </Section>

      <div className="h-[1px] bg-[#f0ebe4]" />

      {(['bride', 'groom']).map((role) => (
        <Section key={role} title={role === 'bride' ? 'Bride Profile' : 'Groom Profile'}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name">
              <TextInput value={couple[role].fullName} onChange={(v) => set([role, 'fullName'], v)} />
            </Field>
            <Field label="Nickname">
              <TextInput value={couple[role].nickname} onChange={(v) => set([role, 'nickname'], v)} />
            </Field>
          </div>
          <div className="space-y-4">
            <Field label="Parents Information">
              <div className="space-y-3">
                <TextInput value={couple[role].parents[0] ?? ''} placeholder="Relationship (e.g. The Daughter of)" onChange={(v) => {
                  const p = [...couple[role].parents];
                  p[0] = v;
                  set([role, 'parents'], p);
                }} />
                <div className="grid grid-cols-2 gap-3">
                  <TextInput value={couple[role].parents[1] ?? ''} placeholder="Father's Name" onChange={(v) => {
                    const p = [...couple[role].parents];
                    p[1] = v;
                    set([role, 'parents'], p);
                  }} />
                  <TextInput value={couple[role].parents[2] ?? ''} placeholder="Mother's Name" onChange={(v) => {
                    const p = [...couple[role].parents];
                    p[2] = v;
                    set([role, 'parents'], p);
                  }} />
                </div>
              </div>
            </Field>
          </div>
          <Field label="Instagram URL">
            <TextInput value={couple[role].instagram ?? ''} onChange={(v) => set([role, 'instagram'], v)} placeholder="https://instagram.com/..." />
          </Field>
          <div className="pt-2">
            <Field label={`${role === 'bride' ? 'Bride' : 'Groom'} Portrait`}>
              <PhotoUpload
                currentUrl={couple[role].image}
                onUploaded={(url) => set([role, 'image'], url)}
                label="Click to upload portrait"
              />
            </Field>
          </div>
        </Section>
      ))}
    </div>
  );
}

function DateTab({ c, onChange }) {
  return (
    <div className="space-y-8">
      <Section title="Display Labels">
        <Field label="Date label (shown on cover)" hint="e.g. Friday, 21 August 2026">
          <TextInput value={c.couple.dateLabel} onChange={(v) => onChange({ couple: { ...c.couple, dateLabel: v } })} />
        </Field>
        <Field label="Countdown target" hint="Date and time for the countdown">
          <DateTimeInput value={c.countdown.target} onChange={(v) => onChange({ countdown: { ...c.countdown, target: v } })} />
        </Field>
        <Field label="Events date label" hint="Shown in the events section, can include newline \\n">
          <TextInput value={c.events.dateLabel} onChange={(v) => onChange({ events: { ...c.events, dateLabel: v } })} />
        </Field>
      </Section>

      <Section title="Calendar Event">
        <Field label="Event title">
          <TextInput value={c.countdown.calendar.title} onChange={(v) => onChange({ countdown: { ...c.countdown, calendar: { ...c.countdown.calendar, title: v } } })} />
        </Field>
        <Field label="Description">
          <TextArea value={c.countdown.calendar.description} onChange={(v) => onChange({ countdown: { ...c.countdown, calendar: { ...c.countdown.calendar, description: v } } })} rows={2} />
        </Field>
        <Field label="Location">
          <TextArea value={c.countdown.calendar.location} onChange={(v) => onChange({ countdown: { ...c.countdown, calendar: { ...c.countdown.calendar, location: v } } })} rows={2} />
        </Field>
        <Field label="Start">
          <DateTimeInput value={c.countdown.calendar.start} onChange={(v) => onChange({ countdown: { ...c.countdown, calendar: { ...c.countdown.calendar, start: v } } })} />
        </Field>
        <Field label="End">
          <DateTimeInput value={c.countdown.calendar.end} onChange={(v) => onChange({ countdown: { ...c.countdown, calendar: { ...c.countdown.calendar, end: v } } })} />
        </Field>
      </Section>
    </div>
  );
}

function StoryTab({ c, onChange }) {
  const timeline = c.story.timeline;
  const [visible, setVisible] = useState(c.story.visible ?? true);
  const update = (entries) => onChange({ story: { ...c.story, timeline: entries } });

  const addEntry = () => update([...timeline, { year: '', title: '', body: '' }]);
  const removeEntry = (i) => update(timeline.filter((_, idx) => idx !== i));
  const setEntry = (i, field, val) => {
    const next = timeline.map((e, idx) => idx === i ? { ...e, [field]: val } : e);
    update(next);
  };

  return (
    <div className="space-y-6">
      <Section title="Story">
        <Field label="Section title">
          <TextInput value={c.story.title} onChange={(v) => onChange({ story: { ...c.story, title: v } })} />
        </Field>
      </Section>

      <Section title="Timeline Entries">
        <div className="space-y-6">
          {timeline.map((entry, i) => (
            <div key={i} className="group relative space-y-4 rounded-2xl border border-[#e8ddd4] bg-white p-6 shadow-sm transition hover:border-[#c9974a]/40">
              <button type="button" onClick={() => removeEntry(i)} className="absolute right-4 top-4 rounded-lg p-1.5 text-[#c4b9af] transition hover:bg-red-50 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Field label="Year">
                    <TextInput value={entry.year} onChange={(v) => setEntry(i, 'year', v)} placeholder="2024" />
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field label="Title">
                    <TextInput value={entry.title} onChange={(v) => setEntry(i, 'title', v)} />
                  </Field>
                </div>
              </div>
              <Field label="Story Description">
                <TextArea value={entry.body} onChange={(v) => setEntry(i, 'body', v)} rows={4} />
              </Field>
            </div>
          ))}
          <button type="button" onClick={addEntry} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e8ddd4] py-4 text-xs font-bold uppercase tracking-widest text-[#8a7a6e] transition hover:border-[#c9974a] hover:text-[#c9974a] hover:bg-[#fdf5e8]/30">
            <Plus className="h-4 w-4" /> Add Timeline Event
          </button>
        </div>
      </Section>
      <div className="rounded-2xl border border-[#e8ddd4] bg-[#fdfaf6] p-6 transition group hover:bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-[#c9974a] transition">
              <Eye className="h-5 w-5 text-[#c9974a] group-hover:text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1a1612]">Section Visible</p>
              <p className="text-[10px] text-[#8a7a6e]">Show this section to visitors</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !visible;
              setVisible(next);
              onChange({ story: { ...c.story, visible: next } });
            }}
            className={cn(
              'h-6 w-12 cursor-pointer rounded-full p-1 transition',
              visible ? 'bg-[#c9974a]' : 'bg-[#c4b9af]'
            )}
          >
            <div className={cn(
              'h-4 w-4 rounded-full bg-white shadow-sm transition',
              visible ? 'ml-auto' : 'mr-auto'
            )} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EventsTab({ c, onChange }) {
  const details = c.events.details;
  const update = (d) => onChange({ events: { ...c.events, details: d } });

  const add = () => update([...details, { title: '', time: '', location: '', text: '', link: '', linkLabel: '' }]);
  const remove = (i) => update(details.filter((_, idx) => idx !== i));
  const set = (i, field, val) => {
    update(details.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  };

  return (
    <div className="space-y-6">
      <Section title="Events section">
        <Field label="Section title">
          <TextInput value={c.events.title} onChange={(v) => onChange({ events: { ...c.events, title: v } })} />
        </Field>
      </Section>

      <Section title="Event Cards">
        <div className="space-y-6">
          {details.map((detail, i) => (
            <div key={i} className="group relative space-y-5 rounded-2xl border border-[#e8ddd4] bg-white p-6 shadow-sm transition hover:border-[#c9974a]/40">
              <button type="button" onClick={() => remove(i)} className="absolute right-4 top-4 rounded-lg p-1.5 text-[#c4b9af] transition hover:bg-red-50 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Event Title"><TextInput value={detail.title} onChange={(v) => set(i, 'title', v)} /></Field>
                <Field label="Time"><TextInput value={detail.time ?? ''} onChange={(v) => set(i, 'time', v)} placeholder="e.g. 8 AM - 10 AM" /></Field>
              </div>

              <Field label="Location Name / Venue Name"><TextArea value={detail.location ?? ''} onChange={(v) => set(i, 'location', v)} rows={2} /></Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Action Link (Map/URL)"><TextInput value={detail.link ?? ''} onChange={(v) => set(i, 'link', v)} placeholder="https://maps.app.goo.gl/..." /></Field>
                <Field label="Link Label"><TextInput value={detail.linkLabel ?? ''} onChange={(v) => set(i, 'linkLabel', v)} placeholder="Open in Maps" /></Field>
              </div>

              <Field label="Additional Information"><TextArea value={detail.text ?? ''} onChange={(v) => set(i, 'text', v)} rows={2} /></Field>
            </div>
          ))}
          <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e8ddd4] py-4 text-xs font-bold uppercase tracking-widest text-[#8a7a6e] transition hover:border-[#c9974a] hover:text-[#c9974a] hover:bg-[#fdf5e8]/30">
            <Plus className="h-4 w-4" /> Add Celebration Event
          </button>
        </div>
      </Section>
    </div>
  );
}

function GiftsTab({ c, onChange }) {
  const accounts = c.gift.accounts;
  const [visible, setVisible] = useState(c.gift.visible ?? true);
  const update = (a) => onChange({ gift: { ...c.gift, accounts: a } });
  const add = () => update([...accounts, { id: `acc-${Date.now()}`, bank: '', number: '', holder: '' }]);
  const remove = (i) => update(accounts.filter((_, idx) => idx !== i));
  const set = (i, field, val) => {
    update(accounts.map((a, idx) => idx === i ? { ...a, [field]: val } : a));
  };

  return (
    <div className="space-y-12">
      <Section title="Gifting Experience">
        <Field label="Intro Text" hint="Explain to guests how they can send gifts or tokens of love.">
          <TextArea value={c.gift.intro} onChange={(v) => onChange({ gift: { ...c.gift, intro: v } })} rows={3} />
        </Field>
      </Section>

      <div className="h-[1px] bg-[#f0ebe4]" />

      <Section title="Digital Wallets & Bank Accounts">
        <div className="space-y-6">
          {accounts.map((acc, i) => (
            <div key={acc.id} className="group relative space-y-4 rounded-2xl border border-[#e8ddd4] bg-white p-6 shadow-sm transition hover:border-[#c9974a]/40">
              <button type="button" onClick={() => remove(i)} className="absolute right-4 top-4 rounded-lg p-1.5 text-[#c4b9af] transition hover:bg-red-50 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Bank / Wallet Name"><TextInput value={acc.bank} onChange={(v) => set(i, 'bank', v)} placeholder="e.g. Bank Mandiri" /></Field>
                <Field label="Account Holder"><TextInput value={acc.holder} onChange={(v) => set(i, 'holder', v)} /></Field>
              </div>
              <Field label="Account Number"><TextInput value={acc.number} onChange={(v) => set(i, 'number', v)} placeholder="0000 8888 1234" /></Field>
            </div>
          ))}
          <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e8ddd4] py-4 text-xs font-bold uppercase tracking-widest text-[#8a7a6e] transition hover:border-[#c9974a] hover:text-[#c9974a] hover:bg-[#fdf5e8]/30">
            <Plus className="h-4 w-4" /> Add Payment Method
          </button>
        </div>
      </Section>
      <div className="rounded-2xl border border-[#e8ddd4] bg-[#fdfaf6] p-6 transition group hover:bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-[#c9974a] transition">
              <Eye className="h-5 w-5 text-[#c9974a] group-hover:text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1a1612]">Section Visible</p>
              <p className="text-[10px] text-[#8a7a6e]">Show this section to visitors</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !visible;
              setVisible(next);
              onChange({ gift: { ...c.gift, visible: next } });
            }}
            className={cn(
              'h-6 w-12 cursor-pointer rounded-full p-1 transition',
              visible ? 'bg-[#c9974a]' : 'bg-[#c4b9af]'
            )}
          >
            <div className={cn(
              'h-4 w-4 rounded-full bg-white shadow-sm transition',
              visible ? 'ml-auto' : 'mr-auto'
            )} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MediaTab({ c, userId, invId, onChange }) {
  const m = c.media;
  const setMedia = (field, val) => {
    onChange({ media: { ...m, [field]: val } });
  };

  const updateGalleryItem = (i, url) => {
    const next = [...m.gallery];
    next[i] = url;
    setMedia('gallery', next);
  };

  const addGallerySlot = () => setMedia('gallery', [...m.gallery, '']);
  const removeGalleryItem = (i) => setMedia('gallery', m.gallery.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-12">
      <Section title="Key Visuals">
        <div className="grid grid-cols-2 gap-6">
          <Field label="Main Cover Image">
            <PhotoUpload currentUrl={m.coverImage} onUploaded={(url) => setMedia('coverImage', url)} label="Upload cover" />
          </Field>
          <Field label="RSVP Section Photo">
            <PhotoUpload currentUrl={m.rsvpImage} onUploaded={(url) => setMedia('rsvpImage', url)} label="Upload RSVP photo" />
          </Field>
          <Field label="Gift Section Photo">
            <PhotoUpload currentUrl={m.giftImage} onUploaded={(url) => setMedia('giftImage', url)} label="Upload gift photo" />
          </Field>
          <Field label="Closing / Thank You">
            <PhotoUpload currentUrl={m.thankYouImage} onUploaded={(url) => setMedia('thankYouImage', url)} label="Upload closing photo" />
          </Field>
          <Field label="Social Sharing Image" hint="Shown when link is shared on WhatsApp, Twitter, etc. Recommended size: 1200x630px.">
            <PhotoUpload currentUrl={m.ogImage} onUploaded={(url) => setMedia('ogImage', url)} label="Upload OG image" />
          </Field>
        </div>
      </Section>

      <div className="h-[1px] bg-[#f0ebe4]" />

      <Section title="Quote & Story Visuals">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <PhotoUpload key={i} currentUrl={m.quoteImages[i]} onUploaded={(url) => {
                const next = [...m.quoteImages];
                next[i] = url;
                setMedia('quoteImages', next);
              }} label={`Quote ${i + 1}`} />
            ))}
          </div>
          <Field label="Hero Video Poster">
            <PhotoUpload currentUrl={m.heroPoster} onUploaded={(url) => setMedia('heroPoster', url)} label="Upload video poster" />
          </Field>
          <Field label="Countdown Section Image">
            <PhotoUpload currentUrl={c.countdown.image} onUploaded={(url) => onChange({ countdown: { ...c.countdown, image: url } })} label="Upload countdown image" />
          </Field>
        </div>
      </Section>

      <div className="h-[1px] bg-[#f0ebe4]" />

      <Section title="Photo Gallery">
        <div className="grid grid-cols-2 gap-4">
          {m.gallery.map((url, i) => (
            <div key={i} className="group relative rounded-2xl border border-[#e8ddd4] bg-white p-2 transition hover:border-[#c9974a]">
              <PhotoUpload currentUrl={url} onUploaded={(u) => updateGalleryItem(i, u)} label={`Image ${i + 1}`} />
              <button type="button" onClick={() => removeGalleryItem(i)} className="absolute right-2 top-2 z-10 rounded-lg bg-white/80 p-1.5 text-[#c4b9af] backdrop-blur-sm transition hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addGallerySlot} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e8ddd4] py-4 text-xs font-bold uppercase tracking-widest text-[#8a7a6e] transition hover:border-[#c9974a] hover:text-[#c9974a] hover:bg-[#fdf5e8]/30">
          <Plus className="h-4 w-4" /> Add Gallery Photo
        </button>
      </Section>

      <div className="h-[1px] bg-[#f0ebe4]" />

      <Section title="Video & Background Music">
        <div className="space-y-6">
          <Field label="Hero Video URL" hint="Use a direct MP4/WebM file URL or upload a video file below. YouTube is not supported here.">
            {m.heroVideo ? (
              <div className="flex items-center gap-2 rounded-xl border border-[#c9974a]/30 bg-[#c9974a]/10 px-4 py-2.5">
                <span className="text-sm font-medium text-[#c9974a]">✓ Video uploaded</span>
                <button type="button" onClick={() => setMedia('heroVideo', '')} className="ml-auto text-xs text-[#8a7a6e] hover:text-[#c9974a]">Remove</button>
              </div>
            ) : (
              <TextInput value={m.heroVideo} onChange={(v) => setMedia('heroVideo', v)} placeholder="https://..." />
            )}
          </Field>
          <PhotoUpload
            currentUrl={m.heroVideo}
            onUploaded={(url) => setMedia('heroVideo', url)}
            label="Upload hero video"
            accept="video/*"
            kind="video"
          />
          <Field label="Film Video URL" hint="For the Play Film modal. Supports YouTube watch, youtu.be, shorts, live, and embed links.">
            <TextInput value={m.videoUrl} onChange={(v) => setMedia('videoUrl', v)} placeholder="https://www.youtube.com/watch?v=..." />
          </Field>
          <PhotoUpload
            currentUrl={m.filmPoster}
            onUploaded={(url) => setMedia('filmPoster', url)}
            label="Upload film poster"
          />
          <Field label="Background Audio URL" hint="Use a direct MP3/M4A/WAV file URL or upload audio below.">
            {m.audio ? (
              <div className="flex items-center gap-2 rounded-xl border border-[#c9974a]/30 bg-[#c9974a]/10 px-4 py-2.5">
                <span className="text-sm font-medium text-[#c9974a]">✓ Audio uploaded</span>
                <button type="button" onClick={() => setMedia('audio', '')} className="ml-auto text-xs text-[#8a7a6e] hover:text-[#c9974a]">Remove</button>
              </div>
            ) : (
              <TextInput value={m.audio} onChange={(v) => setMedia('audio', v)} placeholder="https://..." />
            )}
          </Field>
          <PhotoUpload
            currentUrl={m.audio}
            onUploaded={(url) => setMedia('audio', url)}
            label="Upload background audio"
            accept="audio/*"
            kind="audio"
          />
        </div>
      </Section>
    </div>
  );
}

const TEMPLATE_OPTIONS = [
  { slug: 'lumiere', label: 'Lumière', desc: 'Dark & cinematic' },
  { slug: 'bloom', label: 'Bloom', desc: 'Floral & airy' },
  { slug: 'sage', label: 'Sage', desc: 'Botanical & calm' },
  { slug: 'onyx', label: 'Onyx', desc: 'Minimal & bold' },
];
const THEME_PRESETS = {
  lumiere: { accent: '#d8b181', background: '#050505', surface: '#111111', softSurface: '#e7e1db' },
  bloom: { accent: '#d4896a', background: '#fdf6ee', surface: '#f5e6d8', softSurface: '#fff8f3' },
  sage: { accent: '#6b8c5e', background: '#f4f7f0', surface: '#dfebd5', softSurface: '#f0f4ec' },
  onyx: { accent: '#e0e0e0', background: '#0a0a0a', surface: '#1a1612', softSurface: '#f5f5f5' },
};

function SettingsTab({
  c,
  invId,
  isNew,
  onChange,
  slugError,
  onSlugBlur,
}) {
  const activeTemplate = c.template ?? 'lumiere';

  const switchTemplate = (slug) => {
    const preset = THEME_PRESETS[slug] ?? THEME_PRESETS.lumiere;
    onChange({ template: slug, theme: preset });
  };

  return (
    <div className="space-y-10">
      <Section title="Design Template">
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATE_OPTIONS.map((opt) => (
            <button
              key={opt.slug}
              type="button"
              onClick={() => switchTemplate(opt.slug)}
              className={cn(
                'flex flex-col gap-1 rounded-2xl border-2 p-4 text-left transition',
                activeTemplate === opt.slug
                  ? 'border-[#c9974a] bg-[#fdf5e8] ring-4 ring-[#c9974a]/10'
                  : 'border-[#e8ddd4] bg-white hover:border-[#d9c4a4]',
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1612]">{opt.label}</span>
              <span className="text-[10px] text-[#8a7a6e]">{opt.desc}</span>
              {activeTemplate === opt.slug && (
                <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#c9974a]">
                  <Check className="h-3 w-3" /> Active
                </div>
              )}
            </button>
          ))}
        </div>
      </Section>

      <div className="h-[1px] bg-[#f0ebe4]" />

      <Section title="Theme Colors">
        <p className="text-[10px] font-medium text-[#b0a095]">Individual color overrides. Template switch resets these.</p>
        <div className="space-y-4">
          {(
            [
              { key: 'accent', label: 'Accent Color' },
              { key: 'background', label: 'Background' },
              { key: 'surface', label: 'Surface' },
              { key: 'softSurface', label: 'Soft Surface' },
            ]
          ).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-[#e8ddd4] bg-[#fdfaf6]/50 p-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a7a6e]">{label}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-medium text-[#8a7a6e]">{c.theme[key]}</span>
                <input
                  type="color"
                  value={c.theme[key]}
                  onChange={(e) => onChange({ theme: { ...c.theme, [key]: e.target.value } })}
                  className="h-8 w-10 cursor-pointer rounded-lg border border-[#e8ddd4] p-0.5"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="h-[1px] bg-[#f0ebe4]" />

      <Section title="URL Settings">
        <Field
          label="Invitation Slug"
          hint={`Your invitation will be available at nvite.id/${c.slug || 'your-slug'}`}
        >
          <div className="relative">
            <TextInput
              value={c.slug}
              onChange={(v) => onChange({ slug: v.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') })}
              placeholder="e.g. dexter-hualin"
              className={cn(
                "pl-16",
                slugError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''
              )}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#b0a095]">
              /
            </div>
          </div>
          {slugError && <p className="mt-1 text-xs text-red-500 font-medium">{slugError}</p>}
        </Field>
      </Section>

      <div className="h-[1px] bg-[#f0ebe4]" />

      <Section title="SEO & Sharing">
        <Field label="Page Title">
          <TextInput value={c.seo.title} onChange={(v) => onChange({ seo: { ...c.seo, title: v } })} placeholder="The Wedding of Dexter & Hualin" />
        </Field>
        <Field label="Meta Description">
          <TextArea value={c.seo.description} onChange={(v) => onChange({ seo: { ...c.seo, description: v } })} rows={2} />
        </Field>
      </Section>

      <div className="h-[1px] bg-[#f0ebe4]" />

      <Section title="RSVP & Prayer">
        <Field label="RSVP intro text">
          <TextArea value={c.rsvp.intro} onChange={(v) => onChange({ rsvp: { ...c.rsvp, intro: v } })} rows={3} />
        </Field>
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={c.rsvp.qr_enabled ?? false}
            onClick={() => onChange({ rsvp: { ...c.rsvp, qr_enabled: !(c.rsvp.qr_enabled ?? false) } })}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
              (c.rsvp.qr_enabled ?? false) ? 'bg-[#c9974a]' : 'bg-[#e8ddd4]'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                (c.rsvp.qr_enabled ?? false) ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7a6e]">
            Show QR Code on RSVP confirmation
          </span>
        </div>
      </Section>

      <Section title="Footer">
        <Field label="Closing text">
          <TextArea value={c.footer.closingText} onChange={(v) => onChange({ footer: { ...c.footer, closingText: v } })} rows={2} />
        </Field>
        <Field label="Credit label">
          <TextInput value="By nvite.id" readOnly />
        </Field>
        <Field label="Credit URL">
          <TextInput value="https://nvite.id" readOnly />
        </Field>
      </Section>
    </div>
  );
}

// ── Main builder ──────────────────────────────────────────────────────────────

export function InvitationBuilderPage({ id: propId } = {}) {
  const params = useParams();
  const id = propId ?? params.id;
  const [searchParams] = useSearchParams();
  const templateParam = searchParams.get('template') ?? 'lumiere';
  const isNew = !id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { invitations, createInvitation, updateInvitation, loading: invLoading } = useInvitations();

  const [activeTab, setActiveTab] = useState('couple');
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [slugError, setSlugError] = useState(null);
  const [invitationId, setInvitationId] = useState(id ?? '');
  const [published, setPublished] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [previewMode, setPreviewMode] = useState('mobile');
  const [mobileTab, setMobileTab] = useState('editor');
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const previewDraftKeyRef = useRef(`invitation-preview-${Math.random().toString(36).slice(2)}`);
  const desktopPreviewRef = useRef(null);
  const mobilePreviewRef = useRef(null);

  const buildDefaultSlug = useCallback(() => {
    const bride = content.couple.bride.fullName.trim().toLowerCase();
    const groom = content.couple.groom.fullName.trim().toLowerCase();
    const base = `${bride}-${groom}`
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');

    if (base) return base;

    return `invitation-${Date.now().toString(36)}`;
  }, [content.couple.bride.fullName, content.couple.groom.fullName]);

  // Load existing invitation or initialise from template
  useEffect(() => {
    if (!isNew && !invLoading && !initialized) {
      const existing = invitations.find((inv) => String(inv.id) === String(id));
      if (existing) {
        setContent(deepMerge(DEFAULT_CONTENT, existing.content));
        setPublished(existing.is_published);
        setInitialized(true);
      }
    }
    if (isNew && !initialized) {
      // Seed from the chosen template so theme + template field are correct
      const tpl = getTemplateBySlug(templateParam);
      if (tpl?.content) {
        setContent(deepMerge(DEFAULT_CONTENT, {
          template: tpl.content.template,
          theme: tpl.content.theme,
        }));
      }
      setInitialized(true);
    }
  }, [isNew, invitations, invLoading, id, initialized, templateParam]);

  const handleChange = useCallback((updates) => {
    setContent((prev) => deepMerge(prev, updates));
    setSaved(false);
  }, []);

  useEffect(() => {
    const draftKey = previewDraftKeyRef.current;
    sessionStorage.setItem(draftKey, JSON.stringify(content));

    const payload = { type: 'invitation-preview:update', draftKey, payload: content };
    desktopPreviewRef.current?.contentWindow?.postMessage(payload, window.location.origin);
    mobilePreviewRef.current?.contentWindow?.postMessage(payload, window.location.origin);
  }, [content]);

  const handleSave = async (publish) => {
    const normalizedSlug = content.slug.trim() || buildDefaultSlug();
    setSaving(true);
    setSaveError(null);
    setSlugError(null);

    if (normalizedSlug !== content.slug) {
      setContent((prev) => ({ ...prev, slug: normalizedSlug }));
    }

    const contentToSave = { ...content, slug: normalizedSlug };

    if (isNew || !invitationId) {
      const result = await createInvitation(normalizedSlug, contentToSave);
      if ('error' in result) {
        setSaveError(result.error);
        if (result.error.includes('slug')) setSlugError(result.error);
        setSaving(false);
        return;
      }
      const newId = result.id;
      setInvitationId(newId);
      if (publish) {
        const err = await updateInvitation(newId, { is_published: true });
        if (err) setSaveError(err.error);
      }
      navigate(`/${newId}`, { replace: true });
    } else {
      const err = await updateInvitation(invitationId, {
        slug: normalizedSlug,
        content: contentToSave,
        ...(publish ? { is_published: true } : {}),
      });
      if (err) {
        setSaveError(err.error);
        if (err.error.includes('slug')) setSlugError(err.error);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const handleExportPdf = () => {
    const url = `/dashboard/export-pdf?draftKey=${encodeURIComponent(previewDraftKeyRef.current)}`;
    window.open(url, '_blank');
  };

  const handlePublishToggle = async () => {
    if (!invitationId) return;
    setSaving(true);
    setSaveError(null);
    const err = await updateInvitation(invitationId, { is_published: !published });
    if (err) {
      setSaveError(err.error);
    } else {
      setPublished(!published);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  const userId = user?.id ?? 'unknown';
  const currentInvId = invitationId || 'new';

  const renderTabContent = () => {
    if (!initialized || invLoading) {
      return (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9974a] border-t-transparent" />
        </div>
      );
    }

    return (
      <div className="space-y-10">
        {activeTab === 'couple' && (
          <CoupleTab c={content} userId={userId} invId={currentInvId} onChange={handleChange} />
        )}
        {activeTab === 'date' && (
          <DateTab c={content} onChange={handleChange} />
        )}
        {activeTab === 'story' && (
          <StoryTab c={content} onChange={handleChange} />
        )}
        {activeTab === 'events' && (
          <EventsTab c={content} onChange={handleChange} />
        )}
        {activeTab === 'gifts' && (
          <GiftsTab c={content} onChange={handleChange} />
        )}
        {activeTab === 'media' && (
          <MediaTab c={content} userId={userId} invId={currentInvId} onChange={handleChange} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            c={content}
            invId={currentInvId}
            isNew={isNew}
            onChange={handleChange}
            slugError={slugError}
            onSlugBlur={() => setSlugError(null)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#fdfaf6]">
      {/* Desktop Top bar */}
      <header className="hidden lg:flex h-[72px] shrink-0 items-center justify-between border-b border-[#e8ddd4] bg-white/80 px-8 backdrop-blur-md z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black">
              <span className="text-xl font-bold text-white font-copy">n</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[#1a1612]">nvite.id</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8a7a6e]">Studio Builder</span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-[#e8ddd4]" />

          <nav className="flex items-center gap-2">
            <Link to="/" className="text-xs font-semibold text-[#8a7a6e] transition hover:text-black">Dashboard</Link>
            <ArrowLeft className="h-3 w-3 -rotate-180 text-[#e8ddd4]" />
            <span className="text-xs font-bold text-black">
              {isNew ? 'New Invitation' : (content.slug || 'Edit Invitation')}
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 rounded-full border border-[#e8ddd4] bg-[#fdfaf6] px-4 py-2 sm:flex">
            <div className={cn("h-2 w-2 rounded-full", saved ? "bg-emerald-500" : "bg-amber-400 animate-pulse")} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a7a6e]">
              {saved ? 'All changes saved' : 'Unsaved changes'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {saveError && (
              <p className="hidden max-w-xs truncate text-xs text-red-500 xl:block">{saveError}</p>
            )}
            <button
              type="button"
              onClick={handleExportPdf}
              className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8ddd4] text-[#8a7a6e] transition hover:bg-[#fdfaf6] hover:text-black"
              title="Export PDF"
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => void handleSave(false)}
              disabled={saving}
              className="rounded-xl border border-[#e8ddd4] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#1a1612] transition hover:bg-[#fdfaf6] disabled:opacity-50"
            >
              {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => void handlePublishToggle()}
              disabled={saving || !invitationId}
              className={cn(
                "rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-lg transition disabled:opacity-50",
                published
                  ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600'
                  : 'bg-[#c9974a] text-white shadow-[#c9974a]/20 hover:bg-[#b8863b]'
              )}
            >
              {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : (published ? 'Unpublish' : 'Publish')}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top bar */}
      <header className="relative z-50 flex h-16 shrink-0 items-center justify-between border-b border-[#e8ddd4] bg-white/80 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8ddd4] text-[#8a7a6e]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#1a1612] truncate max-w-[120px]">
              {content.slug || 'Untitled'}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#c9974a]">Studio</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPdf}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8ddd4] text-[#8a7a6e]"
          >
            <FileText className="h-5 w-5" />
          </button>
          <button
            onClick={() => void handleSave(false)}
            disabled={saving}
            className="rounded-xl bg-[#1a1612] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-50"
          >
            {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : 'Save'}
          </button>
          <button
            onClick={() => void handlePublishToggle()}
            disabled={saving || !invitationId}
            className={cn(
              "rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition disabled:opacity-50",
              published
                ? 'bg-red-500 text-white'
                : 'bg-[#c9974a] text-white'
            )}
          >
            {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : (published ? 'Unpublish' : 'Publish')}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          {/* Left Side: Icon Rail */}
          <aside className="flex w-[72px] shrink-0 flex-col items-center border-r border-[#e8ddd4] bg-white py-6">
            <div className="flex flex-1 flex-col gap-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'group relative flex h-12 w-12 items-center justify-center rounded-2xl transition',
                      activeTab === tab.id
                        ? 'bg-[#c9974a]/10 text-[#c9974a]'
                        : 'text-[#8a7a6e] hover:bg-[#fdfaf6] hover:text-black'
                    )}
                    title={tab.label}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="absolute left-16 z-[60] pointer-events-none rounded bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 transition group-hover:opacity-100 whitespace-nowrap">
                      {tab.label}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center text-[#8a7a6e] transition hover:text-black"
                title="Global Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </aside>

          {/* Center: Immersive Canvas */}
          <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#fdfaf6]" style={{ backgroundImage: 'radial-gradient(#e8ddd4 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            {/* Canvas Toolbar */}
            <div className="absolute top-8 z-10 flex items-center gap-8 rounded-2xl border border-[#e8ddd4] bg-white/70 px-6 py-3 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg transition',
                    previewMode === 'mobile' ? 'bg-black text-white shadow-lg' : 'text-[#8a7a6e] hover:bg-[#fdfaf6]'
                  )}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg transition',
                    previewMode === 'desktop' ? 'bg-black text-white shadow-lg' : 'text-[#8a7a6e] hover:bg-[#fdfaf6]'
                  )}
                >
                  <Monitor className="h-4 w-4" />
                </button>
              </div>

              <div className="h-6 w-[1px] bg-[#e8ddd4]" />

              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#8a7a6e]">Template</span>
                  <span className="text-xs font-bold text-[#1a1612]">
                    {content.template ? content.template.charAt(0).toUpperCase() + content.template.slice(1) : 'Lumière Cinematic'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="border-b-2 border-[#c9974a]/30 text-[10px] font-bold uppercase tracking-widest text-[#c9974a] transition hover:border-[#c9974a]"
                >
                  Change
                </button>
              </div>

              <div className="h-6 w-[1px] bg-[#e8ddd4]" />

              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a7a6e] transition hover:bg-[#fdfaf6]">
                  <Maximize2 className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-[#1a1612]">100%</span>
              </div>
            </div>

            {/* Device Frame */}
            <div className="relative flex flex-1 items-center justify-center overflow-auto p-12 py-20 w-full no-scrollbar">
              {previewMode === 'mobile' ? (
                <div className={cn(
                  "relative h-[780px] w-[390px] shrink-0 overflow-hidden rounded-[3.5rem] bg-black shadow-2xl transition-all duration-500",
                  "ring-8 ring-[#1a1612] ring-offset-0"
                )}>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 z-20 h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-[#1a1612] flex items-center justify-center">
                    <div className="h-1 w-10 rounded-full bg-[#333]" />
                  </div>
                  <iframe
                    ref={desktopPreviewRef}
                    title="Invitation preview mobile"
                    src={`/dashboard/preview?draftKey=${encodeURIComponent(previewDraftKeyRef.current)}`}
                    className="absolute inset-0 h-full w-full bg-[#050505]"
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  />
                </div>
              ) : (
                <div className="h-[768px] w-[1366px] max-w-none shrink-0 overflow-hidden rounded-2xl border-8 border-[#1a1612] bg-[#0d0d0d] shadow-2xl">
                  <iframe
                    ref={desktopPreviewRef}
                    title="Invitation preview desktop"
                    src={`/dashboard/preview?draftKey=${encodeURIComponent(previewDraftKeyRef.current)}`}
                    className="h-full w-full"
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  />
                </div>
              )}
            </div>

            {/* Floating Tips */}
            <div className="absolute bottom-8 left-8 flex max-w-[280px] gap-4 rounded-2xl border border-[#e8ddd4] bg-white p-4 shadow-xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fdf5e8] text-xl">✨</div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#c9974a]">Design Tip</p>
                <p className="text-xs leading-relaxed text-[#8a7a6e]">
                  {activeTab === 'couple' ? 'The Lumière template works best with cinematic, high-contrast photography.' :
                    activeTab === 'media' ? 'Try to use portrait images for a consistent gallery look.' :
                      'Use your brand accent color sparingly to maintain an editorial feel.'}
                </p>
              </div>
            </div>
          </section>

          {/* Right Side: Inspector */}
          <aside className="z-20 flex w-[440px] shrink-0 flex-col border-l border-[#e8ddd4] bg-white shadow-2xl shadow-black/10">
            {/* Inspector Header */}
            <div className="border-b border-[#fdfaf6] bg-[#fdfaf6]/50 p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9974a]">Editing Section</span>
              </div>
              <h2 className="font-display text-3xl text-[#1a1612]">
                {TABS.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="mt-2 text-sm text-[#8a7a6e]">
                {activeTab === 'couple' && 'Manage the core identity of the bride and groom.'}
                {activeTab === 'date' && 'Set the timeline and venue details for your big day.'}
                {activeTab === 'story' && 'Share the beautiful journey of your love story.'}
                {activeTab === 'events' && 'Organize and list all your wedding celebration events.'}
                {activeTab === 'gifts' && 'Set up gift registries and digital gift options.'}
                {activeTab === 'media' && 'Upload and manage your photos and videos.'}
                {activeTab === 'settings' && 'Configure SEO, template, and site-wide preferences.'}
              </p>
            </div>

            {/* Inspector Content */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {renderTabContent()}
            </div>

            {/* Inspector Footer */}
            <div className="border-t border-[#fdfaf6] bg-white p-6">
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-[#e8ddd4] py-3 text-xs font-bold uppercase tracking-widest text-[#8a7a6e] transition hover:bg-[#fdfaf6]"
                  onClick={() => navigate('/')}
                >
                  Back to List
                </button>
                <button
                  type="button"
                  className="flex-[1.5] rounded-xl bg-[#1a1612] py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-black/10 transition hover:bg-black"
                  onClick={() => void handleSave(false)}
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Layout */}
        <div className="flex lg:hidden flex-1 flex-col overflow-hidden">
          {/* View Toggle */}
          <div className="bg-white px-6 py-4 flex justify-center border-b border-[#e8ddd4]">
            <div className="inline-flex p-1 bg-[#fdfaf6] rounded-2xl border border-[#e8ddd4] w-full max-w-[280px]">
              <button
                onClick={() => setMobileTab('editor')}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition",
                  mobileTab === 'editor' ? "bg-white text-[#1a1612] shadow-sm border border-[#e8ddd4]/50" : "text-[#8a7a6e]"
                )}
              >Editor</button>
              <button
                onClick={() => setMobileTab('preview')}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition",
                  mobileTab === 'preview' ? "bg-white text-[#1a1612] shadow-sm border border-[#e8ddd4]/50" : "text-[#8a7a6e]"
                )}
              >Preview</button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative bg-[#fdfaf6]">
            {mobileTab === 'editor' ? (
              <div className="h-full overflow-y-auto no-scrollbar p-6 pb-24">
                <div className="mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c9974a]">Editing Section</span>
                  <h2 className="font-display text-4xl text-[#1a1612] mt-2 italic">
                    {TABS.find(t => t.id === activeTab)?.label}
                  </h2>
                </div>
                {renderTabContent()}
              </div>
            ) : (
              <iframe
                ref={mobilePreviewRef}
                title="Invitation preview mobile"
                src={`/dashboard/preview?draftKey=${encodeURIComponent(previewDraftKeyRef.current)}`}
                className="h-full w-full bg-[#050505]"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              />
            )}
          </div>

          {/* Bottom Nav */}
          <nav className="relative z-50 bg-white/95 backdrop-blur-md border-t border-[#e8ddd4] px-4 pt-4 pb-8 flex items-center justify-around shrink-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileTab('editor');
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-2xl transition transform active:scale-90",
                    isActive ? "bg-[#c9974a]/10 text-[#c9974a]" : "text-[#8a7a6e]"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "text-[8px] font-bold uppercase tracking-[0.2em]",
                    isActive ? "text-[#c9974a]" : "text-[#8a7a6e]"
                  )}>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

    </div>
  );
}
