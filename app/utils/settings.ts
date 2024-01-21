export const handleRatingsVisibleChange = (event) => {
	if (typeof localStorage === 'undefined') {
		console.warn('localStorage is not available')
		return
	}

	const isChecked = event.target.checked
	localStorage.setItem('ratings-visible', isChecked ? 'true' : 'false')
}

export const getRatingsVisible = () => {
	if (typeof localStorage === 'undefined') {
		console.warn('localStorage is not available')
		return false // or a default value you prefer
	}

	return localStorage.getItem('ratings-visible') === 'true'
}
