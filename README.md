# 🌾 AgriCost

Applicazione web per la gestione dei costi e dei margini di un'azienda agricola. Permette di tracciare coltivazioni, calcolare costi di produzione, ricavi, utili e punto di pareggio, con dati sincronizzati su cloud e accesso multi-dispositivo.

**Live:** [agricost-two.vercel.app](https://agricost-two.vercel.app)

---

## Stack

| Layer | Tecnologia |
|---|---|
| Frontend | React 18 + Vite 5 |
| Stile | Tailwind CSS 3 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth + Email/Password) |
| Hosting | Vercel (deploy automatico da GitHub) |

---

## Struttura progetto

```
src/
├── lib/
│   └── supabase.js              # Client Supabase (URL + anon key)
├── hooks/
│   ├── useAuth.js               # Gestione autenticazione
│   └── useColtivazioni.js       # CRUD coltivazioni su Supabase
├── components/
│   ├── Login.jsx                # Schermata login
│   ├── Header.jsx               # Header con info utente e logout
│   ├── Tabs.jsx                 # Navigazione tab
│   ├── Toast.jsx                # Notifiche temporanee
│   ├── Dashboard.jsx            # Riepilogo aggregato azienda
│   ├── CardColtivazione.jsx     # Card singola coltura
│   ├── FormColtivazione.jsx     # Form aggiunta/modifica
│   └── PrezziMediTable.jsx      # Tabella prezzi medi ISMEA
├── utils/
│   └── calcoli.js               # Motore di calcolo
└── data/
    └── prezziMedi.js            # Prezzi medi ISMEA (27 colture, 2023)
```

---

## Avvio locale

```bash
git clone https://github.com/sh4nk7/AgriCost.git
cd AgriCost
npm install
npm run dev
```

App disponibile su `http://localhost:5173`.

---

## Database — Supabase

### Schema tabella `coltivazioni`

```sql
create table public.coltivazioni (
  id                text primary key,
  user_id           uuid not null references auth.users(id) on delete cascade,
  nome              text not null,
  unita             text default 'kg',
  semi              numeric default 0,
  acqua             numeric default 0,
  trattamenti       numeric default 0,
  manodopera_ore    numeric default 0,
  manodopera_costo  numeric default 0,
  macchinari        numeric default 0,
  altri_costi       numeric default 0,
  quantita          numeric default 0,
  prezzo_vendita    numeric default 0,
  created_at        timestamptz default now()
);
```

### Row Level Security

```sql
alter table public.coltivazioni enable row level security;

create policy "Ogni utente vede solo i propri dati"
  on public.coltivazioni for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

Ogni utente accede esclusivamente ai propri dati. La policy viene applicata automaticamente da Supabase su ogni query.

---

## Autenticazione

### Google OAuth

Configurato tramite Google Cloud Console e Supabase Auth.

- Callback URL Supabase: `https://wdqjjwfsrylsjoevkpoi.supabase.co/auth/v1/callback`
- Redirect post-login: `https://agricost-two.vercel.app`
- App Google: pubblicata (accesso aperto a tutti gli account Google)

### Email / Password

Gli utenti con credenziali email/password vengono creati manualmente dall'amministratore:

**Supabase → Authentication → Users → Add User**

Non è prevista registrazione autonoma dall'app — l'accesso è controllato dall'admin.

---

## Motore di calcolo (`calcoli.js`)

La funzione `calcolaRisultati(coltivazione)` restituisce:

| Campo | Descrizione |
|---|---|
| `costoManodopera` | ore × costo orario |
| `costoTotale` | somma di tutti i costi |
| `ricavoTotale` | quantità × prezzo di vendita |
| `utile` | ricavo − costo |
| `margine` | (utile / ricavo) × 100 |
| `costoPer` | costo per unità prodotta |
| `breakEvenQuantita` | unità minime per coprire i costi |
| `prezzoMinimo` | prezzo minimo per non andare in perdita |
| `roi` | (utile / costo) × 100 |
| `isPerdita` | booleano — utile < 0 |
| `isBassaMargine` | booleano — margine tra 0% e 5% |

---

## Deploy

Il deploy è automatico: ogni push su `main` aggiorna Vercel.

```bash
git add .
git commit -m "descrizione"
git push
```

Per deploy manuale:

```bash
vercel --prod
```

---

## Aggiungere un nuovo utente

1. Accedi a [supabase.com](https://supabase.com) → progetto AgriCost
2. **Authentication → Users → Add User**
3. Inserisci email e password
4. L'utente può accedere subito su [agricost-two.vercel.app](https://agricost-two.vercel.app)

---

## Roadmap

- [ ] Confronto prezzo vendita vs media ISMEA nelle card
- [ ] Export dati in CSV
- [ ] Aggiornamento prezzi ISMEA (attualmente statici 2023)
- [ ] Sezione "Simulazione Bando PSR" con logica requisiti e soglie reddito
