import type { Level, TourId } from '../data'

type TourText = { name: string; country: string; note: string; season: string }

export const en = {
  meta: {
    title: 'ALTUS — Guided mountain expeditions',
    description:
      'ALTUS — guided ascents of Kilimanjaro, Kazbek, Mont Blanc, Ararat and the Himalayas with IFMGA-certified guides.',
  },
  locale: 'en-US',
  units: { m: 'm' },
  loader: 'Loading…',
  days: (n: number) => `${n} days`,

  nav: {
    approach: 'Approach',
    tours: 'Expeditions',
    process: 'How it works',
    contact: 'Contact',
    book: 'Book a spot',
    bookMobile: 'Book your spot',
    open: 'Open menu',
    close: 'Close menu',
    home: 'ALTUS — home',
    main: 'Main navigation',
    mobile: 'Mobile navigation',
    language: 'Language',
  },

  hero: {
    badge: 'Season 2027 · now booking',
    line1: 'Above the clouds',
    line2: 'silence begins',
    lead: 'Guided ascents of Kilimanjaro, Kazbek, Mont Blanc and the Himalayas. Small teams, IFMGA guides and routes refined over 14 seasons.',
    cta: 'Choose your summit',
    secondary: 'How we climb',
    card: {
      label: 'Next departure',
      spots: '3 spots left',
      peak: 'Kilimanjaro',
      dates: 'Jun 12 — 20 · 9 days',
      booked: '5 of 8 climbers already in',
    },
    scroll: 'Keep scrolling — the mountain comes alive',
  },

  approach: {
    label: 'Approach',
    statement:
      'We don’t sell summits. We prepare people who reach them — and come home with something bigger than a photo from the top.',
    features: [
      {
        title: 'IFMGA guides',
        text: 'International certification and at least 40 ascents on every route we lead. One guide per three climbers on technical terrain.',
      },
      {
        title: 'Teams of up to 8',
        text: 'A small team moves at the pace of its slowest member — and that is exactly why it reaches the summit together.',
      },
      {
        title: 'Science-based acclimatization',
        text: 'Pulse oximetry morning and night, reserve days in every schedule and a satellite link to a mountain doctor.',
      },
      {
        title: 'Gear included',
        text: 'Crampons, ice axe, harness and helmet — checked, fitted and waiting at base camp. You just bring yourself.',
      },
    ],
    stats: ['seasons in the mountains', 'people on summits', 'of teams reach the top', 'countries on our route map'],
  },

  tours: {
    label: 'Season routes',
    title: 'Six peaks. *One of them is yours.*',
    lead: 'Keep scrolling to explore — every route is led by a guide who has stood on that summit dozens of times.',
    difficulty: 'Difficulty',
    season: 'Season',
    from: 'from',
    book: 'Book',
    levels: { start: 'First summit', advanced: 'Experienced', expedition: 'Expedition' } as Record<Level, string>,
    custom: {
      title: 'Didn’t find your peak?',
      text: 'We design private expeditions for friends and corporate teams — any mountain, any dates.',
      cta: 'Plan a private trip',
    },
    items: {
      kilimanjaro: {
        name: 'Kilimanjaro',
        country: 'Tanzania',
        note: 'Machame route — five climate zones in one week',
        season: 'year-round',
      },
      ararat: {
        name: 'Ararat',
        country: 'Türkiye',
        note: 'South route via the high camp at 4,200 m',
        season: 'June — September',
      },
      kazbek: {
        name: 'Kazbek',
        country: 'Georgia',
        note: 'Gergeti glacier and a night at the Meteo station',
        season: 'July — August',
      },
      montblanc: {
        name: 'Mont Blanc',
        country: 'France · Alps',
        note: 'Classic Goûter route via the Tête Rousse hut',
        season: 'June — September',
      },
      mera: {
        name: 'Mera Peak',
        country: 'Nepal · Himalayas',
        note: 'Five eight-thousanders in view from the summit',
        season: 'April, October',
      },
      amadablam: {
        name: 'Ama Dablam',
        country: 'Nepal · Khumbu',
        note: 'A technical ridge for well-prepared climbers',
        season: 'October — November',
      },
    } as Record<TourId, TourText>,
  },

  process: {
    label: 'How it works',
    title: 'From the first call *to the summit*',
    lead: 'Four stages — and at every one of them, someone who has already stood on that summit. You think about the next step; we handle everything else.',
    stage: 'Stage',
    steps: [
      {
        mark: '0 m',
        title: 'Getting to know you',
        text: 'We call, talk through your experience and health, and match you with a peak and dates. No sales scripts — you talk to the guide who will lead your team.',
      },
      {
        mark: '1,200 m',
        title: 'Preparation',
        text: 'A 12-week training plan, a gear checklist and a private team chat. Every two weeks — a fitness check-in with a coach.',
      },
      {
        mark: '4,100 m',
        title: 'The expedition',
        text: 'Acclimatization hikes, crampon and ice-axe school, the summit night. The go / no-go call is made by your guide based on weather and how you feel.',
      },
      {
        mark: 'Summit',
        title: 'And after it',
        text: 'A summit certificate, photos and video from the route — and for those who got hooked, a plan for the next mountain with 10% off.',
      },
    ],
  },

  quote: {
    text: 'At 5 a.m. on Stella Point I realized that for the first time in ten years I wasn’t thinking about anything. Just breathing, walking and watching the sunrise set Africa on fire.',
    initials: 'AK',
    name: 'Anna Kovalenko',
    meta: 'Kilimanjaro, August 2026 · first summit',
  },

  rail: 'summits worth the climb',

  contact: {
    label: 'Get in touch',
    title: 'Which summit *do you dream of?*',
    lead: 'Leave your contacts — a guide will call you back within a day, answer your questions and honestly tell you whether you’re ready for the mountain you chose.',
    phone: 'Phone',
    email: 'Email',
    office: 'Office',
    address: '66/2 Frantsuzkyi Blvd, Odesa, Odesa Oblast, Ukraine, 65000',
    form: {
      name: 'Name',
      namePh: 'Anna',
      contact: 'Phone or email',
      contactPh: '+38 063 000 00 00',
      route: 'Route',
      routeNone: 'Not sure yet — help me choose',
      exp: 'Your mountain experience',
      expOptions: ['None yet', 'Hiking', 'Mountaineering'],
      comment: 'Comment',
      commentPh: 'Preferred dates, team size, health questions…',
      consent: 'I agree to the processing of my personal data and to a call from a guide',
      submit: 'Send request',
      sending: 'Sending…',
      errors: {
        name: 'How should we address you?',
        contact: 'We need a phone or email to call you back',
        consent: 'Please confirm consent to data processing',
      },
      success: {
        title: 'Request received',
        text: 'A guide will contact you within one business day. In the meantime — start taking the stairs instead of the elevator.',
        again: 'Send another one',
      },
    },
  },

  footer: {
    tagline: 'Mountain expeditions for those who want to go higher — safely, calmly and with people who genuinely care.',
    routes: 'Routes',
    company: 'Company',
    social: 'Social',
    himalaya: 'Himalayas',
    rights: '© 2026 ALTUS Expeditions. All rights reserved.',
    top: 'Back to top ↑',
  },
}

export type Dict = typeof en
