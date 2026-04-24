import { useEffect } from 'react'

export default function Toast({ message, type = 'ok', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2800)
    return () => clearTimeout(t)
  }, [message]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-none">
      <div className={`px-6 py-3 rounded-full shadow-xl text-white text-sm font-medium ${
        type === 'warn' ? 'bg-yellow-700' : 'bg-gray-800'
      }`}>
        {message}
      </div>
    </div>
  )
}
