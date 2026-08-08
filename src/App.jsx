import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import RecipeSearch from './components/RecipeSearch'
import WeeklyPlanner from './components/WeeklyPlanner'
import ShoppingList from './components/ShoppingList'
import Favorites from './components/Favorites'
import { getMealDetails, parseIngredients } from './services/mealApi'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function hydratePlan(raw) {
  try {
    const parsed = JSON.parse(raw || '{}')
    const base = {}
    DAYS.forEach((d) => {
      base[d] = parsed[d] || []
    })
    return base
  } catch (error) {
    console.error(error)
    const base = {}
    DAYS.forEach((d) => (base[d] = []))
    return base
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('explore')
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('favorites')
      return raw ? JSON.parse(raw) : []
    } catch (error) {
      console.error(error)
      return []
    }
  })
  const [weeklyPlan, setWeeklyPlan] = useState(() => hydratePlan(localStorage.getItem('weeklyPlan')))
  const [checkedMap, setCheckedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shoppingChecked')) || {}
    } catch (error) {
      console.error(error)
      return {}
    }
  })
  const [modalMeal, setModalMeal] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('weeklyPlan', JSON.stringify(weeklyPlan))
  }, [weeklyPlan])

  useEffect(() => {
    localStorage.setItem('weeklyPlan', JSON.stringify(weeklyPlan))
  }, [weeklyPlan])

  useEffect(() => {
    try {
      localStorage.setItem('shoppingChecked', JSON.stringify(checkedMap))
    } catch (error) {
      console.error(error)
    }
  }, [checkedMap])

  function addToWeeklyPlan(meal) {
    const day = window.prompt('Add to which day? (e.g. Monday)')
    if (!day || !DAYS.includes(day)) return
    const mealType = window.prompt('Meal type (Breakfast, Lunch, Dinner):', 'Dinner')
    if (!mealType) return
    const entry = {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      mealType,
      ingredients: meal.ingredients || [],
    }
    setWeeklyPlan((prev) => ({ ...prev, [day]: [...(prev[day] || []), entry] }))
    setActiveTab('planner')
  }

  function toggleShoppingItem(name) {
    setCheckedMap((prev) => ({ ...prev, [name.toLowerCase()]: !prev[name.toLowerCase()] }))
  }

  function removeFavorite(idMeal) {
    setFavorites((prev) => prev.filter((f) => f.idMeal !== idMeal))
  }

  async function openDetails(idMeal) {
    setModalLoading(true)
    try {
      const details = await getMealDetails(idMeal)
      setModalMeal(details)
    } catch (error) {
      console.error(error)
    } finally {
      setModalLoading(false)
    }
  }

  const plannerCount = useMemo(() => DAYS.reduce((acc, d) => acc + ((weeklyPlan[d] || []).length), 0), [weeklyPlan])

  const shoppingListItems = useMemo(() => {
    const map = new Map()
    DAYS.forEach((d) => {
      ;(weeklyPlan[d] || []).forEach((entry) => {
        ;(entry.ingredients || []).forEach((ing) => {
          const key = (ing.name || '').trim().toLowerCase()
          if (!key) return
          if (!map.has(key)) map.set(key, new Set())
          if (ing.measure) map.get(key).add(ing.measure)
        })
      })
    })
    return Array.from(map.entries()).map(([name, measures]) => ({ name, measures: Array.from(measures), checked: !!checkedMap[name] }))
  }, [weeklyPlan, checkedMap])

  const shoppingCount = shoppingListItems.length

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} plannerCount={plannerCount} shoppingCount={shoppingCount} />
      <main>
        {activeTab === 'explore' && (
          <RecipeSearch favorites={favorites} setFavorites={setFavorites} addToWeeklyPlan={addToWeeklyPlan} />
        )}
        {activeTab === 'planner' && (
          <WeeklyPlanner plan={weeklyPlan} setPlan={setWeeklyPlan} onView={openDetails} onGenerateShopping={() => setActiveTab('shopping')} />
        )}
        {activeTab === 'shopping' && (
          <ShoppingList items={shoppingListItems} toggleItem={toggleShoppingItem} />
        )}
        {activeTab === 'favorites' && (
          <Favorites favorites={favorites} removeFavorite={removeFavorite} onViewRecipe={openDetails} />
        )}
      </main>

      {modalMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-3xl w-full bg-slate-900 rounded-md overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-100">{modalMeal.strMeal}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setModalMeal(null)} className="px-3 py-1 bg-slate-800 text-slate-200 rounded-md">Close</button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-100">
              <div className="md:col-span-1">
                <img src={modalMeal.strMealThumb} alt={modalMeal.strMeal} className="w-full h-auto rounded-md" />
                <div className="mt-3 text-sm">
                  <div className="mb-1">Category: {modalMeal.strCategory}</div>
                  <div className="mb-1">Area: {modalMeal.strArea}</div>
                  {modalMeal.strTags && <div className="mb-1">Tags: {modalMeal.strTags}</div>}
                </div>
                {modalMeal.strYoutube && (
                  <a href={modalMeal.strYoutube} target="_blank" rel="noreferrer" className="inline-block mt-3 px-3 py-2 bg-rose-600 text-white rounded-md">Watch on YouTube</a>
                )}
              </div>
              <div className="md:col-span-2">
                <h4 className="text-md font-semibold mb-2">Ingredients</h4>
                <ul className="grid grid-cols-2 gap-2 mb-4">
                  {parseIngredients(modalMeal).map((ing, idx) => (
                    <li key={idx} className="text-sm bg-slate-800 px-2 py-1 rounded-md">
                      <span className="font-medium">{ing.name}</span>: <span className="text-slate-300">{ing.measure}</span>
                    </li>
                  ))}
                </ul>
                <h4 className="text-md font-semibold mb-2">Instructions</h4>
                <p className="text-sm whitespace-pre-line text-slate-200">{modalMeal.strInstructions}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <svg className="animate-spin h-10 w-10 text-rose-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default App
