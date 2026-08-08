import { useEffect, useState } from 'react';
import {
  searchMeals,
  getCategories,
  filterByCategory,
  getMealDetails,
  parseIngredients,
} from '../services/mealApi';

export default function RecipeSearch({ favorites, setFavorites, addToWeeklyPlan }) {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalMeal, setModalMeal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      setCatLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        setError(err.message);
      } finally {
        setCatLoading(false);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    let mounted = true
    async function loadDefault() {
      setLoading(true)
      try {
        const results = await searchMeals('')
        if (mounted) setMeals(results || [])
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadDefault()
    return () => {
      mounted = false
    }
  }, [])

  async function handleSearch(e) {
    e?.preventDefault();
    setError(null);
    setSelectedCategory(null);
    setLoading(true);
    try {
      const results = await searchMeals(query.trim());
      setMeals(results || []);
    } catch (err) {
      setError(err.message);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCategory(cat) {
    setError(null);
    setSelectedCategory(cat);
    setLoading(true);
    try {
      const results = await filterByCategory(cat);
      setMeals(results || []);
    } catch (err) {
      setError(err.message);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleFavorite(meal) {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.idMeal === meal.idMeal);
      if (exists) return prev.filter((m) => m.idMeal !== meal.idMeal);
      return [meal, ...prev];
    });
  }

  function addToMealPlan(meal) {
    addToWeeklyPlan?.(meal);
  }

  async function openDetails(id) {
    setModalLoading(true);
    try {
      const detail = await getMealDetails(id);
      setModalMeal(detail);
    } catch (err) {
      setError(err.message);
    } finally {
      setModalLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes or keywords"
          className="flex-1 px-4 py-2 rounded-md bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          type="submit"
          className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
        >
          Search
        </button>
      </form>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Categories</h2>
          {catLoading && <div className="text-sm text-slate-400">Loading...</div>}
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2 whitespace-nowrap">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setMeals([]);
              setQuery('');
            }}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === null ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.idCategory}
              onClick={() => handleCategory(c.strCategory)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === c.strCategory ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-200'
              } inline-block`}
            >
              {c.strCategory}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-rose-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : meals && meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {meals.map((meal) => {
              const id = meal.idMeal || meal.id;
              const title = meal.strMeal || meal.name || '';
              const thumb = meal.strMealThumb || meal.thumb || '';
              const categoryLabel = meal.strCategory || meal.category || selectedCategory || 'Recipe';
              return (
                <div key={id} className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
                  <img src={thumb} alt={title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
                    <span className="inline-block mt-2 px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded">{categoryLabel}</span>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openDetails(id)}
                        className="flex-1 px-3 py-2 bg-white text-slate-900 rounded hover:bg-white/90"
                      >
                        View Recipe
                      </button>
                      <button
                        onClick={() => toggleFavorite(meal)}
                        className="px-3 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
                      >
                        {favorites.find((f) => f.idMeal === id) ? 'Unfavorite' : 'Favorite'}
                      </button>
                      <button
                        onClick={() => addToMealPlan(meal)}
                        className="px-3 py-2 bg-rose-600 text-white rounded hover:bg-rose-500"
                      >
                        Add to Planner
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            {error ? <div>Error: {error}</div> : <div>No recipes found. Try a different search or category.</div>}
          </div>
        )}
      </div>

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
                  <a
                    href={modalMeal.strYoutube}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 px-3 py-2 bg-rose-600 text-white rounded-md"
                  >
                    Watch on YouTube
                  </a>
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
  );
}
