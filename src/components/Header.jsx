export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-xl">
      <div className="max-w-5xl mx-auto px-5 py-5 flex items-center gap-4">
        <span className="text-5xl">🌾</span>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-none">AgriCost</h1>
          <p className="text-green-200 text-sm mt-1">
            Calcola costi, margini e guadagni della tua azienda agricola — semplice, veloce, senza Excel.
          </p>
        </div>
      </div>
    </header>
  )
}
