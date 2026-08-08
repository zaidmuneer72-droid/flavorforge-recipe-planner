import { useState } from 'react';
import { getMealDetails, parseIngredients } from '../services/mealApi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

export default function WeeklyPlanner({ plan = {}, setPlan, onView, onGenerateShopping }) {
  const [detailMeal, setDetailMeal] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  function totalPlanned() {
    return DAYS.reduce((acc, d) => acc + (plan[d] ? plan[d].length : 0), 0);
  }

  async function handleAdd(day) {
    const id = window.prompt('Enter meal ID to add to ' + day + ' (idMeal):');
    if (!id) return;
    const mealType = window.prompt('Meal type (Breakfast, Lunch, Dinner):', 'Dinner');
    if (!mealType || !MEAL_TYPES.includes(mealType)) return;
    try {
      const details = await getMealDetails(id);
      if (!details) {
        window.alert('Meal not found');
        return;
      }
      const entry = {
        idMeal: details.idMeal,
        strMeal: details.strMeal,
        strMealThumb: details.strMealThumb,
        mealType,
        ingredients: parseIngredients(details),
      };
      setPlan((prev) => ({ ...prev, [day]: [...(prev[day] || []), entry] }));
    } catch (err) {
      window.alert('Error fetching meal: ' + err.message);
    }
  }

  function handleRemove(day, idMeal) {
    setPlan((prev) => ({ ...prev, [day]: (prev[day] || []).filter((m) => m.idMeal !== idMeal) }));
  }

  async function handleView(idMeal) {
    if (onView) return onView(idMeal);
    setLoadingDetail(true);
    try {
      const details = await getMealDetails(idMeal);
      setDetailMeal(details);
    } catch (err) {
      window.alert('Failed to load details: ' + err.message);
    } finally {
      setLoadingDetail(false);
    }
  }

  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-100">Weekly Planner</h2>
          <div className="flex items-center gap-4">
          <div className="text-sm text-slate-200">Total planned: <span className="font-semibold">{totalPlanned()}</span></div>
          <button onClick={onGenerateShopping} className="px-3 py-2 bg-rose-600 text-white rounded-md">Generate Shopping List</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DAYS.map((day) => (
          <div key={day} className="bg-slate-800 rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-100">{day}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleAdd(day)} className="text-sm px-2 py-1 bg-slate-700 text-slate-200 rounded-md">Add</button>
              </div>
            </div>
            <div className="space-y-2">
              {(plan[day] || []).length === 0 && <div className="text-sm text-slate-400">No meals planned</div>}
              {(plan[day] || []).map((m) => (
                <div key={m.idMeal} className="bg-slate-900 rounded-md p-2 flex items-start gap-2">
                  <img src={m.strMealThumb} alt={m.strMeal} className="w-12 h-12 object-cover rounded-md" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-100">{m.strMeal}</div>
                      <div className="text-xs text-slate-300">{m.mealType}</div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => handleView(m.idMeal)} className="px-2 py-1 text-sm bg-slate-700 text-slate-200 rounded-md">View</button>
                      <button onClick={() => handleRemove(day, m.idMeal)} className="px-2 py-1 text-sm bg-slate-700 text-slate-200 rounded-md">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {detailMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-3xl w-full bg-slate-900 rounded-md overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-100">{detailMeal.strMeal}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setDetailMeal(null)} className="px-3 py-1 bg-slate-800 text-slate-200 rounded-md">Close</button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-100">
              <div className="md:col-span-1">
                <img src={detailMeal.strMealThumb} alt={detailMeal.strMeal} className="w-full h-auto rounded-md" />
                <div className="mt-3 text-sm">
                  <div className="mb-1">Category: {detailMeal.strCategory}</div>
                  <div className="mb-1">Area: {detailMeal.strArea}</div>
                </div>
                {detailMeal.strYoutube && (
                  <a href={detailMeal.strYoutube} target="_blank" rel="noreferrer" className="inline-block mt-3 px-3 py-2 bg-rose-600 text-white rounded-md">Watch on YouTube</a>
                )}
              </div>
              <div className="md:col-span-2">
                <h4 className="text-md font-semibold mb-2">Ingredients</h4>
                <ul className="grid grid-cols-2 gap-2 mb-4">
                  {parseIngredients(detailMeal).map((ing, idx) => (
                    <li key={idx} className="text-sm bg-slate-800 px-2 py-1 rounded-md">
                      <span className="font-medium">{ing.name}</span>: <span className="text-slate-300">{ing.measure}</span>
                    </li>
                  ))}
                </ul>
                <h4 className="text-md font-semibold mb-2">Instructions</h4>
                <p className="text-sm whitespace-pre-line text-slate-200">{detailMeal.strInstructions}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <svg className="animate-spin h-10 w-10 text-rose-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      
    </div>
  );
}
