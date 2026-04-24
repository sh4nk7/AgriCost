import { useState } from 'react'
import { calcolaRisultati, fmt, fmtN, n } from '../utils/calcoli'

function MetricBox({ bg, label, value, color }) {
  return (
    <div className={`${bg} rounded-xl p-3 text-center`}>
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className={`text-lg font-extrabold ${color}`}>{value}</div>
    </div>
  )
}

export default function CardColtivazione({ colt, onModifica, onElimina }) {
  const [showDettaglio, setShowDettaglio] = useState(false)
  const [showSimula,    setShowSimula]    = useState(false)
  const [simulaVal,     setSimulaVal]     = useState('')

  const r = calcolaRisultati(colt)

  const borderCls = r.isPerdita
    ? 'border-red-400'
    : r.isBassaMargine ? 'border-yellow-400' : 'border-gray-200'
  const badgeCls = r.isPerdita
    ? 'bg-red-100 text-red-800'
    : r.isBassaMargine ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
  const badgeTxt = r.isPerdita
    ? '📉 In perdita'
    : r.isBassaMargine ? '⚡ Margine basso' : '✅ In utile'

  let barW = 0, barCls = 'bg-green-500'
  if (!r.isPerdita && r.ricavoTotale > 0) {
    barW   = Math.min(r.margine, 100)
    barCls = r.isBassaMargine ? 'bg-yellow-400' : 'bg-green-500'
  } else if (r.isPerdita) {
    barW = 100; barCls = 'bg-red-500'
  }

  const vociCosti = [
    ['🌱 Semi / Piantine',     n(colt.semi)],
    ['💧 Acqua / Irrigazione', n(colt.acqua)],
    ['🧪 Trattamenti',         n(colt.trattamenti)],
    ['👷 Manodopera',          r.costoManodopera],
    ['🚜 Macchinari',          n(colt.macchinari)],
    ['📦 Altri costi',         n(colt.altri_costi)],
  ].filter(([, v]) => v > 0)

  const simulaRis = (() => {
    const pv = parseFloat(simulaVal)
    if (!simulaVal || isNaN(pv) || pv < 0) return null
    const rSim = calcolaRisultati({ ...colt, prezzo_vendita: pv })
    return { rSim, diff: rSim.utile - r.utile }
  })()

  return (
    <div className={`bg-white rounded-2xl border-2 ${borderCls} shadow-sm p-5 animate-fade-in`}>

      {/* Intestazione */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{colt.nome}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">Unità: {colt.unita}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeCls}`}>{badgeTxt}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onModifica(colt)}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold
                       px-3 py-2 rounded-lg transition-colors"
          >
            ✏️ Modifica
          </button>
          <button
            onClick={() => onElimina(colt.id, colt.nome)}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold
                       px-3 py-2 rounded-lg transition-colors"
          >
            🗑️ Elimina
          </button>
        </div>
      </div>

      {/* Metriche */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricBox bg="bg-gray-50"   label="Costo totale"     value={fmt(r.costoTotale)}  color="text-gray-700" />
        <MetricBox bg="bg-blue-50"   label="Ricavo totale"    value={fmt(r.ricavoTotale)} color="text-blue-700" />
        <MetricBox
          bg={r.isPerdita ? 'bg-red-50' : 'bg-green-50'}
          label="Utile / Perdita"
          value={fmt(r.utile)}
          color={r.isPerdita ? 'text-red-600' : 'text-green-600'}
        />
        <MetricBox
          bg="bg-gray-50"
          label={`Costo / ${colt.unita}`}
          value={n(colt.quantita) > 0 ? fmt(r.costoPer) : '–'}
          color="text-gray-700"
        />
      </div>

      {/* Barra margine */}
      {r.ricavoTotale > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>
              Margine:{' '}
              <strong className={
                r.isPerdita ? 'text-red-600' : r.isBassaMargine ? 'text-yellow-600' : 'text-green-600'
              }>
                {isFinite(r.margine) ? fmtN(r.margine) + '%' : 'n/d'}
              </strong>
            </span>
            <span className="text-gray-300">obiettivo &gt; 20%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${barCls}`}
              style={{ width: `${barW}%` }}
            />
          </div>
        </div>
      )}

      {/* Punto di pareggio */}
      {(r.breakEvenQuantita !== null || r.prezzoMinimo !== null) && (
        <div className="mb-4 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            ⚖️ Punto di pareggio
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {r.prezzoMinimo !== null && (
              <span className="text-sm text-gray-600">
                Prezzo minimo:{' '}
                <strong className="text-gray-800">{fmtN(r.prezzoMinimo, 3)} €/{colt.unita}</strong>
                {n(colt.prezzo_vendita) > 0 && (
                  <span className={`ml-1.5 text-xs font-semibold ${
                    n(colt.prezzo_vendita) >= r.prezzoMinimo ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {n(colt.prezzo_vendita) >= r.prezzoMinimo ? '✓ copri i costi' : '✗ sotto costo'}
                  </span>
                )}
              </span>
            )}
            {r.breakEvenQuantita !== null && (
              <span className="text-sm text-gray-600">
                Quantità minima:{' '}
                <strong className="text-gray-800">{fmtN(r.breakEvenQuantita, 1)} {colt.unita}</strong>
                {n(colt.quantita) > 0 && (
                  <span className={`ml-1.5 text-xs font-semibold ${
                    n(colt.quantita) >= r.breakEvenQuantita ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {n(colt.quantita) >= r.breakEvenQuantita ? '✓ raggiunta' : '✗ non raggiunta'}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Dettaglio costi */}
      <div className="mb-3">
        <button
          onClick={() => setShowDettaglio(v => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-500
                     hover:text-gray-800 transition-colors py-1"
        >
          <span>📊</span>
          <span>Dettaglio costi</span>
          <span className="text-gray-300 text-xs font-normal ml-1">
            {showDettaglio ? '▲ chiudi' : '▼ espandi'}
          </span>
        </button>
        {showDettaglio && (
          <div className="mt-3 bg-gray-50 rounded-xl p-4 space-y-1.5 animate-fade-in">
            {vociCosti.length > 0 ? (
              <>
                {vociCosti.map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-2 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-700">{fmt(val)}</span>
                  </div>
                ))}
                <div className="flex justify-between gap-2 text-sm font-bold border-t border-gray-200 pt-2">
                  <span>Totale</span>
                  <span>{fmt(r.costoTotale)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">Nessun costo inserito.</p>
            )}
          </div>
        )}
      </div>

      {/* Simulazione prezzo alternativo */}
      <div className="mb-1">
        <button
          onClick={() => setShowSimula(v => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600
                     hover:text-indigo-800 transition-colors py-1"
        >
          <span>🔮</span>
          <span>Simula: "E se vendessi a un prezzo diverso?"</span>
          <span className="text-gray-300 text-xs font-normal ml-1">{showSimula ? '▲' : '▼'}</span>
        </button>
        {showSimula && (
          <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4 animate-fade-in">
            <p className="text-xs text-indigo-500 mb-3">
              Inserisci un prezzo alternativo per vedere il nuovo guadagno.
              I dati originali <strong>non vengono modificati</strong>.
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-semibold text-indigo-700 mb-1">
                  Nuovo prezzo (€/{colt.unita})
                </label>
                <input
                  type="number" min="0" step="0.001"
                  value={simulaVal}
                  onChange={e => setSimulaVal(e.target.value)}
                  placeholder={n(colt.prezzo_vendita).toString()}
                  className="border border-indigo-300 rounded-lg px-3 py-2 text-sm w-36 bg-white
                             focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              {simulaRis && (
                <div className="bg-white rounded-lg px-4 py-2 border border-indigo-200 space-y-0.5 text-sm animate-fade-in">
                  <div>
                    Utile simulato:{' '}
                    <strong className={simulaRis.rSim.isPerdita ? 'text-red-600' : 'text-green-700'}>
                      {fmt(simulaRis.rSim.utile)}
                    </strong>
                  </div>
                  {simulaRis.rSim.ricavoTotale > 0 && isFinite(simulaRis.rSim.margine) && (
                    <div>Margine: <strong>{fmtN(simulaRis.rSim.margine)}%</strong></div>
                  )}
                  <div>
                    Variazione:{' '}
                    <strong className={simulaRis.diff >= 0 ? 'text-green-600' : 'text-red-500'}>
                      {simulaRis.diff >= 0 ? '+' : ''}{fmt(simulaRis.diff)}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Alert perdita */}
      {r.isPerdita && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl
                        flex items-start gap-3 animate-pulse-soft">
          <span className="text-2xl leading-none mt-0.5">⚠️</span>
          <div>
            <p className="font-bold text-red-700">
              Attenzione: stai perdendo soldi su questa coltivazione!
            </p>
            <p className="text-red-600 text-sm mt-1">
              Perdi <strong>{fmt(Math.abs(r.utile))}</strong> in totale.
              Rivedi i costi o aumenta il prezzo di vendita.
            </p>
          </div>
        </div>
      )}

      {/* Alert margine basso */}
      {!r.isPerdita && r.isBassaMargine && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">⚡</span>
          <div>
            <p className="font-bold text-yellow-700">
              Margine molto basso ({fmtN(r.margine)}%)
            </p>
            <p className="text-yellow-600 text-sm mt-1">
              Sei sotto il 5%: una piccola variazione potrebbe portarti in perdita.
              Considera di ottimizzare qualche voce di spesa.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
