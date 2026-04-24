import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useColtivazioni(userId) {
  const [coltivazioni, setColtivazioni] = useState([])
  const [loading,      setLoading]      = useState(true)

  const fetchAll = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('coltivazioni')
      .select('*')
      .order('created_at', { ascending: true })
    setColtivazioni(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchAll() }, [fetchAll])

  const aggiungi = async (data) => {
    const row = { ...data, user_id: userId }
    const { error } = await supabase.from('coltivazioni').insert(row)
    if (!error) setColtivazioni(prev => [...prev, row])
  }

  const aggiorna = async (id, data) => {
    const { error } = await supabase.from('coltivazioni').update(data).eq('id', id)
    if (!error) setColtivazioni(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }

  const elimina = async (id) => {
    const { error } = await supabase.from('coltivazioni').delete().eq('id', id)
    if (!error) setColtivazioni(prev => prev.filter(c => c.id !== id))
  }

  return { coltivazioni, loading, aggiungi, aggiorna, elimina }
}
