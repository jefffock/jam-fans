import EntityCard from './cards/EntityCard'
// import SetCard from './cards/SetCard'
import { getOnlyShowVerifiedRatings, getRatingsVisible } from '~/utils'

export default function VirtualEntityList({
	items,
	profile,
	setIframeOpen,
	iframeOpen,
	displayRatings,
	setArtistFilters,
	setDateFilter,
	setOpen,
	setActiveAddTab,
	setActiveTab,
	attributes,
	iframeUrl,
	setIframeUrl,
	formattedIframeUrl,
	setFormattedIframeUrl,
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

	const cards = items?.map((item) => {
		return (
			<EntityCard
				key={item.key}
				item={item}
				profile={profile}
				setIframeOpen={setIframeOpen}
				setIframeUrl={setIframeUrl}
				displayRatings={ratingsVisible}
				onlyShowVerifiedRatings={onlyShowVerifiedRatings}
				setDateFilter={setDateFilter}
				setArtistFilters={setArtistFilters}
				setOpen={setOpen}
				setActiveAddTab={setActiveAddTab}
				setActiveTab={setActiveTab}
				attributes={attributes}
			/>
		)
	})

	return (
		<div
			className={`max-w-100vw flex flex-col items-center justify-center p-4 pb-48 ${iframeOpen ? 'lg:pb-0' : 'pb-0'}`}
		>
			{cards}
		</div>
	)
}
