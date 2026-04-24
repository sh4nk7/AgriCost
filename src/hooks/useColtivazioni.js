import { useState, useEffect } from 'react'

const KEY = 'agricost_v1'

export function useColtivazioni() {
  const [coltivazioni, setColtivazioni] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(coltivazioni))
  }, [coltivazioni])

  const aggiungi = (data) =>
    setColtivazioni(prev => [...prev, data])

  const aggiorna = (id, data) =>
    setColtivazioni(prev => prev.map(c => c.id === id ? { ...c, ...data, id } : c))

  const elimina = (id) =>
    setColtivazioni(prev => prev.filter(c => c.id !== id))

  return { coltivazioni, aggiungi, aggiorna, elimina }
}
