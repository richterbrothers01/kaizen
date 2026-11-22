# Kaizen — Browser Demo

A clickable prototype of the Kaizen browser UI, built with **React + Vite + motion**.
It is a web demo of how the browser looks and works — **not a real browser** and
not the live Kaizen website.

## What's inside

- **Browser chrome** — tab bar (switchable tabs, close, + new tab), address bar,
  back / forward / reload, profile dot.
- **Sidebar** — Route, Tabs, Focus, Library, Settings. All of them open real views.
- **New tab page** — big ask bar, suggested questions, shortcut pills, TAB TAX strip
  ("27 tabs to 1 route"), FOCUS pill ("25:00 · Lo-fi beats"), "1% better, every day."
- **Answer screen** — ask "How to choose a CRM for a small team" (or click the
  suggested question) and the KaizenAI panel slides in: THE ANSWER (HubSpot Free),
  PROS AND CONS, WHAT TO CLICK, NEXT STEP with a gold "Do it now" button, Sources.
  Two more demo questions (invoicing, registering a startup in India) show the same
  layout, marked DEMO ANSWER.
- **Guidance / focus mode** — open the IRCTC tab and hit **Guide me**: everything
  except the login card greys out, and a side panel shows what to click next
  (green ticks, click to check them off), what NOT to click (red crosses), what
  happens after each click, and the next steps. Toggle it off to restore the page.
- **Focus timer** — a working 25:00 countdown with start / pause / reset.
- **Library** — save answers from the answer screen and open them again later.
- **Settings** — reduce motion, tab-tax meter, focus sounds (all wired up).

## How to run it (Windows)

1. Open this folder in VS Code (or a terminal in this folder).
2. Install the packages (first time only):

   ```
   npm install
   ```

3. Start the demo:

   ```
   npm run dev
   ```

4. Open the localhost link it prints (usually http://localhost:5173) in your browser.

To make a production build instead:

```
npm run build
```

That creates a `dist/` folder. Serve it with `npm run preview` and open the
localhost link it prints.

## Design

Strict Kaizen tokens: background #080808, window #0E0E0E, cards #161616,
lines #2E2E2E, pills #1E1E1E, sidebar #101010, panel #141414, text #F5F5F5,
grey #A0A0A0, dim #6E6E6E, accent Signal Gold #F2B33D (used sparingly).
UI font: Zen Kaku Gothic New. Wordmark: Fuji Fantastic.
Animations: `motion` (imported from `motion/react`). Icons: `lucide-react`,
with `react-icons` for brand marks (YouTube, GitHub, X, Gmail, Notion, Linear).
