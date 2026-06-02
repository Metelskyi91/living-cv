# 🧠 Living CV — TODO Plan
> Interactive personal CV website for Ihor Metelskyi (QA Engineer)
> Goal: viral LinkedIn presence + recruiter WOW effect

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| PDF Export | Puppeteer (server-side render) |
| Auth | NextAuth.js + GitHub OAuth |
| Data | `cv.json` (single source of truth) |
| Deploy | Vercel |
| Security | CSP headers, middleware, rate limiting |

---

## 📁 Project Architecture

```
/app
  /page.tsx                  ← public CV site
  /admin
    /page.tsx                ← protected editor panel
    /layout.tsx              ← auth guard
  /api
    /export-pdf/route.ts     ← PDF generation endpoint
    /auth/[...nextauth]      ← GitHub OAuth handler
/components
  /cv
    ClassicView.tsx          ← clean mode
    HackerView.tsx           ← interactive mode
    SkillBar.tsx
    Timeline.tsx
    ContactPR.tsx
    ModeToggle.tsx           ← floating switch button
  /admin
    CVEditor.tsx
    SectionEditor.tsx
    LivePreview.tsx
/data
  cv.json                    ← all CV content lives here
/lib
  pdf.ts
  auth.ts
/public
  og-image.png               ← LinkedIn preview image
```

---

## 👁️ Two View Modes

### Mode 1 — `CLASSIC`
> Clean, minimal. For recruiters who just want to read.

- White / dark background
- Readable typography, standard CV layout
- Fully responsive (mobile first)
- Export PDF button visible

### Mode 2 — `HACKER` *(default)*
> The "Living CV" experience. Makes people stop scrolling.

- Hero with typewriter effect:
  ```
  While others submit PDFs...
  I ship experiences.
  ```
- Animated skill metrics (uptime / coverage style)
- Work experience as Release Notes
- Contact section as Pull Request form
- Framer Motion animations throughout
- Floating toggle to switch between modes

---

## 🔐 Security Checklist

- [ ] NextAuth — GitHub OAuth with email whitelist (only your account)
- [ ] Middleware protecting `/admin/*` from all other users
- [ ] `Content-Security-Policy` headers via `next.config.js`
- [ ] Rate limiting on `/api/export-pdf` — max 10 req/min per IP
- [ ] All secrets in `.env.local` — nothing in client bundle
- [ ] HTTPS only (Vercel default)
- [ ] No sensitive data exposed via API routes

---

## 📄 PDF Export

```
Route:   GET /api/export-pdf
Output:  CV_Ihor_Metelskyi.pdf

Flow:
  1. Puppeteer opens /cv?mode=classic&print=true
  2. Renders pixel-perfect A4 layout
  3. Returns PDF file for download
  4. Rate limiter prevents abuse

Print mode rules:
  - No animations
  - No toggle buttons or UI chrome
  - Clean A4 layout with proper margins
  - Automatic page breaks between sections
```

---

## 🥚 Easter Egg — Konami Code

```
Trigger:  ↑ ↑ ↓ ↓ ← → ← → B A

Effect:   Fullscreen terminal overlay appears:

  > CLASSIFIED ACCESS GRANTED
  > Loading secret profile...
  > Fun fact: Ihor once found a bug in a bug report.
  > Skills: [████████████████] OVER 9000
  > Easter egg found. You'd make a good QA.
  > [ Close terminal ]
```

---

## ✏️ Admin Panel `/admin`

> Protected by GitHub OAuth — only your account has access

### Features
- [ ] Edit each CV section (rich text input)
- [ ] Add / remove work experience entries
- [ ] Add / remove skills with levels
- [ ] Live preview of changes side-by-side
- [ ] Save changes to `cv.json`
- [ ] "Publish" button → triggers Vercel redeploy via webhook

---

## 📋 Phases

### ✅ Phase 1 — Foundation
- [ ] Init Next.js 14 + TypeScript + Tailwind CSS
- [ ] Create `cv.json` with all data from current CV
- [ ] Base component structure and routing
- [ ] Deploy skeleton to Vercel

### ✅ Phase 2 — Classic View
- [ ] `ClassicView.tsx` — clean CV layout
- [ ] Mobile-first responsive design
- [ ] Dark / Light mode toggle
- [ ] PDF export via Puppeteer

### ✅ Phase 3 — Hacker View
- [ ] Hero section with typewriter animation
- [ ] `SkillBar.tsx` — animated uptime-style metrics
- [ ] `Timeline.tsx` — work history as Release Notes
- [ ] `ContactPR.tsx` — contact as Pull Request form
- [ ] Floating mode toggle button (Classic ↔ Hacker)

### ✅ Phase 4 — Security + Admin
- [ ] NextAuth.js + GitHub OAuth setup
- [ ] Middleware route protection for `/admin`
- [ ] CSP headers + rate limiting
- [ ] Admin editor UI with live preview
- [ ] Publish webhook to Vercel

### ✅ Phase 5 — Polish & Launch
- [ ] Konami Code easter egg
- [ ] OG image for LinkedIn link preview
- [ ] Lighthouse audit — target score 95+
- [ ] Cross-device testing (mobile, tablet, desktop)
- [ ] Short domain setup: `ihor.dev` or `metelskyi.dev`
- [ ] "Share on LinkedIn" button with pre-filled text

---

## 🎯 LinkedIn Virality Checklist

- [ ] OG preview image shows Hacker mode screenshot
- [ ] Hero phrase visible in first 3 seconds on mobile
- [ ] Page loads under 2s (Core Web Vitals green)
- [ ] "Share" button with ready-made LinkedIn post text
- [ ] URL is short and memorable

---

## 📌 Notes

- `cv.json` is the **only** place to update CV content — both views read from it
- Classic mode is the PDF source — Hacker mode is the viral source
- Admin panel is invisible to public — no link to it anywhere on the site
- Easter egg should work on both desktop (keyboard) and mobile (touch sequence)
