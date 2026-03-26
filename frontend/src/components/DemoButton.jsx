export default function DemoButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      一键演示
    </button>
  )
}
