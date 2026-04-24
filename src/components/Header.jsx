export default function Header({ user, onLogout }) {
  return (
    <header className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-xl">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl">🌾</span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight leading-none">AgriCost</h1>
            <p className="text-green-200 text-sm mt-1">
              Calcola costi, margini e guadagni della tua azienda agricola — semplice, veloce, senza Excel.
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 shrink-0">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="w-9 h-9 rounded-full border-2 border-white/40"
              />
            )}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold leading-none">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-green-200 text-xs mt-0.5">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="text-xs bg-white/10 hover:bg-white/20 text-white font-semibold
                         px-3 py-2 rounded-lg transition-colors border border-white/20"
            >
              Esci
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
