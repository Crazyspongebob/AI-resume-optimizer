const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { performance } = require('perf_hooks');
const OpenAI = require('openai');

console.log('--- Env Check ---');
console.log('ZAI_API_KEY:', process.env.ZAI_API_KEY ? 'Present' : 'Missing');
console.log('AIPING_API_KEY:', process.env.AIPING_API_KEY ? 'Present' : 'Missing');
console.log('PARATERA_API_KEY:', process.env.PARATERA_API_KEY ? 'Present' : 'Missing');
console.log('------------------\n');

const resumes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/mock/resumes.json'), 'utf8'));
const sample = resumes[0];
const resumeText = sample.resume_text;
const jdText = sample.jd_text;

// Prompt building (simplified version of backend/prompts/resumePrompt.js)
const SYSTEM_PROMPT = `你是一位资深的IT猎头和技术面试官。请分析提供的简历与职位描述（JD）的匹配度。
必须返回 JSON 格式，包含以下字段：
- matchScore: 数字 (0-100)
- scoreBreakdown: { skillMatch, experienceMatch, educationMatch, overallFit } (均为 0-100)
- keywordAnalysis: { matched: [], missing: [], extra: [] }
- suggestions: [{ section, issue, suggestion, priority }]
- rewrittenResume: 使用 Markdown 格式的高质量重写版简历`;

const userPrompt = `### 简历内容 ###\n${resumeText}\n\n### 职位描述 ###\n${jdText}`;

const providers = {
  zai: {
    baseUrl: process.env.ZAI_BASE_URL || 'https://open.bigmodel.cn/api/coding/paas/v4',
    apiKey: process.env.ZAI_API_KEY,
  },
  aiping: {
    baseUrl: process.env.AIPING_BASE_URL || 'https://aiping.cn/api/v1',
    apiKey: process.env.AIPING_API_KEY,
  },
  paratera: {
    baseUrl: process.env.PARATERA_BASE_URL || 'https://llmapi.paratera.com',
    apiKey: process.env.PARATERA_API_KEY,
  }
};

const modelsToTest = [
  // 1. ZAI Official
  { provider: 'zai', id: 'glm-4-flash', label: 'GLM-4-Flash (Official)' },
  { provider: 'zai', id: 'glm-4.7-flash', label: 'GLM-4.7-Flash (Official)' },
  { provider: 'zai', id: 'glm-4.5-air', label: 'GLM-4.5-Air (Official)' },
  
  // 2. AIping (Already tested, included for consistency if needed, but focusing on new ZAI tests)
  { provider: 'aiping', id: 'kimi-k2.5', label: 'Kimi-K2.5 (AIping)' },
];

async function runBenchmark() {
  const results = [];
  console.log(`Starting benchmark for ${modelsToTest.length} models...\n`);

  for (const modelDef of modelsToTest) {
    const config = providers[modelDef.provider];
    if (!config || !config.apiKey) {
      console.warn(`[SKIP] ${modelDef.label}: Missing API key for provider ${modelDef.provider}`);
      continue;
    }

    const client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });

    console.log(`Testing ${modelDef.label} (${modelDef.id})...`);
    
    const start = performance.now();
    let duration = 0;
    let tokens = { prompt: 0, completion: 0, total: 0 };
    let success = false;
    let errorMsg = '';

    try {
      const response = await client.chat.completions.create({
        model: modelDef.id,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
      });

      duration = (performance.now() - start) / 1000; // in seconds
      tokens = {
        prompt: response.usage?.prompt_tokens || 0,
        completion: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0,
      };
      success = true;
      console.log(`  Success! Latency: ${duration.toFixed(2)}s, Tokens: ${tokens.completion}`);
    } catch (err) {
      duration = (performance.now() - start) / 1000;
      success = false;
      errorMsg = err.message;
      console.error(`  Failed: ${err.message}`);
    }

    results.push({
      ...modelDef,
      latency: duration,
      tokens,
      tps: success && tokens.completion > 0 ? tokens.completion / duration : 0,
      success,
      error: errorMsg,
    });
  }

  // Print Summary Table
  console.log('\n' + '='.repeat(80));
  console.log('BENCHMARK SUMMARY');
  console.log('='.repeat(80));
  console.log('| Model | Provider | Status | Latency (s) | Completion Tokens | TPS |');
  console.log('| :--- | :--- | :--- | :--- | :--- | :--- |');
  results.forEach(r => {
    console.log(`| ${r.id} | ${r.provider} | ${r.success ? '✅ OK' : '❌ FAIL'} | ${r.latency.toFixed(2)}s | ${r.tokens.completion} | ${r.tps.toFixed(1)} |`);
  });
  console.log('='.repeat(80));

  // Save to file
  const reportPath = path.join(__dirname, '../BENCHMARK_RESULTS.md');
  let md = '# AI Model Benchmark Results\n\n';
  md += `Test Date: ${new Date().toLocaleString()}\n\n`;
  md += '## Performance Comparison\n\n';
  md += '| Model | Provider | Status | Latency (s) | Completion Tokens | TPS | Notes |\n';
  md += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';
  results.forEach(r => {
    md += `| ${r.label} | ${r.provider} | ${r.success ? '✅ OK' : '❌ FAIL'} | ${r.latency.toFixed(2)}s | ${r.tokens.completion} | ${r.tps.toFixed(1)} | ${r.success ? '' : r.error} |\n`;
  });
  
  md += '\n## Detailed Analysis\n\n';
  results.forEach(r => {
    if (r.success) {
      md += `### ${r.label}\n- Latency: ${r.latency.toFixed(2)}s\n- Total Tokens: ${r.tokens.total}\n- Speed: ${r.tps.toFixed(1)} tokens/sec\n\n`;
    }
  });

  fs.writeFileSync(reportPath, md);
  console.log(`Results saved to ${reportPath}`);
}

runBenchmark().catch(console.error);
