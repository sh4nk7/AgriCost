export function n(v) { return parseFloat(v) || 0 }

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function fmt(v) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v)
}

export function fmtN(v, d = 2) {
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(v)
}

export function calcolaRisultati(c) {
  const costoManodopera = n(c.manodopera_ore) * n(c.manodopera_costo)
  const costoTotale =
    n(c.semi) + n(c.acqua) + n(c.trattamenti) +
    costoManodopera + n(c.macchinari) + n(c.altri_costi)
  const ricavoTotale = n(c.prezzo_vendita) * n(c.quantita)
  const utile        = ricavoTotale - costoTotale
  const costoPer     = n(c.quantita) > 0 ? costoTotale / n(c.quantita) : 0
  const margine      = ricavoTotale > 0
    ? (utile / ricavoTotale) * 100
    : (utile < 0 ? -Infinity : 0)

  const pv  = n(c.prezzo_vendita)
  const qty = n(c.quantita)

  // Quantità minima da vendere per coprire i costi (break-even qty)
  const breakEvenQuantita = pv > 0 ? costoTotale / pv : null
  // Prezzo minimo a cui vendere per coprire i costi (break-even price)
  const prezzoMinimo = qty > 0 ? costoTotale / qty : null
  // ROI: rendimento sul capitale investito
  const roi = costoTotale > 0 ? (utile / costoTotale) * 100 : null

  return {
    costoManodopera,
    costoTotale,
    ricavoTotale,
    utile,
    costoPer,
    margine,
    breakEvenQuantita,
    prezzoMinimo,
    roi,
    isPerdita:      utile < 0,
    isBassaMargine: utile >= 0 && ricavoTotale > 0 && margine < 5,
  }
}
