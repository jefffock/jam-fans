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
}) {
	let height = 300
	let containerHeight = 1000
	const [scrollTop, setScrollTop] = useState(0)
	const totalHeight = items.length * height
	const startIndex = Math.floor(scrollTop / height)
	const endIndex = Math.min(startIndex + Math.ceil(containerHeight / height), items.length - 1)

	const visibleItems = items.slice(startIndex, endIndex + 1)
	const offsetTop = startIndex * height
	const handleScroll = (event) => {
		setScrollTop(event.currentTarget.scrollTop)
	}

	const divRef = useRef(null)

	// State to store the height
	const [divHeight, setHeight] = useState(0)

	useEffect(() => {
		// Measure the height and update state
		if (divRef.current) {
			setHeight(divRef.current.clientHeight)
		}

		// Optional: Update height on window resize
		const handleResize = () => {
			if (divRef.current) {
				setHeight(divRef.current.clientHeight)
			}
		}

		window.addEventListener('resize', handleResize)

		// Cleanup the event listener
		return () => window.removeEventListener('resize', handleResize)
	}, []) // Empty dependency array ensures this runs once on mount

	return (
		<div
			ref={divRef}
			className=" overflow-y-scroll"
			//`,
			style={{ height: `${windowHeight - (headerHeight || 200)}px`, overflowY: 'scroll' }}
			onScroll={handleScroll}
		>
			<div style={{ height: `${totalHeight}px`, position: 'relative' }}>
				<div style={{ position: 'absolute', top: `${offsetTop}px` }}>
					{visibleItems.map((item, index) => (
						// <div key={index}>{JSON.stringify(item)}</div>
						<JamCard
							key={item.id}
							jam={item}
							user={user}
							setShowIframe={setShowIframe}
							setIframeUrl={setIframeUrl}
							showRatings={showRatings}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
