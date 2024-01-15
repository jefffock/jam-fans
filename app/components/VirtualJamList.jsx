import JamCard from './cards/JamCard'
import React, { useState, useRef, useEffect } from 'react'
import { Iframe } from './IFrame'

export default function VirtualJamList({
	items,
	itemHeight,
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
}) {
	let cardHeight = 320
	const totalHeight = items.length * cardHeight
	const startIndex = Math.floor(scrollTop / cardHeight) > 5 ? Math.floor(scrollTop / cardHeight) - 5 : 0
	const endIndex = Math.min(startIndex + Math.ceil((windowHeight - headerHeight) / cardHeight) + 5, items.length - 1)

	const visibleItems = items.slice(startIndex, endIndex)
	const placeholdersBefore = startIndex > 0 ? [...Array(startIndex)] : []
	const placeholdersAfter = endIndex < items.length - 1 ? [...Array(items.length - endIndex)] : []
	// combine placeholders and visible items into one array
	const itemsToRender = [...placeholdersBefore, ...visibleItems, ...placeholdersAfter]
	console.log('itemsToRender', itemsToRender.length, itemsToRender[0], itemsToRender[itemsToRender.length - 1])

	console.log('placeholdersBefore', placeholdersBefore.length)
	console.log('visibleItems', visibleItems.length)
	console.log('placeholdersAfter', placeholdersAfter.length)

	console.log('total num of items', items.length)
	console.log('total num of divs', placeholdersBefore.length + visibleItems.length + placeholdersAfter.length)
	const offsetTop = startIndex * cardHeight
	const handleScroll = (event) => {
		console.log('event.currentTarget.scrollTop', event.currentTarget.scrollTop)
		setScrollTop(event.currentTarget.scrollTop)
	}

	return (
		<div
			ref={jamListRef}
			className=" overflow-y-scroll"
			//`,
			style={{ height: `${windowHeight - (headerHeight || 200)}px`, overflowY: 'scroll' }}
			onScroll={handleScroll}
		>
			<div>
				{/* <div style={{ height: `${totalHeight}px`, position: 'relative' }}> */}
				{/* <div style={{ position: 'absolute', top: `${offsetTop}px` }}> */}
				<div className="max-w-100vw flex flex-col items-center justify-center">
					{itemsToRender.map((item, index) => {
						if (item) {
							return (
								<JamCard
									key={`visibile-${index}`}
									jam={item}
									user={user}
									setShowIframe={setShowIframe}
									setIframeUrl={setIframeUrl}
									showRatings={showRatings}
								/>
							)
						}
						return (
							<div
								key={`placeholder-${index}`}
								// style={{ height: cardHeight, width: cardWidth }}
								className="h-80 m-6"
							></div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
