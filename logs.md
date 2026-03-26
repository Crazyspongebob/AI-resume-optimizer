# Development Log — AI简历优化助手

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
