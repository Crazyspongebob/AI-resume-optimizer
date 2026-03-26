# Development Methodology — AI 简历优化助手

This document records the development logic, architectural decisions, and underlying thought process for this project. It serves as a living reference for contributors and as retrospective documentation of the engineering choices made throughout the build.

---

## 1. Project Framing

### Problem Definition
Job seekers in China's tech industry face a structural mismatch problem: they write resumes based on their own self-perception, but hiring managers evaluate resumes against a specific Job Description (JD). The gap between these two perspectives is often invisible to the candidate.

The core insight driving this project: **if we can surface that gap explicitly — with concrete scores, missing keywords, and rewritten text — we eliminate the guesswork entirely.**

### Product Constraint: Single-Prompt Output
A naive multi-step AI pipeline would call the model four times: once for scoring, once for keywords, once for suggestions, once for rewriting. This was rejected for three reasons:
1. **Latency**: Each call adds 2–8s RTT with Chinese AI providers.
2. **Cost**: Four calls consume four times the tokens.
3. **Consistency**: Independent calls may produce contradictory evaluations (score says 90 but suggestions say "fundamentally wrong").

**Decision**: One prompt returns all four outputs as a single JSON object. This forces internal consistency and halves perceived wait time.

---

## 2. AI Provider Architecture

### Multi-Provider Fallback Chain
Chinese AI providers have inconsistent availability — a single provider may be rate-limited, under maintenance, or simply slow at any given moment. The fallback chain pattern was chosen to maximize uptime:

```
ZAI GLM-4.7 → ZAI GLM-4.5-Air → AIPing Kimi-K2.5 → AIPing MiniMax-M2.5 → Paratera GLM-5 → Paratera DeepSeek-V3.2
```

Each provider uses the OpenAI-compatible SDK with a custom `baseURL`, which means the same client code works for all providers without vendor lock-in.

**Key implementation insight**: A fresh `OpenAI` client instance is created per provider call (`callProvider()`), rather than switching parameters on a shared client. This avoids any potential state leakage between providers and makes the code trivially testable in isolation.

### Why `temperature: 0.3`
Resume analysis requires reproducible, objective output. Higher temperatures (0.7–1.0) cause the model to produce creative but inconsistent JSON structures, score fluctuations for the same input, and occasionally hallucinated skills. `0.3` balances coherence with enough flexibility for natural language generation in the rewritten resume.

### JSON Extraction Safety
AI models frequently violate their own output format instructions. Two failure modes required explicit handling:

1. **Markdown code fence wrapping**: Models wrap JSON in ` ```json ``` ` blocks despite instructions not to. Fix: regex to strip fences before parsing.
2. **Unescaped control characters**: Models insert literal newlines inside JSON string values (especially in the `rewrittenResume` markdown field). `JSON.parse` rejects these as "bad control characters." Fix: post-process all quoted strings to escape `\n`, `\r`, `\t` before parsing.

---

## 3. Backend Design

### Route Architecture
A single Express router file (`routes/analyze.js`) handles all API endpoints:
- `POST /api/analyze` — core analysis pipeline
- `POST /api/parse-pdf` — PDF text extraction
- `GET /api/demo-data` — sample resume + JD for testing
- `GET /api/health` — uptime check

This flat structure was chosen over nested routers because the API surface is small and the cognitive overhead of additional abstraction layers is not justified.

### PDF Extraction Strategy
PDF text extraction uses `pdf-parse` (backed by Mozilla's `pdfjs-dist`) operating on in-memory buffers via `multer`'s `memoryStorage`. Files are never written to disk — the buffer is consumed, text extracted, and the buffer discarded in the same request lifecycle.

**Limitation acknowledged**: This approach only works for text-based PDFs. Scanned PDFs (image-only) will yield near-empty text. A production system would add OCR (e.g., Tesseract) as a fallback, but this is out of scope for a hackathon build. The service throws a descriptive error when extracted text is under 30 characters.

### Validation Philosophy
Backend validation focuses on the API boundary — external inputs get strict type and presence checks. Internal functions (e.g., `extractJSON`, `callProvider`) trust their callers and throw descriptively rather than silently returning null. This makes error surfaces explicit and stack traces informative.

---

## 4. Frontend Design

### State Architecture: React Context vs. useState
Analysis results must survive navigation from the input page (`/input`) to the results page (`/result`). Two options were considered:
- **URL state / query params**: Works but is ugly for complex objects and limits resume length.
- **React Context**: Clean, invisible to the user, resets naturally on page refresh (which forces re-analysis — desirable behavior).

`AnalysisContext` holds `result` and `inputData`. The results page redirects to `/input` if `result` is null, preventing direct URL access to stale or empty state.

### Demo Mode: Zero-Dependency Offline Testing
The `demoData.js` utility exports complete inline mock data matching the exact API response shape. The `useAnalysis` hook checks `demoMode` before making any network call, adding a 3-second artificial delay to simulate real AI latency (this preserves the UX impression of the loading overlay during demos).

This means the app can be demonstrated completely offline — no API keys, no backend — using `npm run demo` or triggering the "一键演示" button.

### Component Design Principles

**ScoreGauge**: The animated SVG ring uses `requestAnimationFrame` with a cubic ease-out function (`1 - (1 - t)^3`) for a natural deceleration. The radius was scaled from `r=45` to `r=90` to fill a 220×220 canvas, and the stroke uses an SVG `linearGradient` for visual depth. Four sub-score cards each have their own independent mini-ring animation so all five rings animate simultaneously — a deliberate visual "data coming alive" effect.

**SuggestionList**: Numbered cards with a left colored border communicate priority hierarchy spatially. The number badge (01, 02, 03…) is positioned in a colored side column to create a visual rhythm across multiple cards. The two-tone layout (issue block in tinted background, suggestion in white with arrow icon) teaches the user the read direction: "here's the problem → here's the fix."

**RewrittenResume**: The macOS window bar (three colored dots + filename) is a UI shorthand that immediately communicates "this is a document," establishing the appropriate reading mode. The `resume-prose` CSS class gives markdown headings a left-border accent (`h2::before`) using a brand-blue gradient, making section headers visually distinct without requiring custom rendering components.

### Tab Navigation: Props vs. Internal State
The `ResultTabs` component was initially hardcoded with its own internal tab list. This was refactored to accept a `tabs` prop from `ResultPage`, which allows the parent to inject dynamic labels (e.g., badge counts showing the number of high-priority suggestions). The component falls back to a default tab list if no props are provided, maintaining backward compatibility.

---

## 5. Suggestion Count Logic

### Why "Exactly 3" Was Wrong
The original system prompt contained `"至少提供3条建议"` (provide at least 3 suggestions). This caused the model to treat 3 as both a floor and a ceiling — it would generate exactly 3, sometimes padding thin resumes with redundant or invented issues.

The fundamental problem: **a minimum count directive without a quality gate creates perverse incentives for the model.** The model optimizes for satisfying the constraint, not for accuracy.

### The Fix: Content-Driven Scaling
The revised prompt instructs the model to scale suggestions based on the _actual gap_ between the resume and JD:
- High gap → 5–8 suggestions (many genuine issues to address)
- Medium gap → 3–5 suggestions
- Low gap → 2–3 suggestions (only polish is needed)

Critically, the prompt explicitly prohibits fabricating issues to meet a quota: `"禁止为凑数而捏造问题"`. This is a hard constraint that cannot be inferred from a count directive alone.

---

## 6. Design Language: "High-End AI SaaS"

The visual design draws from Linear, Vercel, Notion AI, and modern Chinese tech products. The core principle: **surfaces should communicate data hierarchy, not just contain it.**

Specific decisions:
- **Dark gradient hero header**: Separates "system output" (the analysis header) from "user-navigable content" (the tabs). The color shift creates a clear visual anchor.
- **Card overlapping header**: The content card uses negative top margin (`-mt-6`) to overlap the header, creating depth and connecting the two zones visually.
- **Pill-style tabs with icons**: Underline tabs are browser-default aesthetics. Pill tabs with box shadows feel like distinct, pressable objects. SVG icons per tab reduce the cognitive load of reading labels.
- **Tag colors**: Green/red for matched/missing maps to universal pass/fail conventions. Tags use `rounded-lg` instead of `rounded-full` to look like technical badges rather than labels.
- **Priority colors on suggestion cards**: Red/amber/slate for high/medium/low maps to traffic light conventions familiar to engineers from issue trackers (Linear, Jira, GitHub).

---

## 7. Development Process

### Build Order
1. **AI prompt design first** — Established the JSON schema before writing any code. This enforced a contract that both backend parsing and frontend rendering could depend on.
2. **Backend service layer** — `aiService.js` was built and tested standalone (via curl) before any frontend work.
3. **Frontend pages** — Built in user-flow order: Landing → Input → Result.
4. **Component polish** — Final visual pass after all logic was confirmed working end-to-end.

### Key Debugging Episodes

**"Bad control character in string" JSON parse error**: Occurred because the model inserted literal newline characters inside the `rewrittenResume` Markdown string. The fix was a regex post-processor that sanitizes all JSON-string-valued content before `JSON.parse`. This was discovered by logging the raw AI response and inspecting position 817 in the output.

**Port 3001 EADDRINUSE on Windows**: Previous node process retained the port after a crash. Diagnosed with `netstat -ano | findstr :3001`, resolved with `taskkill /PID <n> /F`. Added to the README troubleshooting section.

**SubAgent permission blocks**: Parallel subagents couldn't execute Write/Bash commands due to permission mode. Recovery: orchestrator wrote all files directly, converting a parallel multi-agent build into a sequential single-agent build. Lesson: verify permission mode before spawning agents in parallel.

### Benchmark-Driven Provider Ordering
Provider order in the fallback chain was determined empirically via `backend/benchmark.js`, which sends a fixed prompt to each provider and measures tokens-per-second throughput. Results (2026-03-26):
- MiniMax-M2.5: 102.8 TPS (fastest, but less coherent on structured output)
- Kimi-K2.5: 46.7 TPS (best balance — primary choice)
- GLM-4.5-Air: 41.3 TPS (official ZAI, good fallback)
- GLM-4.7: 22.9 TPS (most capable for complex resumes, slowest)

The chain prioritizes stability (ZAI official first, despite slower speed) over raw throughput, because a failed fast response is worse than a successful slow one.

---

## 8. Known Limitations & Future Work

| Area | Current State | Future Improvement |
|---|---|---|
| PDF extraction | Text-only PDFs | Add OCR fallback for scanned PDFs |
| Suggestion count | AI-driven (2–8) | Post-process to enforce minimum quality score per suggestion |
| Resume parsing | Raw textarea text | Parse structure (sections, dates) for more precise analysis |
| Authentication | None | Add user accounts to save analysis history |
| Rate limiting | None | Add per-IP rate limiting on `/api/analyze` |
| Streaming | Full response wait | Stream AI tokens to the frontend for progressive rendering |
| Multi-language | Chinese only | Extend prompts to support English JDs and resumes |
