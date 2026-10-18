# ALTUS — Mountain Expeditions Landing

A single-page landing site for guided mountain expeditions, built around a full-screen video background that **plays as you scroll and freezes when you stop**.

## Features

- **Scroll-driven video background.** The video's playback position follows the page scroll. When scrolling stops, the frame holds.
- **Cinematic intro.** After the video has loaded, the bare first frame is shown for 2 seconds. Then the header and hero content fade in (scrolling skips the wait).
- **Glass header.** Starts transparent, turns into frosted glass once you scroll, and stays pinned to the top.
- **EN / UA localization.** Full English and Ukrainian translations with a header language switcher. The choice is remembered in `localStorage`.
- **Sections.** Hero, approach, a scroll-velocity marquee, season routes, how it works, a testimonial, a contact form and the footer:
  - **Hero:** letter-by-letter 3D blur reveal of the title.
  - **Approach:** a sticky statement whose words sharpen out of blur as you scroll, and feature cards with a glow that follows the cursor.
  - **Marquee:** speeds up and flips direction with the scroll.
  - **Season routes:** a pinned section that scrolls horizontally from right to left.
  - **How it works:** a timeline with a progress line drawn on scroll.
  - **Contact form:** client-side validation; the selected tour is pre-filled from the "Book" buttons.
  - **Footer:** an interactive 3D extruded wordmark that tilts toward the cursor and lights up per letter on hover.
- Responsive layout, mobile menu, and support for `prefers-reduced-motion`.

## Tech stack

| Purpose         | Library                                           |
| --------------- | ------------------------------------------------- |
| UI              | React 19 + TypeScript                             |
| Build tool      | Vite                                              |
| Styling         | Tailwind CSS v4                                   |
| Animation       | GSAP 3 (ScrollTrigger) + `@gsap/react`            |
| Smooth scroll   | Lenis                                             |
| HLS (optional)  | hls.js — lazy-loaded only for `.m3u8` sources     |

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
```

## Project structure

```
public/video/            Encoded background videos + poster
src/
  App.tsx                Page composition, intro timing, global reveal animations
  data.ts                Tours (altitude, days, difficulty, USD price), stats, contacts
  i18n/                  Language context + en.ts / uk.ts dictionaries
  lib/lenis.ts           Smooth scroll setup and anchor scrolling
  components/
    ScrollVideo.tsx      Video loading, loading overlay, scroll-to-seek
    Header.tsx           Glass header, navigation, mobile menu
    LangSwitcher.tsx     EN / UA toggle
    Hero.tsx             Intro reveal and hero content
    Approach.tsx         Sticky statement, glow cards, counters
    Rail.tsx             Scroll-velocity marquee
    Tours.tsx            Pinned horizontal tours carousel
    Process.tsx          Timeline
    Contact.tsx          Contact form
    Footer.tsx           Footer
    Logo3D.tsx           Interactive 3D wordmark
    RevealHeading.tsx    Reusable letter-by-letter heading reveal
```

## How the scroll video works

`ScrollVideo.tsx` maps scroll progress onto the video timeline:

1. **Fully buffered source.** The MP4 is downloaded into memory as a Blob, with load progress shown in the overlay. This makes every seek instant.
2. **Scroll-to-time mapping.** A ScrollTrigger spans the whole document:

   ```
   currentTime = scrollProgress × duration
   ```

3. **Throttled seeking.** While the decoder is still seeking (`video.seeking`), new targets are queued. The latest one is applied on the `seeked` event. This avoids flooding the decoder with requests and keeps scrubbing smooth.
4. **Never autoplays.** The video stays paused at all times; only scrolling moves it.

HLS streams (`.m3u8`) are supported too: Safari plays them natively, and other browsers use hls.js with the highest quality level forced.

### Encoding your own video

Smooth scrubbing needs a keyframe on every frame (all-intra). The bundled files were produced with ffmpeg:

```bash
# Desktop
ffmpeg -i source.mp4 -an -vf "scale=1920:-2,format=yuv420p" \
  -c:v libx264 -preset slow -crf 24 -g 1 -keyint_min 1 -sc_threshold 0 \
  -movflags +faststart public/video/mountains-1080.mp4

# Mobile (served below 768px wide)
ffmpeg -i source.mp4 -an -vf "scale=1280:-2,format=yuv420p" \
  -c:v libx264 -preset slow -crf 26 -g 1 -keyint_min 1 -sc_threshold 0 \
  -movflags +faststart public/video/mountains-720.mp4

# Poster frame
ffmpeg -i source.mp4 -frames:v 1 -vf "scale=1920:-2" -q:v 4 public/video/poster.jpg
```

## Customization

| What                     | Where                                                         |
| ------------------------ | ------------------------------------------------------------- |
| Texts and translations   | `src/i18n/en.ts`, `src/i18n/uk.ts`                            |
| Tours, prices, stats     | `src/data.ts` (`TOURS`, `STATS`)                              |
| Phone, email             | `src/data.ts` (`CONTACTS`); the address is in the dictionaries |
| Intro hold duration      | `INTRO_HOLD_MS` in `src/App.tsx`                              |
| Colors, fonts, effects   | `src/index.css` (`@theme` tokens, `glass`, `glow-card`, `link-underline`) |

### Adding a language

1. Create a new dictionary typed as `Dict`, using `src/i18n/uk.ts` as a template.
2. Register it in `DICTS` in `src/i18n/index.tsx`.
3. Add an option to `src/components/LangSwitcher.tsx`.

## Notes

- **Fonts.** English uses Black Ops One (hero) and Asap Sharp (everything else). Neither font includes Cyrillic, so the Ukrainian version switches to Russo One and Fira Sans via `html:lang(uk)` in `src/index.css`.
- **Contact form.** It validates input and shows a success state, but does not send data anywhere yet. Hook up a real endpoint (CRM, Telegram bot, email service) where the `TODO` is in `src/components/Contact.tsx`.
- **Source video.** The original 4K source is not kept in the repository. The site only uses the encoded files in `public/video/`; to replace them, follow [Encoding your own video](#encoding-your-own-video).
