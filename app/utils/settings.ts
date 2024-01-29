export const handleRatingsVisibleChange = (event) => {
	if (typeof localStorage === 'undefined') {
		return
	}

	const isChecked = event.target.checked
	localStorage.setItem('ratings-visible', isChecked ? 'true' : 'false')
}

export const getRatingsVisible = () => {
	if (typeof localStorage === 'undefined') {
		return false
	}

	return localStorage.getItem('ratings-visible') === 'true'
}
