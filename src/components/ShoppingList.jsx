 

export default function ShoppingList({ items = [], toggleItem }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-slate-100 mb-4">Shopping List</h2>
      <div className="space-y-2">
        {items.length === 0 && <div className="text-slate-400">No items in your shopping list</div>}
        {items.map((it) => (
          <div key={it.name} className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-md">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={!!it.checked} onChange={() => toggleItem(it.name)} className="w-4 h-4" />
              <div>
                <div className={it.checked ? 'line-through text-slate-400' : 'text-slate-100'}>{it.name}</div>
                <div className="text-sm text-slate-300">{it.measures.join(', ')}</div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
