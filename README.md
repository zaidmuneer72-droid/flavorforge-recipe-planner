# FlavorForge - Recipe Explorer & Meal Planner

A modern, responsive React application built with Tailwind CSS and GitHub Copilot as an AI development co-pilot. The application allows users to search recipes using TheMealDB API, schedule weekly meals, bookmark favorites, and dynamically compute ingredient shopping lists.

---

## 1. Prompts Used During Development

### Service Layer Setup
> "Act as a senior React engineer. Write `src/services/mealApi.js` using native fetch and async/await to integrate with TheMealDB API endpoints (`https://www.themealdb.com/api/json/v1/1`). Read the base URL from Vite environment variables (`import.meta.env.VITE_MEAL_API_BASE_URL`). Export functions for searchMeals, getCategories, filterByCategory, getMealDetails, and parseIngredients."

### UI Layout & Navigation
> "Build a responsive React Navigation Header component in `src/components/Navbar.jsx` using Tailwind CSS and lucide-react icons with active tab state and badge counters."

### Recipe Search & Grid
> "Create a recipe exploration component in `src/components/RecipeSearch.jsx` featuring a search bar, category filter chips, responsive recipe card grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`), and a detail modal displaying parsed ingredients and YouTube cooking guides."

### Planner & Shopping List
> "Build a 7-day meal planner grid in `src/components/WeeklyPlanner.jsx` and a shopping list module in `src/components/ShoppingList.jsx` that deduplicates ingredients automatically."

### ESLint & Syntax Refactoring
> "Fix ESLint warnings: convert local storage reads to functional initializer state calls, replace synchronous setState in useEffect with useMemo for derived shopping list state, and fix card contrast and layout rendering issues."

---

## 2. How AI Assisted Throughout Implementation

GitHub Copilot served as a high-speed development assistant throughout the process:
* **Boilerplate Acceleration:** Fast-tracked creation of layout structures, navigation bars, and responsive Tailwind CSS grid layouts.
* **API Normalization:** Scaffolded asynchronous data-fetching utilities and parsed multi-nested JSON payloads returned by TheMealDB API.
* **State Management Drafting:** Generated initial React state management patterns for multi-tab view switching, favorite bookmarking, and local storage persistence.

---

## 3. Manual Improvements, Corrections & Refactorings

1. **State Initialization Optimization (ESLint `react-hooks/set-state-in-effect` Fix):**
   * *Issue:* The initial AI code called `setFavorites` synchronously inside a `useEffect` on mount, causing redundant renders and triggering ESLint rules.
   * *Correction:* Refactored state declarations to use functional lazy initializers (`useState(() => JSON.parse(localStorage.getItem('favorites')) || [])`).

2. **Derived State Refactoring for Shopping List:**
   * *Issue:* AI attempted to update `shoppingList` state via side-effects whenever `weeklyPlan` changed.
   * *Correction:* Converted `shoppingList` from an independent state variable into a computed dependency using `useMemo`, ensuring sync safety and cleaner data flow.

3. **Card Contrast & Rendering Fix:**
   * *Issue:* AI generated dark card backgrounds that hid text contrast and obscured button positions.
   * *Correction:* Manually overhauled card JSX in `RecipeSearch.jsx` to apply explicit background wrappers (`bg-slate-800 border-slate-700`), visible typography (`text-white`), and proper image aspect ratio containers (`h-48 object-cover`).

4. **API Parameter Edge-Case Handling:**
   * *Issue:* Initial API service calls failed to display recipes on page load if the search query string was empty.
   * *Correction:* Added default fallback parameter logic (`query || 'chicken'`) inside `searchMeals` so users see populated recipe items immediately upon opening the app.