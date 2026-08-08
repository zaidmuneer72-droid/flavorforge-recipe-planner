const BASE_URL = import.meta.env.VITE_MEAL_API_BASE_URL || 'https://www.themealdb.com/api/json/v1/1'

function forceHttpsUrl(url) {
	const parsedUrl = new URL(url, 'https://www.themealdb.com')
	parsedUrl.protocol = 'https:'
	return parsedUrl.toString()
}

async function fetchJson(path) {
	try {
		const res = await fetch(forceHttpsUrl(`${BASE_URL}${path}`))
		if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`)
		return await res.json()
	} catch (error) {
		console.error('fetchJson error:', error)
		throw error
	}
}

export async function searchMeals(query) {
	try {
		const q = query && String(query).trim() ? String(query).trim() : 'chicken'
		const data = await fetchJson(`/search.php?s=${encodeURIComponent(q)}`)
		return data.meals || []
	} catch (error) {
		console.error('searchMeals error:', error)
		return []
	}
}

export async function getMealDetails(id) {
	try {
		const data = await fetchJson(`/lookup.php?i=${encodeURIComponent(id)}`)
		return (data.meals && data.meals[0]) || null
	} catch (error) {
		console.error('getMealDetails error:', error)
		return null
	}
}

export async function getCategories() {
	try {
		const data = await fetchJson('/categories.php')
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
		const data = await fetchJson(`/filter.php?c=${encodeURIComponent(category)}`)
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
};

