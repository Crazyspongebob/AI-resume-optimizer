import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: '匹配分析',
      description: '智能分析简历与目标职位的匹配程度，提供量化评分，帮助你了解与岗位要求的差距。',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: '关键词提取',
      description: '自动识别职位描述中的核心关键词，对比简历中已覆盖与缺失的技能标签，精准定位优化方向。',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      title: 'AI 重写',
      description: '基于职位要求，AI 自动重写并优化你的简历内容，突出相关经历，提升求职成功率。',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span>
            由 AI 驱动的简历优化工具
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            AI <span className="text-primary-600">简历优化</span>助手
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            上传简历与目标职位描述，AI 为你深度分析匹配度、提取关键词、给出优化建议，
            并自动生成符合岗位要求的优化版简历。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/input')}
              className="btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              立即开始优化
            </button>
            <button
              onClick={() => navigate('/input')}
              className="btn-secondary text-lg px-8 py-3 rounded-xl"
            >
              查看示例效果
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
          {[
            { value: '95%', label: '用户满意度' },
            { value: '3分钟', label: '平均分析时长' },
            { value: '多维度', label: '综合评分维度' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">三步完成简历优化</h2>
          <p className="text-gray-500 text-lg">智能分析，精准优化，让你的简历脱颖而出</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 mb-6">
                {feature.icon}
              </div>
              <div className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2">
                步骤 {index + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-primary-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">准备好提升你的简历了吗？</h2>
          <p className="text-primary-100 text-lg mb-8">
            只需粘贴简历和职位描述，AI 将在几秒内为你生成完整的优化报告。
          </p>
          <button
            onClick={() => navigate('/input')}
            className="bg-white text-primary-600 font-semibold text-lg px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-md"
          >
            免费开始使用
          </button>
        </div>
      </div>
    </div>
  );
}
