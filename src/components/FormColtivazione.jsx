import { useState, useEffect } from 'react'
import { calcolaRisultati, fmt, fmtN, n, uid } from '../utils/calcoli'
import { PREZZI_MEDI } from '../data/prezziMedi'

const BLANK = {
  nome: '', unita: 'kg',
  semi: '', acqua: '', trattamenti: '',
  manodopera_ore: '', manodopera_costo: '',
  macchinari: '', altri_costi: '',
  quantita: '', prezzo_vendita: '',
}

function Field({ label, value, onChange, step = '0.01', placeholder = '0,00', className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        type="number" min="0" step={step}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                   transition-shadow"
      />
    </div>
  )
}

function MetricBox({ label, value, color }) {
  return (
    <div className="text-center">
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  )
}

export default function FormColtivazione({ editingColt, onSave, onCancel }) {
  const [form,      setForm]      = useState(BLANK)
  const [suggerito, setSuggerito] = useState(null)

  useEffect(() => {
    setForm(editingColt ? { ...BLANK, ...editingColt } : BLANK)
    setSuggerito(null)
  }, [editingColt])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const onNomeChange = (v) => {
    set('nome', v)
    if (v.length < 2) { setSuggerito(null); return }
    const found = PREZZI_MEDI.find(p =>
      p.nome.toLowerCase() === v.toLowerCase() ||
      (v.length >= 4 && p.nome.toLowerCase().includes(v.toLowerCase()))
    )
    setSuggerito(found || null)
  }

  const applicaSuggerito = () => {
    if (!suggerito) return
    set('prezzo_vendita', String(suggerito.prezzo))
    if (['kg', 'pz', 'lt'].includes(suggerito.unita)) set('unita', suggerito.unita)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nome.trim()) { alert('⚠️ Inserisci il nome della coltivazione!'); return }
    onSave({ ...form, id: editingColt?.id || uid() }, !!editingColt)
  }

  const r        = calcolaRisultati(form)
  const showLive = r.costoTotale > 0 || r.ricavoTotale > 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        {editingColt ? `✏️ Modifica: ${editingColt.nome}` : '🌱 Aggiungi una nuova coltivazione'}
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Compila i dati della tua coltura. I calcoli vengono aggiornati automaticamente.
      </p>

      {suggerito && (
        <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800
                        flex flex-wrap items-center gap-2 animate-fade-in">
          <span>
            💡 <strong>Prezzo medio:</strong>{' '}
            {suggerito.nome}: {fmtN(suggerito.prezzo, 3)} €/{suggerito.unita} ({suggerito.note})
          </span>
          <button type="button" onClick={applicaSuggerito}
                  className="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold
                             px-3 py-1.5 rounded-lg transition-colors">
            Usa questo prezzo
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Nome + Unità */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">🌿 Nome coltivazione *</label>
            <input
              type="text" list="lista-colture" value={form.nome} autoComplete="off"
              onChange={e => onNomeChange(e.target.value)}
              placeholder="Es: Pomodori, Grano duro, Mais…"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
            />
            <datalist id="lista-colture">
              {PREZZI_MEDI.map(p => <option key={p.nome} value={p.nome} />)}
            </datalist>
            <p className="text-xs text-gray-400 mt-1">Inizia a scrivere per vedere il prezzo medio di mercato.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">📏 Unità di misura</label>
            <select value={form.unita} onChange={e => set('unita', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow">
              <option value="kg">Chilogrammi (kg)</option>
              <option value="pz">Pezzi / unità (pz)</option>
              <option value="lt">Litri (lt)</option>
              <option value="cassette">Cassette</option>
              <option value="quintali">Quintali (q)</option>
            </select>
          </div>
        </div>

        {/* Costi */}
        <h3 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-green-400 pl-3">
          💸 Costi di produzione
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Field label="🌱 Semi / Piantine (€)"             value={form.semi}              onChange={v => set('semi', v)} />
          <Field label="💧 Acqua / Irrigazione (€)"          value={form.acqua}             onChange={v => set('acqua', v)} />
          <Field label="🧪 Trattamenti / Concimi (€)"        value={form.trattamenti}       onChange={v => set('trattamenti', v)} />
          <Field label="👷 Manodopera — Ore lavorate"         value={form.manodopera_ore}    onChange={v => set('manodopera_ore', v)}    step="0.5" placeholder="0" />
          <Field label="💰 Manodopera — €/ora"               value={form.manodopera_costo}  onChange={v => set('manodopera_costo', v)}  placeholder="10,00" />
          <Field label="🚜 Macchinari / Carburante (€)"      value={form.macchinari}        onChange={v => set('macchinari', v)} />
          <Field
            label="📦 Altri costi (imballaggi, certificazioni, noleggi…) (€)"
            value={form.altri_costi}
            onChange={v => set('altri_costi', v)}
            className="md:col-span-2 lg:col-span-3"
          />
        </div>

        {/* Ricavi */}
        <h3 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-blue-400 pl-3">
          💵 Ricavi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">📦 Quantità prodotta</label>
            <div className="flex gap-2">
              <input
                type="number" min="0" step="0.01" value={form.quantita} placeholder="0"
                onChange={e => set('quantita', e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
              />
              <span className="shrink-0 bg-green-50 text-green-700 font-semibold text-sm
                               px-4 py-3 rounded-xl border border-green-200">
                {form.unita}
              </span>
            </div>
          </div>
          <Field
            label={`🏷️ Prezzo di vendita (€ per ${form.unita})`}
            value={form.prezzo_vendita}
            onChange={v => set('prezzo_vendita', v)}
            step="0.001"
            placeholder="0,000"
          />
        </div>

        {/* Anteprima live */}
        {showLive && (
          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4 animate-fade-in">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              📊 Anteprima in tempo reale
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricBox label="Costo totale"   value={fmt(r.costoTotale)}  color="text-gray-700" />
              <MetricBox label="Ricavo totale"  value={fmt(r.ricavoTotale)} color="text-blue-600" />
              <MetricBox
                label="Utile / Perdita"
                value={fmt(r.utile)}
                color={r.isPerdita ? 'text-red-600' : 'text-green-600'}
              />
              <MetricBox
                label="Margine %"
                value={r.ricavoTotale > 0 && isFinite(r.margine) ? fmtN(r.margine) + '%' : '–'}
                color={r.isPerdita || r.isBassaMargine ? 'text-orange-500' : 'text-green-600'}
              />
            </div>
          </div>
        )}

        {/* Bottoni */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit"
                  className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white
                             font-bold px-8 py-3 rounded-xl shadow-sm transition-colors text-sm">
            💾 Salva Coltivazione
          </button>
          <button
            type="button"
            onClick={() => { setForm(BLANK); setSuggerito(null) }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold
                       px-6 py-3 rounded-xl transition-colors text-sm"
          >
            🔄 Azzera tutto
          </button>
          {editingColt && (
            <button type="button" onClick={onCancel}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold
                               px-6 py-3 rounded-xl transition-colors text-sm">
              ✕ Annulla modifica
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
