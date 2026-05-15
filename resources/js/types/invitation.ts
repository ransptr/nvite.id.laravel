export type PersonProfile = {
  title: string;
  fullName: string;
  nickname: string;
  parents: string[];
  instagram?: string;
  image: string;
};

export type TimelineEntry = {
  year: string;
  title: string;
  body: string;
};

export type EventDetail = {
  title: string;
  time?: string;
  location?: string;
  text?: string;
  link?: string;
  linkLabel?: string;
};

export type GiftAccount = {
  id: string;
  bank: string;
  number: string;
  holder: string;
};

export type CalendarEvent = {
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
};

export type CommentSeed = {
  guestName: string;
  wishes: string;
  createdAt: string;
};

export type InvitationConfig = {
  slug: string;
  template?: string;
  seo: {
    title: string;
    description: string;
  };
  theme: {
    accent: string;
    background: string;
    surface: string;
    softSurface: string;
  };
  guestQueryParam: string;
  couple: {
    joinedName: string;
    coverLabel: string;
    dateLabel: string;
    scripture: {
      text: string;
      citation: string;
    };
    quote: string;
    bride: PersonProfile;
    groom: PersonProfile;
  };
  media: {
    audio: string;
    coverImage: string;
    heroVideo: string;
    heroPoster: string;
    quoteImages: string[];
    storyImages: string[];
    giftImage: string;
    rsvpImage: string;
    videoPoster: string;
    filmPoster: string;
    videoUrl: string;
    thankYouImage: string;
    gallery: string[];
    ogImage: string;
  };
  story: {
    title: string;
    timeline: TimelineEntry[];
    visible?: boolean;
  };
  countdown: {
    label: string;
    target: string;
    calendar: CalendarEvent;
    image: string;
  };
  events: {
    title: string;
    dateLabel: string;
    details: EventDetail[];
  };
  gift: {
    intro: string;
    accounts: GiftAccount[];
    visible?: boolean;
  };
  rsvp: {
    intro: string;
    maxGuestsDefault: number;
    comments: CommentSeed[];
    qr_enabled?: boolean;
  };
  footer: {
    closingTitle: string[];
    closingText: string;
    creditLabel: string;
    creditUrl: string;
    links: { label: string; url: string }[];
  };
};
