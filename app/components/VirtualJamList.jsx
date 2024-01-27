import JamCard from './cards/JamCard'
import ShowCard from './cards/ShowCard'
import SetCard from './cards/SetCard'
// import SetCard from './cards/SetCard'
import React, { useState, useRef, useEffect } from 'react'
import { Iframe } from './IFrame'
import { getRatingsVisible } from '~/utils'

export default function VirtualEntityList({
	items,
	user,
	setShowIframe,
	setIframeUrl,
	showRatings,
	headerHeight,
	windowHeight,
	windowWidth,
	scrollTop,
	setScrollTop,
	jamListRef,
	prevJamListRef,
	jamCardHeight,
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
	const handleScroll = (event) => {
		prevJamListRef.current = scrollTop
		setScrollTop(event.currentTarget.scrollTop)
	}
	const ratingsVisible = getRatingsVisible()

	return (
		<div
			ref={jamListRef}
			// className=" overflow-y-scroll pb-20"
			// style={{ height: `${windowHeight - (headerHeight || 200)}px`, overflowY: 'scroll' }}
			// onScroll={handleScroll}
		>
			<div>
				{/* <div style={{ height: `${totalHeight}px`, position: 'relative' }}> */}
				{/* <div style={{ position: 'absolute', top: `${offsetTop}px` }}> */}
				<div className="max-w-100vw flex flex-col items-center justify-center">
					{itemsToRender?.map((item, index) => {
						if (item?.entity === 'Jam') {
							return (
								<JamCard
									key={`visibile-${index}`}
									jam={item}
									user={user}
									setShowIframe={setShowIframe}
									setIframeUrl={setIframeUrl}
									showRatings={ratingsVisible}
								/>
							)
						} else if (item?.entity === 'Show') {
							return <ShowCard key={`visibile-${index}`} show={item} user={user} />
						}
						// else if (item?.entity === 'Set') {
						// 	return <SetCard key={`visibile-${index}`} set={item} user={user} />
						// }
						return <SetCard key={`visible-${index}`} set={item} user={user} />
					})}
				</div>
			</div>
		</div>
	)
}
