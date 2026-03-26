export const DEMO_RESUME = `张伟
电话：138-0001-2345 | 邮箱：zhangwei@email.com | 上海

教育背景
华东师范大学 | 计算机科学与技术 | 本科 | 2018-2022

工作经历
上海星辰科技有限公司 | 前端开发工程师 | 2022.07 - 至今
- 负责公司电商平台前端开发，使用React技术栈
- 参与组件库搭建，封装了20+通用业务组件
- 优化首页加载性能，使用懒加载和代码分割
- 配合后端完成RESTful API对接

技能清单
- 前端：HTML5、CSS3、JavaScript(ES6+)、React、Vue2
- 工具：Git、Webpack、VS Code
- 其他：了解Node.js、MySQL基础

项目经验
电商平台改版项目 | 2023.03 - 2023.08
- 负责首页和商品详情页的重构
- 使用React Hooks重写了类组件
- 实现了商品瀑布流和无限滚动加载`

export const DEMO_JD = `高级前端开发工程师 | 字节跳动 | 上海 | 25-40K

职位描述：
- 负责抖音电商平台的前端架构设计和核心功能开发
- 推动前端工程化建设，提升团队开发效率
- 参与前端基础设施和组件库建设
- 与产品、设计、后端团队紧密协作，保障项目高质量交付

任职要求：
- 本科及以上学历，计算机相关专业，3年以上前端开发经验
- 精通React及其生态（Redux、React Router），熟悉TypeScript
- 熟悉前端工程化工具（Webpack/Vite、ESLint、CI/CD）
- 了解Node.js，有SSR/SSG经验者优先
- 熟悉性能优化方法，有大型项目性能调优经验
- 具备良好的沟通能力和团队协作精神
- 有开源项目或技术博客者优先`

export const DEMO_RESULT = {
  matchScore: 72,
  scoreBreakdown: {
    skillMatch: 68,
    experienceMatch: 70,
    educationMatch: 85,
    overallFit: 72,
  },
  keywordAnalysis: {
    matched: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Git', 'Webpack', '组件库', '性能优化', '前端开发'],
    missing: ['TypeScript', 'Redux', 'React Router', 'Vite', 'ESLint', 'CI/CD', 'SSR', 'SSG', '前端架构', '工程化建设'],
    extra: ['Vue2', 'MySQL', 'jQuery'],
  },
  suggestions: [
    {
      section: '技能清单',
      issue: '缺少TypeScript，这是JD中的核心要求',
      suggestion: '如有TypeScript使用经验，请在技能清单中突出标注；如无经验，建议短期学习后补充到简历中',
      priority: 'high',
    },
    {
      section: '工作经历',
      issue: '缺少量化的业绩成果',
      suggestion: '建议加入具体数据，例如"优化首页加载性能，FCP从3.2s降至1.5s，提升53%"',
      priority: 'high',
    },
    {
      section: '技能清单',
      issue: '缺少前端工程化相关工具（Vite、ESLint、CI/CD）',
      suggestion: '补充ESLint、Prettier、CI/CD等工程化工具的使用经验，这是大厂岗位的标配要求',
      priority: 'high',
    },
    {
      section: '项目经验',
      issue: '项目描述偏重技术实现，缺少业务价值和成果',
      suggestion: '使用STAR法则重写：描述项目背景(Situation)、你的任务(Task)、具体行动(Action)、量化结果(Result)',
      priority: 'medium',
    },
    {
      section: '工作经历',
      issue: '未体现前端架构设计能力',
      suggestion: '补充架构相关描述，如"主导前端项目技术选型，设计了基于微前端的模块化架构"',
      priority: 'medium',
    },
    {
      section: '整体',
      issue: '缺少开源贡献或技术博客',
      suggestion: 'JD中提到"有开源项目或技术博客者优先"，建议在简历中添加GitHub主页或技术文章链接',
      priority: 'low',
    },
  ],
  rewrittenResume: `# 张伟

## 基本信息
- 电话：138-0001-2345 | 邮箱：zhangwei@email.com
- 所在地：上海 | 求职意向：高级前端开发工程师

## 教育背景
**华东师范大学** | 计算机科学与技术（本科） | 2018.09 - 2022.06

## 专业技能
- **核心技能**：React、JavaScript(ES6+)、TypeScript[请补充具体项目经验]、HTML5、CSS3
- **框架生态**：React Hooks、Redux[请补充使用经验]、React Router、Vue2
- **工程化工具**：Webpack、Git、ESLint[请补充使用经验]、CI/CD[请补充使用经验]
- **其他技能**：Node.js、RESTful API、MySQL、性能优化

## 工作经历

### 上海星辰科技有限公司 | 前端开发工程师 | 2022.07 - 至今

- **组件库建设**：主导搭建公司级通用组件库，封装20+业务组件，覆盖80%常用场景，将新页面开发效率提升[请补充具体数字]%
- **性能优化**：针对电商平台首页进行深度性能优化，通过路由懒加载、代码分割和图片优化等手段，将首屏加载时间从[请补充原始数据]s降至[请补充优化后数据]s
- **核心业务开发**：负责电商平台核心交易链路前端开发，包括商品展示、购物车、订单结算等模块，日均PV[请补充数据]
- **团队协作**：与后端团队协作完成RESTful API设计与对接，推动接口文档规范化

## 项目经验

### 电商平台改版项目 | 2023.03 - 2023.08
- **背景**：公司电商平台用户体验评分较低，需要进行全面改版升级
- **职责**：作为前端核心开发，负责首页和商品详情页的架构设计和开发
- **实现**：
  - 使用React Hooks重构原有类组件，代码量减少[请补充数字]%，可维护性显著提升
  - 实现商品瀑布流布局和无限滚动加载，支持[请补充数字]万+SKU流畅浏览
  - 引入虚拟列表优化长列表渲染性能
- **成果**：改版后页面加载速度提升[请补充数字]%，用户停留时长增加[请补充数字]%`,
}
