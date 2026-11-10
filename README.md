# Kaizen — the browser for entrepreneurs

Live site: **https://kaizenbrowser.vercel.app**

Kaizen is a minimal browser for entrepreneurs, built in public from India.
Search less. Get the answer, the pros and cons, and the exact next step.
1% better, every day.

## What this repo holds

- `index.html` — the live landing page (the **Flow** direction: gold streams
  converging into one bright route, scroll-scrubbed frame sequence, waitlist form)
- `build_pages.py` — builds the five landing-page directions (Climb, Glass,
  Night, Flow, Zen) from one engine
- `render_frames.py` — renders the 72-frame scroll sequences (the frames are
  generated assets; they live in the Vercel deployment, not in this repo)
- `test_pages.py` — the verification suite for the pages (accessibility,
  fonts, frames, social links)
- `tokens.css` — design tokens generated from the Kaizen brand gold

Socials: X, Instagram and YouTube as **@kaizenbrowser**; Reddit
`u/kaizenbrowser`; Indie Hackers `kaizenbrowser`.

## Fonts (license-clean)

- Headlines: **Fuji Fantastic** — free for commercial use per its EULA
- Brush accents: **Yuji Syuku** (Google Fonts, commercial-safe)
- Body: **Zen Kaku Gothic New** (Google Fonts, commercial-safe)

Note: Fuji Fantastic has only 60 characters (alphabet + `! $ % ' , . ?`),
so display copy is written to what it can draw — no digits, hyphens,
curly quotes or `&` in headlines. The earlier JAPAN RAMEN font was
removed for this reason: personal use only, no commercial use.

## Waitlist form

The form on the live site is currently front-end only: it validates and
shows "You are on the list" on screen, but collects nothing until it is
wired to a form backend. Wiring it is a free, five-minute job
(Formspree free tier, 50 submissions/month) — see the patch notes in
the workspace before pointing the form at a live endpoint.
