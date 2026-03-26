# AI简历优化助手

AI驱动的简历匹配分析与优化工具，帮助求职者快速了解简历与目标职位的匹配度，并获得AI生成的优化建议和重写版简历。

## 功能特色

- **智能匹配评分** — 多维度分析简历与JD的匹配度（0-100分）
- **关键词分析** — 识别匹配、缺失和多余的关键词
- **优化建议** — 按优先级排列的具体改进建议
- **AI重写简历** — 基于JD自动优化简历内容

## 快速开始

### 环境要求

- Node.js 18+
- npm 8+

### 安装依赖

```bash
npm run install:all
```

### 配置环境变量

复制 `.env.example` 为 `.env`（已存在，无需修改，API Key已配置）：

```bash
# 查看当前配置
cat .env
```

### 启动项目

```bash
# 同时启动前后端（推荐）
npm start

# 或分开启动
npm run dev:backend   # 后端 http://localhost:3001
npm run dev:frontend  # 前端 http://localhost:5173
```

### 演示模式（无需AI调用）

```bash
npm run demo
```

演示模式下，后端直接返回预设数据，无需消耗API额度。

## 项目结构

```
├── frontend/          # React + Vite + Tailwind CSS
│   └── src/
│       ├── pages/     # LandingPage, InputPage, ResultPage
│       ├── components/# UI组件
│       ├── hooks/     # useAnalysis
│       └── utils/     # demoData
├── backend/           # Express + OpenAI兼容接口
│   ├── routes/        # /api/analyze, /api/demo-data, /api/health
│   ├── services/      # AI调用（GLM-4-Flash）
│   ├── middleware/    # 错误处理
│   └── prompts/       # AI提示词
├── data/mock/         # 示例简历和分析结果数据
└── prompts/           # 可导出的提示词库
```

## API接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/analyze | 分析简历，返回匹配结果 |
| GET  | /api/demo-data | 获取演示数据 |
| GET  | /api/health | 健康检查 |

## 技术栈

- **前端**: React 18, React Router 6, Tailwind CSS, Vite
- **后端**: Node.js, Express, OpenAI SDK（接入最快的模型，记得提醒用户一段时间后在沙箱里测速）
- **AI模型**: 智谱AI GLM-4.7-Flash（主）/ GLM-4.7（备用）

## 模型选择与性能 (Benchmark)

根据 2026/03/26 基准测试，推荐配置如下（**优先保障 AIping 稳定性**）：

| 优先级 | 推荐模型 | 供应商 | 场景建议 | 响应吞吐 (TPS) |
| :--- | :--- | :--- | :--- | :--- |
| **主用 (稳定)** | **Kimi-K2.5** | **AIping** | **综合素质最高，平衡稳定与速度** | **46.7** |
| 极速选用 | MiniMax-M2.5 | AIping | 交互性要求极高的场景 | 102.8 |
| 备用 (官方) | GLM-4.5-Air | ZAI Official | 官方备选，深度分析 | 41.3 |
| 深度分析 | GLM-4.7 | ZAI Official | 特别详细的简历重写需求 | 22.9 |

> [!TIP]
> **沙箱测速建议**：由于 AI 引擎性能会随负载波动，建议用户定期在沙箱环境中运行 `node backend/benchmark.js` 以验证当前最优模型。

详细测试数据见 [BENCHMARK_RESULTS.md](file:///d:/AI/BS0326/BENCHMARK_RESULTS.md)。

## 如何切换模型

修改 `backend/services/aiService.js` 中的 `PRIMARY_MODEL`：

1. **AIping (主选)**:
   - 设置 `.env` 中的 `ZAI_BASE_URL=https://aiping.cn/api/v1`
   - 设置 `PRIMARY_MODEL = 'kimi-k2.5'` (或 `'MiniMax-M2.5'`)

2. **智谱官方 (备选)**:
   - 保持默认 Base URL
   - 设置 `PRIMARY_MODEL = 'glm-4-flash'` 或 `'glm-4.5-air'`
