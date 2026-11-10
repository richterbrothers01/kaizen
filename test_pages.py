#!/usr/bin/env python3
"""Checks for the 5 Kaizen landing pages, in the spirit of the
web-interface-guidelines skill: terse findings grouped by file."""
import os
import re
import sys

ROOT = os.path.expanduser("~/workspace/kaizen/landing-pages")
SLUGS = ["kaizen-1-climb", "kaizen-2-glass", "kaizen-3-night", "kaizen-4-flow", "kaizen-5-zen"]
SOCIAL_URLS = ["x.com/kaizenbrowser", "instagram.com/kaizenbrowser",
               "youtube.com/@kaizenbrowser", "reddit.com/user/kaizenbrowser",
               "indiehackers.com/kaizenbrowser"]

failures = 0

for slug in SLUGS:
    d = os.path.join(ROOT, slug)
    print(f"## {slug}/index.html")
    issues = []
    html_path = os.path.join(d, "index.html")
    if not os.path.exists(html_path):
        print(f"{slug}/index.html:0 - MISSING file")
        failures += 1
        continue
    html = open(html_path, encoding="utf-8").read()
    lines = html.splitlines()

    def line_of(pat):
        for n, ln in enumerate(lines, 1):
            if re.search(pat, ln):
                return n
        return 1

    # assets
    frames = [f for f in os.listdir(os.path.join(d, "frames")) if f.endswith(".webp")]
    if len(frames) != 72:
        issues.append((1, f"frame sequence incomplete: {len(frames)}/72 frames"))
    for asset in ("poster.jpg", "logo.webp", "fuji-fantastic.otf",
                  "favicon.ico", "favicon-32.png", "apple-touch-icon.png"):
        if not os.path.exists(os.path.join(d, asset)):
            issues.append((1, f"missing asset {asset}"))

    # document basics
    if '<meta name="viewport" content="width=device-width, initial-scale=1">' not in html:
        issues.append((line_of("viewport"), "viewport meta missing or wrong"))
    if "user-scalable=no" in html or "maximum-scale" in html:
        issues.append((line_of("user-scalable|maximum-scale"), "zoom disabled (anti-pattern)"))
    if html.count("<h1") != 1:
        issues.append((line_of("<h1"), f"expected exactly 1 <h1>, found {html.count('<h1')}"))
    if '<a class="skip"' not in html:
        issues.append((1, "skip link missing"))
    for tag in ("<header", "<main", "<footer", "<nav"):
        if tag not in html:
            issues.append((1, f"semantic landmark {tag} missing"))

    # accessibility / interaction rules
    if html.count('aria-label="Kaizen on ') < 10:  # 5 socials x header+footer
        issues.append((1, f"social links need aria-labels (found {html.count(chr(39)) and html.count('aria-label=' + chr(34) + 'Kaizen on ')} sets)"))
    if "<label for=\"wl-email\">" not in html:
        issues.append((line_of("wl-email"), "waitlist input lacks <label>"))
    if 'type="email"' not in html or 'autocomplete="email"' not in html or 'name="email"' not in html:
        issues.append((line_of('type="email"'), "email input type/autocomplete/name incomplete"))
    if 'aria-live="polite"' not in html:
        issues.append((1, "async form feedback lacks aria-live"))
    if "prefers-reduced-motion" not in html:
        issues.append((1, "no prefers-reduced-motion handling"))
    if 'role="img"' not in html:
        issues.append((1, "canvas lacks role=img label"))

    # anti-patterns from the guidelines
    if "transition: all" in html or "transition:all" in html:
        issues.append((line_of(r"transition:\s*all"), "transition: all (anti-pattern)"))
    if re.search(r"outline:\s*none|outline-none", html):
        issues.append((line_of("outline"), "outline removed without replacement"))
    if "..." in html.replace("f000", ""):  # frame names use fNNN, ignore none
        issues.append((line_of(r"\.\.\."), '"..." used instead of "…"'))
    if "onPaste" in html:
        issues.append((1, "paste handler present"))

    # responsiveness + images
    if "@media (max-width:760px)" not in html and "@media (max-width: 760px)" not in html:
        issues.append((1, "no mobile breakpoint"))
    if 'width="34" height="34"' not in html:
        issues.append((1, "logo img missing explicit width/height (CLS)"))

    # socials
    for u in SOCIAL_URLS:
        if u not in html:
            issues.append((1, f"social URL missing: {u}"))

    # scrub engine wiring
    for token in ('id="seq"', "frames/f", "requestAnimationFrame", "data-from"):
        if token not in html:
            issues.append((1, f"scrub engine token missing: {token}"))

    # regression checks for the v2 fixes (user screenshots, 2026-11-10)
    if "scroll-margin-top" not in html:
        issues.append((1, "anchored sections lack scroll-margin-top (header clips content)"))
    if 'data-from="-0.08"' not in html:
        issues.append((1, "first hero act not visible at scroll top"))
    if 'data-to="1.08"' not in html:
        issues.append((1, "last hero act vanishes before scrub ends"))
    for token in ("Yuji Syuku", "Zen Kaku Gothic New", "fonts.googleapis.com",
                  "@font-face", "Fuji Fantastic", "fuji-fantastic.otf"):
        if token not in html:
            issues.append((1, f"Japanese font wiring missing: {token}"))
    if "japan-ramen" in html.lower():
        issues.append((1, "old JAPAN RAMEN font still referenced (personal-use license)"))
    # v4: Fuji Fantastic has no digits/dashes/curly quotes/& — display copy must avoid them
    for bad in ("Mood-Aware", "ten-tab", "spreadsheet-plus", "It’s 1 AM",
                "You’re not lazy", "clears the desk —", "Speaks &amp; Listens",
                "Pros &amp; cons. Next step", '<p class="display">1%'):
        if bad in html:
            issues.append((1, f"display copy uses a glyph Fuji Fantastic lacks: {bad!r}"))
    # v3: hero scroll hint + progress line removed at the user's order
    for gone in ('class="scrolldown"', 'class="progress"', ">Scroll<"):
        if gone in html:
            issues.append((1, f"hero element should have been removed: {gone}"))
    # v5: KAIZEN kicker removed from the first hero act; branded scrollbar present
    if 'class="kicker"' in html:
        issues.append((1, "hero kicker still present (user ordered it removed)"))
    for token in ("::-webkit-scrollbar", "scrollbar-color", "color-scheme:dark"):
        if token not in html:
            issues.append((1, f"branded scrollbar wiring missing: {token}"))
    # v6: logo as favicon
    for token in ('rel="icon" href="favicon.ico"', 'sizes="32x32" href="favicon-32.png"',
                  'rel="apple-touch-icon"'):
        if token not in html:
            issues.append((1, f"favicon link missing: {token}"))
    if 'class="route"' in html and ".mock ul li::before" not in html:
        issues.append((1, "route badges still collide with .mock list styles"))

    if issues:
        for ln, msg in issues:
            print(f"{slug}/index.html:{ln} - {msg}")
        failures += len(issues)
    else:
        print("✓ pass")

print(f"\nTOTAL ISSUES: {failures}")
sys.exit(1 if failures else 0)
