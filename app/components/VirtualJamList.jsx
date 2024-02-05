import IFrame from './IFrame'
import EntityCard from './cards/EntityCard'
// import SetCard from './cards/SetCard'
import { useEffect, useState } from 'react'
import { getOnlyShowVerifiedRatings, getRatingsVisible } from '~/utils'

export default function VirtualEntityList({
	items,
	profile,
	setShowIframe,
	showIframe,
	showRatings,
	setArtistFilters,
	setDateFilter,
	setOpen,
	setActiveAddTab,
	setActiveTab,
}) {
	// let cardHeight = jamCardHeight ? jamCardHeight + 50 : 320
	// let cardHeight = 322
	// const startIndex = Math.floor(scrollTop / cardHeight) > 5 ? Math.floor(scrollTop / cardHeight) - 5 : 0
	// const endIndex = Math.min(startIndex + Math.ceil((windowHeight - headerHeight) / cardHeight) + 7, items?.length)
	// const visibleItems = items?.slice(startIndex, endIndex)
	// const placeholdersBefore = startIndex > 0 ? [...Array(startIndex + 1)] : []
	// const placeholdersAfter = endIndex < items.length - 1 ? [...Array(items?.length - endIndex)] : []
	// combine placeholders and visible items into one array
	// const itemsToRender = [...placeholdersBefore, ...visibleItems, ...placeholdersAfter]
	// TODO: re-implement virtual list
	// const itemsToRender = items
	const ratingsVisible = getRatingsVisible()
	const onlyShowVerifiedRatings = getOnlyShowVerifiedRatings()
	const [iframeUrl, setIframeUrl] = useState('')
	const [formattedIframeUrl, setFormattedIframeUrl] = useState('')

	useEffect(() => {
		let reformattedLink
		if (!reformattedLink && iframeUrl) {
			if (iframeUrl.includes('youtu')) {
				if (iframeUrl.includes('watch?v=')) {
					reformattedLink = iframeUrl.replace('watch?v=', 'embed/')
				}
				if (iframeUrl.includes('youtu.be')) {
					let youTubeId
					let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
					let match = iframeUrl.match(regExp)
					if (match && match[2].length == 11) {
						youTubeId = match[2]
						reformattedLink = `https://www.youtube.com/embed/${youTubeId}?autoplay=1`
					}
				}
				1
			}
		}
		setFormattedIframeUrl(reformattedLink ?? iframeUrl)
	}, [iframeUrl])

	function closeIframe() {
		setShowIframe(false)
	}

	const cards = items?.map((item) => {
		return (
			<EntityCard
				key={item.key}
				item={item}
				profile={profile}
				setShowIframe={setShowIframe}
				setIframeUrl={setIframeUrl}
				showRatings={ratingsVisible}
				onlyShowVerifiedRatings={onlyShowVerifiedRatings}
				setDateFilter={setDateFilter}
				setArtistFilters={setArtistFilters}
				setOpen={setOpen}
				setActiveAddTab={setActiveAddTab}
				setActiveTab={setActiveTab}
			/>
		)
	})

	return (
		<div>
			{showIframe && formattedIframeUrl && (
				<>
					<IFrame formattedIframeUrl={formattedIframeUrl} closeIframe={closeIframe} />
				</>
			)}
			<div className="max-w-100vw flex flex-col items-center justify-center">{cards}</div>
		</div>
	)
}
