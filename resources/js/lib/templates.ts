import type {InvitationConfig} from '@/types/invitation';

export type TemplateSlug = 'lumiere' | 'bloom' | 'sage' | 'onyx';

export type TemplateDefinition = {
  slug: TemplateSlug;
  name: string;
  available: boolean;
  content: InvitationConfig | null;
};

const LUMIERE_TEMPLATE = {
  ...(JSON.parse(String.raw`{
    "slug": "claire",
    "seo": {
      "title": "The Wedding of Dexter - Hualin",
      "description": "A cinematic digital invitation for Dexter and Hualin."
    },
    "theme": {
      "accent": "#d8b181",
      "background": "#050505",
      "surface": "#111111",
      "softSurface": "#e7e1db"
    },
    "guestQueryParam": "to",
    "couple": {
      "joinedName": "Dexter - Hualin",
      "coverLabel": "THE WEDDING OF",
      "dateLabel": "Friday, 21 August 2026",
      "scripture": {
        "text": "But at the beginning of creation God 'made them male and female.' 'For this reason a man will leave his father and mother and be united to his wife, and the two will become one flesh.' So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.",
        "citation": "Mark 10:6-9"
      },
      "quote": "Two are better than one, for they have a good return for their labor.",
      "bride": {
        "title": "THE BRIDE",
        "fullName": "Hualin Arabelle",
        "nickname": "Hualin",
        "parents": ["The Daughter of", "Mr. Lorem ipsum dolor sit amet", "Mrs. Lorem ipsum dolor sit amet"],
        "instagram": "https://www.instagram.com/nvite.id",
        "image": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00145-Large.jpeg"
      },
      "groom": {
        "title": "THE GROOM",
        "fullName": "Dexter Emmanuel",
        "nickname": "Dexter",
        "parents": ["The Son of", "Mr. Lorem ipsum dolor sit amet", "Mrs. Lorem ipsum dolor sit amet"],
        "instagram": "https://www.instagram.com/nvite.id",
        "image": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00183-Large.jpeg"
      }
    },
    "media": {
      "audio": "https://is3.cloudhost.id/externalgroovepublic/MP3/s%C3%B8d%20ven%20-%20infinity%20(lyric%20video)%20(mp3cut.net).mp3",
      "coverImage": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00146-Large.jpeg",
      "heroVideo": "https://is3.cloudhost.id/externalgroovepublic/video%20groove/japan%20vibe.mp4",
      "heroPoster": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00169.jpg",
      "quoteImages": [
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00197-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00206.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00195-Large.jpeg"
      ],
      "storyImages": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00169.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00164.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00153-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645345rge523.jpg"
      ],
      "giftImage": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00179.jpg",
      "rsvpImage": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00216-Large.jpeg",
      "videoPoster": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
      "filmPoster": "",
      "videoUrl": "https://www.youtube.com/embed/BNQj5Muhss4?autoplay=1&rel=0",
      "thankYouImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00155.jpg",
      "gallery": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00203-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00155.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00208.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00207.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00198.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00169.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00179.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00195-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645fdfd345rge523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645345rge523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00145-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-49756523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00182-Largffe.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00153-Large.jpeg"
      ]
    },
    "story": {
      "title": "A Journey in Love",
      "visible": true,
      "timeline": [
        {
          "year": "2023",
          "title": "The First Encounter",
          "body": "It all began in the spring of 2023 when Dexter, a kind-hearted and adventurous soul, arrived in Japan for work. New to the country, he found himself walking along the bustling streets of Tokyo, captivated by the neon lights and the mix of tradition and modernity. On one of his many explorations, Dexter stumbled upon a cozy cafe hidden in a quiet alley, its warm ambiance calling him inside.\n\nInside the cafe, Hualin, a soft-spoken artist with a passion for storytelling through her paintings, was sipping tea and sketching. Their eyes met briefly, and there was an instant connection. Dexter could not resist walking up to her and struck up a conversation about the art on the cafe walls. What started as a casual chat about creativity soon turned into hours of deep conversation. They shared stories of their lives, their dreams, and the serendipity that had led them to Japan. It felt as though they had known each other forever."
        },
        {
          "year": "2024",
          "title": "Growing Together",
          "body": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan from the serene temples of Kyoto to the cherry blossoms in full bloom. With every passing moment, their bond deepened. Dexter admired Hualin's gentle spirit and her ability to find beauty in the simplest things. Hualin, on the other hand, was drawn to Dexter's adventurous nature and how he always made her laugh, even on the hardest days.\n\nTheir love story was not just about grand adventures but also about the quiet moments shared in the comfort of their home in Japan, cooking meals together, long walks in the park, and nights filled with laughter and dreams of the future. They both knew, deep down, that this was more than just a passing connection. It was something meant to last a lifetime."
        },
        {
          "year": "2025",
          "title": "The Proposal",
          "body": "By early 2025, it was clear to both Dexter and Hualin that they were meant to be together forever. Dexter planned a special evening for Hualin, taking her to the very cafe where they first met. As they sat by the same window, looking out at the Tokyo skyline, Dexter took Hualin's hand and spoke from the heart. He told her how much she meant to him and how he could not imagine his life without her.\n\nWith a smile that lit up her face, Hualin said yes.\n\nTheir love story was about to take the next step as they began planning their wedding for later that year, excited to build a future together, full of love, laughter, and the beautiful memories they would create in Japan and beyond."
        }
      ]
    },
    "countdown": {
      "label": "Almost Time For Our Celebration",
      "target": "2026-08-21T08:00:00+07:00",
      "calendar": {
        "title": "The Wedding of Dexter - Hualin",
        "description": "Join us for the wedding celebration of Dexter and Hualin.",
        "location": "Jl. Taman Palem Lestari Barat No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia",
        "start": "2026-08-21T08:00:00+07:00",
        "end": "2026-08-21T12:00:00+07:00"
      },
      "image": ""
    },
    "events": {
      "title": "Wedding / Details",
      "dateLabel": "Friday\n21.08.2026",
      "details": [
        {
          "title": "Holy Matrimony",
          "time": "8 AM - 10 PM",
          "location": "Jl. Taman Palem Lestari Barat No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia",
          "link": "https://maps.app.goo.gl/78MwTKCz1Qn13PFD8",
          "linkLabel": "View map"
        },
        {
          "title": "Reception",
          "time": "10 AM - 12 PM",
          "location": "Jl. Taman Palem Lestari Barat No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia",
          "link": "https://maps.app.goo.gl/78MwTKCz1Qn13PFD8",
          "linkLabel": "View map"
        },
        {
          "title": "A Guide to Dress Codes",
          "text": "We kindly encourage our guests to wear these colors for our special day: Black, Maroon, Sage."
        },
        {
          "title": "Join Us Virtually",
          "time": "8 AM - 10 PM",
          "text": "If you are unable to attend in person, we invite you to celebrate with us through our live streaming.",
          "link": "https://www.youtube.com/@Groovepublic/videos",
          "linkLabel": "Watch live stream"
        }
      ]
    },
    "gift": {
      "intro": "For those of you who want to give a token of love to the bride and groom, you can use the account number below:",
      "visible": true,
      "accounts": [
        {"id": "mandiri-main", "bank": "Bank Mandiri", "number": "00008888123", "holder": "Groove Public Invitation"},
        {"id": "bca-main", "bank": "Bank BCA", "number": "00008888123", "holder": "Groove Public Invitation"},
        {"id": "bca-secondary", "bank": "Bank BCA", "number": "00008888123", "holder": "Groove Public Invitation"}
      ]
    },
    "rsvp": {
      "intro": "We kindly request your prompt response to confirm your attendance at our upcoming event. Alongside your RSVP, please take a moment to extend your warm regards and best wishes.",
      "maxGuestsDefault": 2,
      "comments": [
        {"guestName": "Belaa anis", "wishes": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan.", "createdAt": "2025-03-04T10:00:00.000Z"},
        {"guestName": "Gery aq", "wishes": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan.", "createdAt": "2025-03-04T09:00:00.000Z"},
        {"guestName": "Vilony", "wishes": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan.", "createdAt": "2025-03-04T08:00:00.000Z"},
        {"guestName": "Jony", "wishes": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan.", "createdAt": "2025-03-04T07:00:00.000Z"},
        {"guestName": "Yoku", "wishes": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan.", "createdAt": "2025-03-04T06:00:00.000Z"}
      ]
    },
    "footer": {
      "closingTitle": ["Thank", "You"],
      "closingText": "It is a pleasure and honor for us, if you are willing to attend and give us your blessing.",
      "creditLabel": "By nvite.id",
      "creditUrl": "https://nvite.id",
      "links": []
    }
  }`) as InvitationConfig),
  slug: 'lumiere',
};

const BLOOM_TEMPLATE: InvitationConfig = {
  ...(JSON.parse(String.raw`{
    "slug": "bloom",
    "template": "bloom",
    "seo": {
      "title": "The Wedding of Rafael & Amara",
      "description": "A warm, floral digital invitation for Rafael and Amara — a garden love story born in the heart of Ubud."
    },
    "theme": {
      "accent": "#d4896a",
      "background": "#fdf6ee",
      "surface": "#f5e6d8",
      "softSurface": "#fff8f3"
    },
    "guestQueryParam": "to",
    "couple": {
      "joinedName": "Rafael & Amara",
      "coverLabel": "THE WEDDING OF",
      "dateLabel": "Saturday, 14 March 2026",
      "scripture": {
        "text": "Scarcely had I passed them when I found the one my heart loves. I held him and would not let him go.",
        "citation": "Song of Solomon 3:4"
      },
      "quote": "I have found the one whom my soul loves.",
      "bride": {
        "title": "THE BRIDE",
        "fullName": "Amara Setiawati",
        "nickname": "Amara",
        "parents": ["The Daughter of", "Mr. Budi Setiawan", "Mrs. Ratna Setiawan"],
        "instagram": "https://www.instagram.com/nvite.id",
        "image": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00145-Large.jpeg"
      },
      "groom": {
        "title": "THE GROOM",
        "fullName": "Rafael Adriansyah",
        "nickname": "Rafael",
        "parents": ["The Son of", "Mr. Hendra Adriansyah", "Mrs. Sari Adriansyah"],
        "instagram": "https://www.instagram.com/nvite.id",
        "image": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00183-Large.jpeg"
      }
    },
    "media": {
      "audio": "https://is3.cloudhost.id/externalgroovepublic/MP3/s%C3%B8d%20ven%20-%20infinity%20(lyric%20video)%20(mp3cut.net).mp3",
      "coverImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00203-Large.jpeg",
      "heroVideo": "https://is3.cloudhost.id/externalgroovepublic/video%20groove/japan%20vibe.mp4",
      "heroPoster": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00195-Large.jpeg",
      "quoteImages": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00207.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00208.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00197-Large.jpeg"
      ],
      "storyImages": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00195-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00198.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00203-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00208.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00146-Large.jpeg"
      ],
      "giftImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00179.jpg",
      "rsvpImage": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00216-Large.jpeg",
      "videoPoster": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00207.jpg",
      "videoUrl": "https://www.youtube.com/embed/BNQj5Muhss4?autoplay=1&rel=0",
      "thankYouImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00155.jpg",
      "gallery": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00203-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00208.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00207.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00198.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00195-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00179.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00169.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00164.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00155.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00145-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00216-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00197-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00146-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645345rge523.jpg"
      ]
    },
    "story": {
      "title": "A Garden of Moments",
      "visible": true,
      "timeline": [
        {
          "year": "2022",
          "title": "Where Art Meets the Heart",
          "body": "It was the kind of afternoon that Ubud does best — the air thick with incense and the sound of distant gamelan drifting through mango trees. Rafael had wandered into a small gallery tucked behind the main street, drawn by a painting in the window that stopped him cold: a canvas of layered rice terraces rendered in terracotta and gold, as if the earth itself had been pressed onto linen.\n\nAmara was the artist.\n\nShe was in the corner, quietly arranging a new series of work, unaware that someone had been standing in front of her painting for nearly ten minutes. When she finally noticed him, she walked over — not to make a sale, but out of genuine curiosity. She asked what he saw in it. He said: a place he had been searching for without knowing it.\n\nThey talked for hours. About art, about home, about how certain places hold you even after you leave. When the gallery owner finally closed up for the evening, they found themselves on the steps outside, still talking, sharing a paper cup of jamu, the sky above Ubud turning the color of ripe mangosteen.\n\nRafael left Bali three days later. But he left with Amara's number, and a quiet certainty that he would be back."
        },
        {
          "year": "2023",
          "title": "Every Road Leads Back to You",
          "body": "Rafael came back to Bali four months later. He told himself it was for work. Amara knew better — and teased him about it for the entire year that followed.\n\nThat year became theirs. They rented a motorbike and disappeared for weekends at a time: down to Nusa Penida where the waves crashed white against black sand, up to Munduk where the waterfalls roared through clove forests, east to Amed where they slept under fishing nets turned into hammocks and woke to the smell of salt and frangipani.\n\nBut it was the ordinary days that mattered most. Sunday mornings at the Ubud market, Amara choosing the boldest flowers for her studio while Rafael bargained badly for dragon fruit and laughed at himself for it. Evening walks past the palace, where the stone guardians stood mossy and dignified in the dusk. Cooking together in the narrow kitchen of Amara's studio, the windows thrown open to the rain.\n\nSomewhere between the rice fields and the rainstorms, the question stopped being if and became when. They both knew it. Neither said it out loud yet — but they were already building something, quietly, together, the way a garden grows before you've noticed."
        },
        {
          "year": "2024",
          "title": "Yes, At Sunrise",
          "body": "Rafael had been planning it for three months. He knew Amara would hate anything grand or performative — no fireworks, no crowded restaurants, no choreographed moments with strangers applauding. So he chose something she would love: a morning at the Pasar Badung flower market before it got loud, just the two of them among the sellers arranging pandan and jasmine and yards of golden marigold into ceremonial towers.\n\nThey arrived before sunrise. The market was still quiet, lit by a few bare bulbs swinging over the stalls. Amara was in her element immediately — moving from vendor to vendor, pressing her face into bundles of tuberose, asking questions in her broken Balinese that always made the sellers smile.\n\nRafael waited until she had found the stall she loved best: an old woman who wove offering baskets from young coconut leaves, her fingers moving so fast they blurred. Amara crouched down to watch. Rafael crouched beside her. He reached into his pocket.\n\nWhen Amara turned to say something — some small observation about the pattern of the weaving — she found him already facing her, the ring between his fingers, the dawn light just beginning to come through the canvas awning above them, everything smelling of flowers.\n\nShe said yes before he finished asking."
        }
      ]
    },
    "countdown": {
      "label": "The Garden is Almost Ready",
      "target": "2026-03-14T09:00:00+08:00",
      "calendar": {
        "title": "The Wedding of Rafael & Amara",
        "description": "Join us for the wedding celebration of Rafael and Amara in the heart of Ubud, Bali.",
        "location": "Jl. Raya Ubud No.8, Ubud, Kabupaten Gianyar, Bali 80571, Indonesia",
        "start": "2026-03-14T09:00:00+08:00",
        "end": "2026-03-14T14:00:00+08:00"
      },
      "image": ""
    },
    "events": {
      "title": "Wedding / Details",
      "dateLabel": "Saturday\n14.03.2026",
      "details": [
        {
          "title": "Akad Nikah",
          "time": "9 AM - 10 AM",
          "location": "Jl. Raya Ubud No.8, Ubud, Kabupaten Gianyar, Bali 80571, Indonesia",
          "link": "https://maps.app.goo.gl/78MwTKCz1Qn13PFD8",
          "linkLabel": "View map"
        },
        {
          "title": "Reception",
          "time": "11 AM - 2 PM",
          "location": "Jl. Raya Ubud No.8, Ubud, Kabupaten Gianyar, Bali 80571, Indonesia",
          "link": "https://maps.app.goo.gl/78MwTKCz1Qn13PFD8",
          "linkLabel": "View map"
        },
        {
          "title": "A Guide to Dress Codes",
          "text": "We warmly invite our guests to dress in these garden tones: White, Terracotta, and Dusty Rose."
        },
        {
          "title": "Join Us Virtually",
          "time": "9 AM - 2 PM",
          "text": "Can't make it to Bali? We'd still love for you to be part of the celebration. Watch our live stream and send your love from wherever you are.",
          "link": "https://www.youtube.com/@Groovepublic/videos",
          "linkLabel": "Watch live stream"
        }
      ]
    },
    "gift": {
"intro": "Your presence is the greatest gift of all. But if you wish to send a little love, you may use the accounts below:",
"visible": true,
      "accounts": [
        {"id": "bca-amara", "bank": "Bank BCA", "number": "1234567890", "holder": "Amara Setiawati"},
        {"id": "mandiri-rafael", "bank": "Bank Mandiri", "number": "0987654321", "holder": "Rafael Adriansyah"},
        {"id": "bni-joint", "bank": "Bank BNI", "number": "1122334455", "holder": "Rafael & Amara"}
      ]
    },
    "rsvp": {
      "intro": "Please let us know if you can join us for this special day. And if you have a wish or a word of love to share, we would be so grateful to hear it.",
      "maxGuestsDefault": 2,
      "comments": [
        {"guestName": "Kinanti Dewi", "wishes": "Rafael and Amara, watching you both grow together has been one of the sweetest things. Your love is as bright and warm as Bali at sunrise. Wishing you a lifetime of mornings like that.", "createdAt": "2025-06-12T09:30:00.000Z"},
        {"guestName": "Mas Bagas", "wishes": "Bro Rafael, you found someone who makes you better and calmer. Amara, thank you for that. This is the best day. Can't wait to celebrate with you both!", "createdAt": "2025-06-12T08:45:00.000Z"},
        {"guestName": "Sari & Doni", "wishes": "To Rafael and Amara — may your home always smell like flowers and your days always feel like that Ubud light. So much love from us both.", "createdAt": "2025-06-11T21:00:00.000Z"},
        {"guestName": "Lia Oktaviani", "wishes": "Amara, you painted pictures of places before you even knew who would take you there. Now you have him. I am so, so happy for you. Love you endlessly.", "createdAt": "2025-06-11T18:20:00.000Z"},
        {"guestName": "Reza Fahmi", "wishes": "Two good people choosing each other every single day — that is what love looks like. Congratulations, Rafael and Amara. Truly.", "createdAt": "2025-06-11T15:00:00.000Z"}
      ]
    },
    "footer": {
      "closingTitle": ["With", "Love"],
      "closingText": "Thank you for being part of our story. It means the world to have you here as we begin this new chapter together.",
      "creditLabel": "By nvite.id",
      "creditUrl": "https://nvite.id",
      "links": []
    }
  }`) as InvitationConfig),
};

const SAGE_TEMPLATE: InvitationConfig = {
  ...(JSON.parse(String.raw`{
    "slug": "sage",
    "template": "sage",
    "seo": {
      "title": "The Wedding of Nathan & Elara",
      "description": "A botanical, earthy digital invitation for Nathan and Elara — a quiet love found on mountain trails."
    },
    "theme": {
      "accent": "#6b8c5e",
      "background": "#f4f7f0",
      "surface": "#dfebd5",
      "softSurface": "#f0f4ec"
    },
    "guestQueryParam": "to",
    "couple": {
      "joinedName": "Nathan & Elara",
      "coverLabel": "THE WEDDING OF",
      "dateLabel": "Sunday, 7 June 2026",
      "scripture": {
        "text": "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.",
        "citation": "Ruth 1:16"
      },
      "quote": "The clearest way into the Universe is through a forest wilderness.",
      "bride": {
        "title": "THE BRIDE",
        "fullName": "Elara Kusumawati",
        "nickname": "Elara",
        "parents": ["The Daughter of", "Mr. Wahyu Kusuma", "Mrs. Dewi Kusuma"],
        "instagram": "https://www.instagram.com/nvite.id",
        "image": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg"
      },
      "groom": {
        "title": "THE GROOM",
        "fullName": "Nathan Prasetya",
        "nickname": "Nathan",
        "parents": ["The Son of", "Mr. Andi Prasetya", "Mrs. Wulan Prasetya"],
        "instagram": "https://www.instagram.com/nvite.id",
        "image": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg"
      }
    },
    "media": {
      "audio": "https://is3.cloudhost.id/externalgroovepublic/MP3/s%C3%B8d%20ven%20-%20infinity%20(lyric%20video)%20(mp3cut.net).mp3",
      "coverImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00164.jpg",
      "heroVideo": "https://is3.cloudhost.id/externalgroovepublic/video%20groove/japan%20vibe.mp4",
      "heroPoster": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg",
      "quoteImages": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00164.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645345rge523.jpg"
      ],
      "storyImages": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00164.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00169.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645345rge523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00155.jpg"
      ],
      "giftImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00179.jpg",
      "rsvpImage": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00216-Large.jpeg",
      "videoPoster": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00164.jpg",
      "videoUrl": "https://www.youtube.com/embed/BNQj5Muhss4?autoplay=1&rel=0",
      "thankYouImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg",
      "gallery": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00169.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00164.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00155.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645345rge523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645fdfd345rge523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-49756523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00198.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00182-Largffe.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00179.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00203-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00216-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00197-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00146-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00145-Large.jpeg"
      ]
    },
    "story": {
      "title": "Rooted in the Same Soil",
      "visible": true,
      "timeline": [
        {
          "year": "2022",
          "title": "Found on the Trail",
          "body": "Nathan had been hiking the Lembang trail alone for two hours when the mist rolled in. He was not worried — he had done this route a dozen times — but he was moving slowly, watching his footing on the wet stone path, when he nearly walked into someone standing perfectly still in the middle of the trail.\n\nElara was watching a pair of Java sparrows in the canopy above. She did not flinch when he appeared. She just pressed one finger to her lips, nodded upward, and waited.\n\nThey stood there for a few minutes together in silence, watching the birds. Then the sparrows were gone, and Elara turned to him with a small smile and said, simply: 'Worth it.'\n\nThey walked the rest of the trail together. Nathan learned that Elara was a botanist — or close to one; she was finishing her thesis on highland mosses — and that she had been coming to these mountains every month for three years. She knew the name of every fern they passed. She pointed out a patch of Selaginella on a rock face and described it with the same tenderness someone else might use for an old friend.\n\nBy the time they reached the trailhead, Nathan had forgotten he had planned to do the rest of the route alone. He asked if she would come back next week. She said she already had plans to be here. He rearranged his entire Saturday to match them."
        },
        {
          "year": "2023",
          "title": "Slow and Rooted",
          "body": "The year that followed was unhurried in the way that only good things are. Nathan and Elara did not rush. They let things grow at their own pace, like the moss she studied — slowly, quietly, with great intention.\n\nThey had a ritual: every first Sunday of the month, they went somewhere green. The botanical gardens in Bogor, where they got lost for hours in the orchid greenhouse and Elara narrated the Latin names of everything like a private tour guide speaking only to him. A tea plantation near Ciwidey, where the fog sat so thick they could barely see the next row of bushes. A riverbed in Garut, where they ate packed lunches on flat stones and let the cold water run over their feet.\n\nIn between, there were ordinary Bandung evenings — angkringan under yellow light, second-hand bookshops, the kind of long dinners where the food goes cold because you cannot stop talking. Nathan learned that Elara made sketches of every plant she encountered in a worn leather notebook she had carried since university. She learned that Nathan kept a list of every mountain he had ever climbed, annotated with the weather and the first thing he saw at the summit.\n\nBy December, Nathan had stopped writing down summits and started writing down the things Elara said that he did not want to forget."
        },
        {
          "year": "2024",
          "title": "The Golden Hour Proposal",
          "body": "Nathan had asked Elara's father in March, quietly, over tea, the way he thought a serious thing deserved to be done. Her father had shaken his hand for a long time without saying anything, then said: 'She will know you mean it because you are not in a hurry.'\n\nHe chose a place they had never been together — a forest clearing in the hills above Pengalengan, one he had scouted three times on his own until he found the exact spot: a small ridge where the pine trees opened up and, in the late afternoon, the light came in at a low angle and turned everything amber and green and still.\n\nElara thought they were going to photograph a rare fern species Nathan had pretended to find on a hiking forum. She brought her notebook. She was wearing her old field jacket and boots and had pulled her hair back with a pencil, because she always did when she was working.\n\nWhen they reached the clearing, she stopped. The light was extraordinary. She reached for her notebook. Nathan reached for the ring.\n\nHe said: 'I have been following you into forests for two years, and I want to keep doing that for the rest of my life.'\n\nElara looked at him for a long moment. Then she said: 'I knew. I have known for a while.' She held out her hand.\n\nThey stayed in that clearing until the light was gone completely."
        }
      ]
    },
    "countdown": {
      "label": "Almost Time to Gather",
      "target": "2026-06-07T09:00:00+07:00",
      "calendar": {
        "title": "The Wedding of Nathan & Elara",
        "description": "Join us for the wedding celebration of Nathan and Elara in Bandung, West Java.",
        "location": "Jl. Raya Lembang No.22, Lembang, Kabupaten Bandung Barat, Jawa Barat 40391, Indonesia",
        "start": "2026-06-07T09:00:00+07:00",
        "end": "2026-06-07T14:00:00+07:00"
      },
      "image": ""
    },
    "events": {
      "title": "Wedding / Details",
      "dateLabel": "Sunday\n07.06.2026",
      "details": [
        {
          "title": "Holy Matrimony",
          "time": "9 AM - 10 AM",
          "location": "Jl. Raya Lembang No.22, Lembang, Kabupaten Bandung Barat, Jawa Barat 40391, Indonesia",
          "link": "https://maps.app.goo.gl/78MwTKCz1Qn13PFD8",
          "linkLabel": "View map"
        },
        {
          "title": "Reception",
          "time": "11 AM - 2 PM",
          "location": "Jl. Raya Lembang No.22, Lembang, Kabupaten Bandung Barat, Jawa Barat 40391, Indonesia",
          "link": "https://maps.app.goo.gl/78MwTKCz1Qn13PFD8",
          "linkLabel": "View map"
        },
        {
          "title": "A Guide to Dress Codes",
          "text": "Please join us dressed in earthy tones: Sage, Cream, and Forest Green — colors that feel right in the mountains."
        },
        {
          "title": "Join Us Virtually",
          "time": "9 AM - 2 PM",
          "text": "If the mountains are too far, we will bring the mountains to you. Watch live and celebrate with us from wherever you are.",
          "link": "https://www.youtube.com/@Groovepublic/videos",
          "linkLabel": "Watch live stream"
        }
      ]
    },
    "gift": {
      "intro": "Coming together with the people we love is the only gift we truly need. But if you wish to give something more, we humbly accept through the accounts below:",
      "visible": true,
      "accounts": [
        {"id": "bca-elara", "bank": "Bank BCA", "number": "8877665544", "holder": "Elara Kusumawati"},
        {"id": "bri-nathan", "bank": "Bank BRI", "number": "3344556677", "holder": "Nathan Prasetya"},
        {"id": "mandiri-joint", "bank": "Bank Mandiri", "number": "9988776655", "holder": "Nathan & Elara"}
      ]
    },
    "rsvp": {
      "intro": "We would love to know if you can join us. Please send your RSVP and, if you have a word of kindness to share, it would mean a great deal to us both.",
      "maxGuestsDefault": 2,
      "comments": [
        {"guestName": "Ayu Rahayu", "wishes": "Nathan and Elara — you two make sense together in the most grounded, honest way. Like two plants from the same hillside. I am so happy you found each other. Love you both so much.", "createdAt": "2025-09-01T10:00:00.000Z"},
        {"guestName": "Dimas Satria", "wishes": "Bro, I remember when you came back from that first hike and would not stop talking about this girl who knew every plant name. Look at you now. Congratulations, you two.", "createdAt": "2025-09-01T09:15:00.000Z"},
        {"guestName": "Mbak Nindya", "wishes": "Elara, I have watched you look at forests the way most people look at art. I am glad you found someone who follows you into them. All the love in the world to you and Nathan.", "createdAt": "2025-08-31T20:00:00.000Z"},
        {"guestName": "Pak & Bu Wahyu", "wishes": "To our daughter Elara and her Nathan — you have built something beautiful and steady. We could not be more proud. Wishing you a lifetime of mountain mornings.", "createdAt": "2025-08-31T15:30:00.000Z"},
        {"guestName": "Rizky Maulana", "wishes": "Two of the most patient, thoughtful people I know, choosing each other. Makes perfect sense. Congratulations, Nathan and Elara. See you at the celebration!", "createdAt": "2025-08-30T12:00:00.000Z"}
      ]
    },
    "footer": {
      "closingTitle": ["Thank", "You"],
      "closingText": "Your presence and your blessing are the things that matter most. We are grateful beyond words that you are part of this day with us.",
      "creditLabel": "By nvite.id",
      "creditUrl": "https://nvite.id",
      "links": []
    }
  }`) as InvitationConfig),
};

const ONYX_TEMPLATE: InvitationConfig = {
  ...(JSON.parse(String.raw`{
    "slug": "onyx",
    "template": "onyx",
    "seo": {
      "title": "The Wedding of Adrian & Zara",
      "description": "A minimal, modern digital invitation for Adrian and Zara — a city love story built in the margins of midnight."
    },
    "theme": {
      "accent": "#e0e0e0",
      "background": "#0a0a0a",
      "surface": "#1a1a1a",
      "softSurface": "#f5f5f5"
    },
    "guestQueryParam": "to",
    "couple": {
      "joinedName": "Adrian & Zara",
      "coverLabel": "THE WEDDING OF",
      "dateLabel": "Friday, 4 September 2026",
      "scripture": {
        "text": "Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up.",
        "citation": "Ecclesiastes 4:9-10"
      },
      "quote": "Architecture is the art of how to waste space — but some spaces are worth everything.",
      "bride": {
        "title": "THE BRIDE",
        "fullName": "Zara Maharani",
        "nickname": "Zara",
        "parents": ["The Daughter of", "Mr. Farid Maharani", "Mrs. Indah Maharani"],
        "instagram": "https://www.instagram.com/nvite.id",
        "image": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00145-Large.jpeg"
      },
      "groom": {
        "title": "THE GROOM",
        "fullName": "Adrian Nugroho",
        "nickname": "Adrian",
        "parents": ["The Son of", "Mr. Surya Nugroho", "Mrs. Lestari Nugroho"],
        "instagram": "https://www.instagram.com/nvite.id",
        "image": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00179.jpg"
      }
    },
    "media": {
      "audio": "https://is3.cloudhost.id/externalgroovepublic/MP3/s%C3%B8d%20ven%20-%20infinity%20(lyric%20video)%20(mp3cut.net).mp3",
      "coverImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00207.jpg",
      "heroVideo": "https://is3.cloudhost.id/externalgroovepublic/video%20groove/japan%20vibe.mp4",
      "heroPoster": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00207.jpg",
      "quoteImages": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00203-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00182-Largffe.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-49756523.jpg"
      ],
      "storyImages": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00207.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00208.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00203-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00182-Largffe.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-49756523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00179.jpg"
      ],
      "giftImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00203-Large.jpeg",
      "rsvpImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00208.jpg",
      "videoPoster": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00207.jpg",
      "videoUrl": "https://www.youtube.com/embed/BNQj5Muhss4?autoplay=1&rel=0",
      "thankYouImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00182-Largffe.jpeg",
      "gallery": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00207.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00208.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00203-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00182-Largffe.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-49756523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00179.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00198.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00195-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00169.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00155.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00145-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00216-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00197-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00146-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645fdfd345rge523.jpg"
      ]
    },
    "story": {
      "title": "Drawn in the Same Margins",
      "visible": true,
      "timeline": [
        {
          "year": "2023",
          "title": "Blueprint for Something More",
          "body": "The Jakarta architecture scene is small enough that everyone eventually ends up in the same rooms. Adrian and Zara had been aware of each other for over a year before they actually spoke — colleagues at competing firms who kept appearing at the same presentations, the same panels, the same late-night charrettes when a deadline collapsed everything into fluorescent light and cold coffee.\n\nThe first real conversation happened at 1:30 in the morning in a shared workspace in Menteng. Both of them had borrowed a table to finish separate proposals due the next morning. Adrian was working on a public library in Depok; Zara was redesigning a residential tower in Sudirman. They were on opposite sides of the room for an hour before Zara looked up and said, without introduction: 'Your section elevation is wrong. The cantilever will read as floating if you drop the parapet another thirty centimeters.'\n\nAdrian stared at her. Then looked at his drawing. Then said: 'You're right.'\n\nThey talked until the workspace closed at 3 AM. Then they found a warung outside that was still open and talked until 5. He missed his deadline by two hours. He did not care even a little.\n\nHe asked for her number before the sun was fully up. She gave it to him."
        },
        {
          "year": "2024",
          "title": "The City, Rendered Together",
          "body": "Jakarta, for most people, is something to be endured — the traffic, the heat, the scale of it, the way it swallows you whole. Adrian and Zara decided to love it instead, deliberately, as an act of aesthetic stubbornness.\n\nThey built a shared map. Every Sunday, one of them picked a neighborhood, and they spent the day walking it properly — not as commuters or tourists but as architects, which meant stopping to look at everything: the Dutch colonial buildings going soft at the edges in Kota Tua, the brutalist government blocks in Gambir that nobody else seemed to notice, the narrow houses in Condet where every roof was doing something different and interesting with the problem of rain.\n\nZara kept a sketchbook of facades. Adrian photographed structural details that he later filed by district. By the end of the year they had covered eighteen neighborhoods and had, without discussing it, started showing up in each other's work — a material choice here, a reference there, the kind of influence that only comes from paying close attention to how another person thinks.\n\nThey were not just together by then. They were collaborating in the deepest sense: two minds working on the same problem, even when the problem was different.\n\nAdrian told his best friend that year that he had never felt so known."
        },
        {
          "year": "2025",
          "title": "The Proposal at the Interchange",
          "body": "Adrian had been thinking about it for months, and what he kept coming back to was this: Zara was not a person for grand gestures or borrowed romanticism. She would find a rooftop restaurant with a view embarrassing. She would find a flash mob excruciating. What she loved was the city itself, in its most honest form — not prettified, not curated, but raw and structural and real.\n\nSo he chose the Semanggi interchange.\n\nIt was past midnight on a Friday in early November. He told her he wanted to show her something he had found for a project. She came with her sketchbook, because she always did. They took a motorcycle taxi to a vantage point he had scouted: a parking deck rooftop on the edge of the cloverleaf, where you could see the full geometry of the interchange spread out below — all that concrete movement, the lights tracing arcs through the dark, the city still going at this hour, never entirely still.\n\nZara stood at the edge of the railing for a long time without saying anything, looking. That was the thing about her: she actually looked.\n\nAdrian waited until she turned to him, eyes lit the way they always were when something structural delighted her.\n\n'I want to spend the rest of my life looking at things with you,' he said. 'Every city. Every building. All of it.'\n\nHe had the ring in his jacket pocket. She saw it before he had fully taken it out. She put her hand over his to stop him and said: 'Yes. Adrian. Yes.'\n\nBelow them, the city moved on in its great indifferent loops, and above them, nothing changed, and between them, everything did."
        }
      ]
    },
    "countdown": {
      "label": "The Day is Almost Here",
      "target": "2026-09-04T09:00:00+07:00",
      "calendar": {
        "title": "The Wedding of Adrian & Zara",
        "description": "Join us for the wedding celebration of Adrian and Zara in Jakarta.",
        "location": "Jl. Sudirman No.1, Karet Tengsin, Tanah Abang, Jakarta Pusat 10220, Indonesia",
        "start": "2026-09-04T09:00:00+07:00",
        "end": "2026-09-04T13:00:00+07:00"
      },
      "image": ""
    },
    "events": {
      "title": "Wedding / Details",
      "dateLabel": "Friday\n04.09.2026",
      "details": [
        {
          "title": "Holy Matrimony",
          "time": "9 AM - 10 AM",
          "location": "Jl. Sudirman No.1, Karet Tengsin, Tanah Abang, Jakarta Pusat 10220, Indonesia",
          "link": "https://maps.app.goo.gl/78MwTKCz1Qn13PFD8",
          "linkLabel": "View map"
        },
        {
          "title": "Reception",
          "time": "10 AM - 1 PM",
          "location": "Jl. Sudirman No.1, Karet Tengsin, Tanah Abang, Jakarta Pusat 10220, Indonesia",
          "link": "https://maps.app.goo.gl/78MwTKCz1Qn13PFD8",
          "linkLabel": "View map"
        },
        {
          "title": "A Guide to Dress Codes",
          "text": "We invite our guests to dress in sharp, monochromatic tones: All Black, Charcoal, or Deep Navy."
        },
        {
          "title": "Join Us Virtually",
          "time": "9 AM - 1 PM",
          "text": "If you cannot be with us in person, we would still love your presence in spirit. Watch our live stream and send your best wishes from wherever you are.",
          "link": "https://www.youtube.com/@Groovepublic/videos",
          "linkLabel": "Watch live stream"
        }
      ]
    },
    "gift": {
      "intro": "Your presence on this day is the only thing we asked for. If you wish to give more, we are grateful — please use the accounts below:",
      "visible": true,
      "accounts": [
        {"id": "bca-zara", "bank": "Bank BCA", "number": "5544332211", "holder": "Zara Maharani"},
        {"id": "mandiri-adrian", "bank": "Bank Mandiri", "number": "2233445566", "holder": "Adrian Nugroho"},
        {"id": "bni-joint", "bank": "Bank BNI", "number": "6677889900", "holder": "Adrian & Zara"}
      ]
    },
    "rsvp": {
      "intro": "Please let us know if you will be joining us. Your RSVP means the world, and if you have a word or wish to share, we would love to receive it.",
      "maxGuestsDefault": 2,
      "comments": [
        {"guestName": "Kevin Hartanto", "wishes": "Adrian, I remember when you would not stop talking about this woman who critiqued your elevation at 1 AM. Best thing that ever happened to you. Congratulations to you both.", "createdAt": "2025-11-15T10:00:00.000Z"},
        {"guestName": "Mira Sanjaya", "wishes": "Zara — you are the most precise, exacting person I know, and you chose him without hesitation. That says everything. Congratulations, you two. Cannot wait to celebrate.", "createdAt": "2025-11-15T09:00:00.000Z"},
        {"guestName": "Tim Studio Tiga", "wishes": "From all of us at the office: we always knew this was going to happen. You two think the same way. Congratulations, Adrian and Zara. The city is better for having you both in it.", "createdAt": "2025-11-14T18:00:00.000Z"},
        {"guestName": "Pak Farid & Bu Indah", "wishes": "To our daughter Zara and her Adrian — we watched you choose each other carefully, with open eyes. That is the only way to do it. We are so proud and so happy. All our love.", "createdAt": "2025-11-14T14:00:00.000Z"},
        {"guestName": "Anya Permata", "wishes": "The two sharpest minds I know, deciding to build something together. Of course you are getting married. It was always going to be this. Love and congratulations to you both.", "createdAt": "2025-11-14T11:00:00.000Z"}
      ]
    },
    "footer": {
      "closingTitle": ["Thank", "You"],
      "closingText": "We are grateful for everyone who has been part of this story — and for everyone who will be there when the next chapter begins.",
      "creditLabel": "By nvite.id",
      "creditUrl": "https://nvite.id",
      "links": []
    }
  }`) as InvitationConfig),
};

export const TEMPLATES: TemplateDefinition[] = [
  {
    slug: 'lumiere',
    name: 'Lumiere',
    available: true,
    content: LUMIERE_TEMPLATE,
  },
  {
    slug: 'bloom',
    name: 'Bloom',
    available: true,
    content: BLOOM_TEMPLATE,
  },
  {
    slug: 'sage',
    name: 'Sage',
    available: true,
    content: SAGE_TEMPLATE,
  },
  {
    slug: 'onyx',
    name: 'Onyx',
    available: true,
    content: ONYX_TEMPLATE,
  },
];

export function getTemplateBySlug(slug: string) {
  return TEMPLATES.find((template) => template.slug === slug.toLowerCase());
}

const RESERVED_SLUGS = new Set([
  'templates',
  'dashboard',
  'login',
  'signup',
  'auth',
  'claire',
]);

export function isReservedSlug(slug: string) {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
