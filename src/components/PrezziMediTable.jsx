import { PREZZI_MEDI } from '../data/prezziMedi'
import { fmtN } from '../utils/calcoli'

export default function PrezziMediTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-1">📊 Prezzi medi di riferimento</h3>
      <p className="text-sm text-gray-400 mb-4">
        Valori indicativi basati su dati ISMEA e mercati all'ingrosso italiani (campagna 2023).
        Usali per stimare i ricavi prima ancora di aver venduto.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="text-left py-2 px-3 text-gray-500 font-semibold">Coltura</th>
              <th className="text-right py-2 px-3 text-gray-500 font-semibold">Prezzo medio</th>
              <th className="text-left py-2 px-3 text-gray-500 font-semibold">Unità</th>
              <th className="hidden md:table-cell text-left py-2 px-3 text-gray-400 font-normal">Fonte</th>
            </tr>
          </thead>
          <tbody>
            {PREZZI_MEDI.map((p, i) => (
              <tr key={p.nome} className={i % 2 !== 0 ? 'bg-gray-50' : ''}>
                <td className="py-2 px-3 font-medium text-gray-700">{p.nome}</td>
                <td className="py-2 px-3 text-right font-bold text-green-700">{fmtN(p.prezzo, 3)}</td>
                <td className="py-2 px-3 text-gray-400">€/{p.unita}</td>
                <td className="hidden md:table-cell py-2 px-3 text-gray-400 text-xs">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
