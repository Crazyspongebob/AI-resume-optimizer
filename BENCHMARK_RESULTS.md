# AI Model Benchmark Results (Final Consolidated)

Test Date: 2026/03/26
Task: Resume Analysis & Rewrite (Complex structured output)

## Performance Comparison (Latest Run)

| Model | Provider | Status | Latency (s) | Completion Tokens | Speed (TPS) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Kimi-K2.5** | **AIping** | ✅ OK | **36.63s** | 1712 | **46.7** | **Best for stability and speed.** |
| GLM-4.5-Air | ZAI Official | ✅ OK | 60.00s | 2481 | 41.3 | Fast and detailed, good backup. |
| GLM-4-Flash | ZAI Official | ✅ OK | 45.53s | 901 | 19.8 | Reliable and consistent. |
| GLM-4.7-Flash | ZAI Official | ✅ OK | 303.80s | 3802 | 12.5 | Very exhaustive but high latency. |
| MiniMax-M2.5 | AIping | ✅ OK | 18.06s | 1857 | 102.8 | Exceptionally fast for raw output. |

## Recommendations

1. **Primary Recommendation (Stability & Quality)**: **Kimi-K2.5 (AIping)**.
2. **Fastest Interaction**: **MiniMax-M2.5 (AIping)**.
3. **Backup / Deep Analysis**: **GLM-4.5-Air** or **GLM-4.7** (Official).

> [!IMPORTANT]
> **Priority Balance**: Per user request, **AIping models are set as primary** for production stability. Zhipu AI (GLM) models serve as fallback/backup options.

> [!WARNING]
> **Benchmarking**: AI performance varies by time/region. Run `node backend/benchmark.js` in the sandbox periodically to verify.

## How to Switch Models

Update `backend/services/aiService.js`:

```javascript
// Primary: AIping Kimi
const client = new OpenAI({
  apiKey: process.env.AIPING_API_KEY,
  baseURL: 'https://aiping.cn/api/v1',
});
const PRIMARY_MODEL = 'kimi-k2.5';
```
