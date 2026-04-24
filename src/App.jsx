import { useState } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import Toast from './components/Toast'
import FormColtivazione from './components/FormColtivazione'
import CardColtivazione from './components/CardColtivazione'
import Dashboard from './components/Dashboard'
import PrezziMediTable from './components/PrezziMediTable'
import { useColtivazioni } from './hooks/useColtivazioni'

export default function App() {
  const [tab, setTab]             = useState('aggiungi')
  const [editing, setEditing]     = useState(null)
  const [toast, setToast]         = useState(null)

  const { coltivazioni, aggiungi, aggiorna, elimina } = useColtivazioni()

  const showToast = (msg, type = 'ok') => setToast({ msg, type })

  const handleSave = (data, isEdit) => {
    if (isEdit) {
      aggiorna(data.id, data)
      showToast(`✅ "${data.nome}" aggiornata!`)
    } else {
      aggiungi(data)
      showToast(`✅ "${data.nome}" aggiunta!`)
    }
    setEditing(null)
    setTab('lista')
  }

  const handleModifica = (colt) => {
    setEditing(colt)
    setTab('aggiungi')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleElimina = (id, nome) => {
    if (!window.confirm(`Eliminare la coltivazione "${nome}"?`)) return
    elimina(id)
    showToast(`🗑️ "${nome}" eliminata.`, 'warn')
  }

  const handleTabChange = (newTab) => {
    if (newTab !== 'aggiungi') setEditing(null)
    setTab(newTab)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Tabs active={tab} onChange={handleTabChange} count={coltivazioni.length} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {tab === 'aggiungi' && (
          <FormColtivazione
            editingColt={editing}
            onSave={handleSave}
            onCancel={() => { setEditing(null); setTab('lista') }}
          />
        )}

        {tab === 'lista' && (
          coltivazioni.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-lg font-semibold">Nessuna coltivazione ancora.</p>
              <p className="text-sm mt-1">Vai su <strong>➕ Nuova Coltivazione</strong> per iniziare!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Dashboard coltivazioni={coltivazioni} />
              {coltivazioni.map(c => (
                <CardColtivazione
                  key={c.id}
                  colt={c}
                  onModifica={handleModifica}
                  onElimina={handleElimina}
                />
              ))}
            </div>
          )
        )}

        {tab === 'bando' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">🏛️ Simulazione Bando PSR</h2>
              <p className="text-gray-400 text-sm mb-4">
                Consulta i prezzi medi di riferimento ISMEA per valutare la redditività rispetto ai parametri dei bandi agricoli.
              </p>
            </div>
            <PrezziMediTable />
          </div>
        )}

      </main>

      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  )
}
