import JamCard from './cards/JamCard'
import ShowCard from './cards/ShowCard'
import SetCard from './cards/SetCard'
// import SetCard from './cards/SetCard'
import React, { useState, useRef, useEffect } from 'react'
import { Iframe } from './IFrame'
import { getOnlyShowVerifiedRatings, getRatingsVisible } from '~/utils'

export default function VirtualEntityList({
	items,
	user,
	setShowIframe,
	setIframeUrl,
	headerHeight,
	windowHeight,
	scrollTop,
}) {
	// let cardHeight = jamCardHeight ? jamCardHeight + 50 : 320
	let cardHeight = 322
	const startIndex = Math.floor(scrollTop / cardHeight) > 5 ? Math.floor(scrollTop / cardHeight) - 5 : 0
	const endIndex = Math.min(startIndex + Math.ceil((windowHeight - headerHeight) / cardHeight) + 7, items?.length)
	const visibleItems = items?.slice(startIndex, endIndex)
	const placeholdersBefore = startIndex > 0 ? [...Array(startIndex + 1)] : []
	const placeholdersAfter = endIndex < items.length - 1 ? [...Array(items?.length - endIndex)] : []
	// combine placeholders and visible items into one array
	// const itemsToRender = [...placeholdersBefore, ...visibleItems, ...placeholdersAfter]
	// TODO: re-implement virtual list
	const itemsToRender = items
	const ratingsVisible = getRatingsVisible()
	const onlyShowVerifiedRatings = getOnlyShowVerifiedRatings()

	useEffect(() => {
		console.log('in use effect')
	}, [])

	return (
		<div>
			<div>
				{/* <div style={{ height: `${totalHeight}px`, position: 'relative' }}> */}
				{/* <div style={{ position: 'absolute', top: `${offsetTop}px` }}> */}
				<div className="max-w-100vw flex flex-col items-center justify-center">
					{itemsToRender?.map((item, index) => {
						if (item?.entity === 'Jam') {
							return (
								<JamCard
									key={`${item?.entity}-${item?.id}`}
									jam={item}
									user={user}
									setShowIframe={setShowIframe}
									setIframeUrl={setIframeUrl}
									showRatings={ratingsVisible}
									onlyShowVerifiedRatings={onlyShowVerifiedRatings}
								/>
							)
						} else if (item?.entity === 'Show') {
							return <ShowCard key={`${item?.entity}-${item?.id}`} show={item} user={user} />
						}
						return <SetCard key={`${item?.entity}-${item?.id}`} set={item} user={user} />
					})}
				</div>
			</div>
		</div>
	)
}
