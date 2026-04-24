import { calcolaRisultati, fmt, fmtN } from '../utils/calcoli'

function StatBox({ label, value, sub, color = 'text-gray-800', bg = 'bg-white' }) {
  return (
    <div className={`${bg} rounded-2xl border border-gray-100 shadow-sm p-4 text-center`}>
      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export default function Dashboard({ coltivazioni }) {
  if (coltivazioni.length === 0) return null

  const risultati = coltivazioni.map(c => ({ c, r: calcolaRisultati(c) }))

  const totRicavi  = risultati.reduce((s, { r }) => s + r.ricavoTotale,  0)
  const totCosti   = risultati.reduce((s, { r }) => s + r.costoTotale,   0)
  const totUtile   = totRicavi - totCosti
  const totMargine = totRicavi > 0 ? (totUtile / totRicavi) * 100 : null

  const nUtile     = risultati.filter(({ r }) => !r.isPerdita && !r.isBassaMargine).length
  const nBasso     = risultati.filter(({ r }) => r.isBassaMargine).length
  const nPerdita   = risultati.filter(({ r }) => r.isPerdita).length

  const barUtile  = totRicavi > 0 ? Math.min((nUtile  / coltivazioni.length) * 100, 100) : 0
  const barBasso  = totRicavi > 0 ? Math.min((nBasso  / coltivazioni.length) * 100, 100) : 0
  const barPerdita= totRicavi > 0 ? Math.min((nPerdita / coltivazioni.length) * 100, 100) : 0

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 shadow-sm p-5 mb-2">
      <h2 className="text-lg font-bold text-gray-700 mb-4">🏡 Riepilogo Azienda</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatBox
          label="Ricavi totali"
          value={fmt(totRicavi)}
          color="text-blue-700"
          bg="bg-blue-50"
        />
        <StatBox
          label="Costi totali"
          value={fmt(totCosti)}
          color="text-gray-700"
        />
        <StatBox
          label="Utile netto"
          value={fmt(totUtile)}
          color={totUtile < 0 ? 'text-red-600' : 'text-green-700'}
          bg={totUtile < 0 ? 'bg-red-50' : 'bg-green-50'}
        />
        <StatBox
          label="Margine medio"
          value={totMargine !== null ? fmtN(totMargine) + '%' : '–'}
          sub="su tutte le colture"
          color={totMargine === null ? 'text-gray-400' : totUtile < 0 ? 'text-red-600' : totMargine < 5 ? 'text-yellow-600' : 'text-green-700'}
        />
      </div>

      {/* Barra stato colture */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Stato colture ({coltivazioni.length} totali)</span>
          <span className="flex gap-3">
            {nUtile   > 0 && <span className="text-green-600 font-semibold">✅ {nUtile} in utile</span>}
            {nBasso   > 0 && <span className="text-yellow-600 font-semibold">⚡ {nBasso} basso</span>}
            {nPerdita > 0 && <span className="text-red-600 font-semibold">📉 {nPerdita} in perdita</span>}
          </span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
          {barUtile   > 0 && <div className="bg-green-500 transition-all duration-500" style={{ width: `${barUtile}%` }} />}
          {barBasso   > 0 && <div className="bg-yellow-400 transition-all duration-500" style={{ width: `${barBasso}%` }} />}
          {barPerdita > 0 && <div className="bg-red-500 transition-all duration-500"   style={{ width: `${barPerdita}%` }} />}
        </div>
      </div>
    </div>
  )
}
