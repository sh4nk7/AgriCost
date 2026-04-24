const TABS = [
  { id: 'aggiungi', label: '➕ Nuova Coltivazione' },
  { id: 'lista',    label: '📋 Le Mie Coltivazioni' },
  { id: 'bando',    label: '🏛️ Simulazione Bando' },
]

export default function Tabs({ active, onChange, count }) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              active === tab.id
                ? 'border-green-600 text-green-700 font-bold'
                : 'border-transparent text-gray-500 hover:text-green-700'
            }`}
          >
            {tab.label}
            {tab.id === 'lista' && count > 0 && (
              <span className="ml-1.5 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
