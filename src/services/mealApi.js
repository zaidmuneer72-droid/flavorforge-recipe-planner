const BASE_URL = (import.meta.env.VITE_MEAL_API_BASE_URL || 'https://www.themealdb.com/api/json/v1/1').replace(/\/$/, '')

function forceHttpsUrl(url) {
	return url.replace(/^http:\/\//i, 'https://')
}

async function fetchJson(url, errorLabel) {
	try {
		const res = await fetch(forceHttpsUrl(url))
		if (!res.ok) {
			throw new Error(`${errorLabel} failed with status ${res.status}`)
		}
		return await res.json()
	} catch (error) {
		console.error(`${errorLabel} error:`, error)
		throw error
	}
}

export async function searchMeals(query) {
	try {
		const data = await fetchJson(`${BASE_URL}/search.php?s=${query || 'chicken'}`, 'searchMeals')
		return data.meals || []
	} catch (error) {
		console.error('searchMeals error:', error)
		return []
	}
}

export async function getMealDetails(id) {
	try {
		const data = await fetchJson(`${BASE_URL}/lookup.php?i=${id}`, 'getMealDetails')
		return (data.meals && data.meals[0]) || null
	} catch (error) {
		console.error('getMealDetails error:', error)
		return null
	}
}

export async function getCategories() {
	try {
		const data = await fetchJson(`${BASE_URL}/categories.php`, 'getCategories')
		return Array.isArray(data.categories)
			? data.categories.filter((category) => category && category.strCategory)
			: []
	} catch (error) {
		console.error('getCategories error:', error)
		return []
	}
}

export async function filterByCategory(category) {
	try {
		if (!category) return []
		const data = await fetchJson(`${BASE_URL}/filter.php?c=${category}`, 'filterByCategory')
		return data.meals || []
	} catch (error) {
		console.error('filterByCategory error:', error)
		return []
	}
}

export function parseIngredients(meal = {}) {
	const ingredients = []
	for (let i = 1; i <= 20; i++) {
		const name = (meal[`strIngredient${i}`] || '').trim()
		const measure = (meal[`strMeasure${i}`] || '').trim()
		if (name && name !== '') {
			ingredients.push({ name, measure })
		}
	}
	return ingredients
}

export default {
	searchMeals,
	getMealDetails,
	getCategories,
	filterByCategory,
	parseIngredients,
}

