export const formatIframeUrl = (iframeUrl) => {
	let reformattedLink
	if (iframeUrl.includes('youtu')) {
		if (iframeUrl.includes('watch?v=')) {
			reformattedLink = iframeUrl.replace('watch?v=', 'embed/')
		}
		if (iframeUrl.includes('youtu.be')) {
			let youTubeId
			let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
			let match = iframeUrl.match(regExp)
			if (match && match[2].length === 11) {
				youTubeId = match[2]
				reformattedLink = `https://www.youtube.com/embed/${youTubeId}?autoplay=1`
			}
		}
	}
	return reformattedLink ?? iframeUrl
}
