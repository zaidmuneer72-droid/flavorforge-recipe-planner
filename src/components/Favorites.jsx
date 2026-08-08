import { Trash2 } from 'lucide-react'

export default function Favorites({ favorites = [], removeFavorite, onViewRecipe }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-slate-100 mb-4">Favorites</h2>
      {favorites.length === 0 ? (
        <div className="text-slate-400">You haven't added any favorites yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map((f) => (
            <div key={f.idMeal} className="bg-slate-800 rounded-md overflow-hidden">
              <img src={f.strMealThumb} alt={f.strMeal} className="w-full h-40 object-cover" />
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-100">{f.strMeal}</div>
                    <div className="text-sm text-slate-300">{f.strCategory || ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onViewRecipe?.(f.idMeal)} className="px-2 py-1 bg-slate-700 text-slate-200 rounded-md text-sm">View Details</button>
                    <button onClick={() => removeFavorite(f.idMeal)} className="px-2 py-1 bg-rose-600 text-white rounded-md text-sm flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
