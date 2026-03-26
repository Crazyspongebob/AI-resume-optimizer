import { useState, useEffect } from 'react'

const messages = [
  '正在分析简历内容...',
  '正在匹配关键词...',
  '正在评估岗位契合度...',
  '正在生成优化建议...',
  '正在重写简历...',
  '即将完成...',
]

export default function LoadingOverlay() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 shadow-2xl flex flex-col items-center gap-6 animate-fade-in">
        {/* 旋转动画 */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg text-gray-700 font-medium transition-all duration-300">
          {messages[msgIndex]}
        </p>
        <div className="flex gap-1.5">
          {messages.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= msgIndex ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
