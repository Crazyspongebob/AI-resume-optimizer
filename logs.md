# Development Log — AI简历优化助手

---

## 2026-03-26 — Fix: JSON truncation causing parse failure on /api/analyze

### Problem
`POST /api/analyze` returned 500: `JSON parse failed: Expected ',' or ']' after array element`.
The log showed the `extra` array cut off mid-string at `"Springer Nature` — the JSON was genuinely truncated, not just containing bare newlines.

### Root Cause
`max_tokens: 4096` was too low. The `rewrittenResume` field alone can consume 1000–2000 tokens of Markdown. When the model hit the limit mid-JSON, it stopped generating, producing unparseable output. The previous sanitizer (char-by-char newline escaper) couldn't fix truncation — a truncated JSON has no closing `}`.

### Fixes Applied

**1. `backend/services/aiService.js`**
- Raised `max_tokens` from `4096` → `8192` to accommodate long rewritten resumes.
- Added `finish_reason === 'length'` detection: if the model was cut off by the token limit, throw immediately so the fallback chain tries the next provider instead of attempting to parse a broken response.

**2. `backend/prompts/resumePrompt.js`**
- Added explicit "Strict JSON Output Rules" block at the top of SYSTEM_PROMPT with 5 numbered rules.
- Specifically instructs the model that `rewrittenResume` must be a **single-line JSON string** with all newlines escaped as `\n` — this is the most common source of both truncation (long content) and parse errors (bare newlines).
- Added a 6-item pre-output self-check checklist to `buildUserPrompt` covering JSON completeness, single-line strings, and structural integrity.

### Commit
`fix: raise max_tokens to 8192, detect truncation, enforce strict JSON in prompt`

---

## 2026-03-26 — Fix: pdf-parse v2 API compatibility

### Problem
After installing `pdf-parse@2.4.5`, the PDF upload feature threw:
```
PDF 解析失败：pdfParse is not a function
```

### Root Cause
`pdf-parse` underwent a **breaking API change between v1 and v2**:

| Version | Export shape | Usage |
|---|---|---|
| v1 (≤1.x) | `module.exports = function(buffer) {}` | `const text = (await pdfParse(buf)).text` |
| v2 (2.x) | `module.exports = { PDFParse: class, ... }` | `new PDFParse({data: buf}); await p.getText()` |

Our code used the v1 pattern (`require('pdf-parse')` called as a function) but `npm install pdf-parse` resolved to `^2.4.5`, which exports a class named `PDFParse`, not a callable function.

### Fix Applied
`backend/services/pdfService.js`:
- Detect the installed API shape at require-time:
  ```js
  const pdfParseModule = require('pdf-parse');
  const PDFParse = pdfParseModule.PDFParse || pdfParseModule;
  ```
- Branch on which API is available:
  - v2 path: `new PDFParse({ data: buffer })` → `await parser.getText()` → `result.pages.map(p => p.text).join('\n')`
  - v1 path (fallback): `await PDFParse(buffer)` → `data.text`

This makes the service forward-compatible with v2 while remaining backward-compatible with v1 if downgraded.

### Commit
`fix: handle pdf-parse v2 class-based API in pdfService`

---

## 2026-03-26 — Fix: Dynamic suggestion count (7-dimension strategy)

### Problem
The AI always returned exactly 3 suggestions regardless of resume quality.

### Root Cause
Any numeric floor or range in the prompt ("至少3条", "3-5条") causes Chinese LLMs to converge on the minimum value. The model treats the count constraint as a quota to satisfy, not a quality gate.

### Fix Applied
Replaced numeric targets in `backend/prompts/resumePrompt.js` with 7 named mandatory audit dimensions. The model must independently check each dimension; the suggestion count emerges organically from real issues found. Expected output: 4-8 suggestions based on actual resume-JD gap.

---

## 2026-03-26 — Fix: Stale backend process serving old code

### Problem
`POST /api/parse-pdf` returned `404 Route not found` even after the route was added to `routes/analyze.js`.

### Root Cause
The backend Node.js process (PID 29984) was started before the route was added and never restarted. `require()` caches modules at startup — file changes on disk are invisible to a running process.

### Fix
`taskkill /PID 29984 /F` → restart `node server.js`. Verified route accessible via curl.

**Lesson:** Always restart the backend after adding new routes. Node.js does not hot-reload.

---

## 2026-03-26 — Initial build complete (v1.0)

- React + Vite + Tailwind SPA (Landing / Input / Result pages)
- Express backend with multi-provider AI fallback chain
- Single-prompt JSON output (score + keywords + suggestions + rewrite)
- PDF upload via multer + pdf-parse (in-memory, no disk I/O)
- Demo mode: fully offline with inline mock data + 3s artificial delay
- High-end AI SaaS visual design (dark gradient header, animated SVG gauges, pill tabs)
