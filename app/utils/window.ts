import { useEffect, useState } from 'react'

export const useWindowHeight = () => {
	// Initialize state with a default value
	const [height, setHeight] = useState(0)

	useEffect(() => {
		// Define a function to update the state with the current window height
		const updateHeight = () => {
			setHeight(window.innerHeight)
		}

		// Update the height once the component mounts
		updateHeight()

		// Optionally, listen for window resize events and update the height
		window.addEventListener('resize', updateHeight)

		// Cleanup function to remove the event listener
		return () => window.removeEventListener('resize', updateHeight)
	}, []) // Empty dependency array ensures this runs once on mount

	return height
}

export const useWindowWidth = () => {
	// Initialize state with a default value
	const [width, setWidth] = useState(0)

	useEffect(() => {
		// Define a function to update the state with the current window width
		const updateWidth = () => {
			setWidth(window.innerWidth)
		}

		// Update the width once the component mounts
		updateWidth()

		// Optionally, listen for window resize events and update the width
		window.addEventListener('resize', updateWidth)

		// Cleanup function to remove the event listener
		return () => window.removeEventListener('resize', updateWidth)
	}, []) // Empty dependency array ensures this runs once on mount

	return width
}

export const scrollToBottomOfWindow = () => {
	window?.scrollTo({
		top: document.body.scrollHeight,
		behavior: 'smooth',
	})
}

export const scrollToTopOfWindow = () => {
	window?.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
}

export const scrollToTopOfRef = (ref) => {
	if (ref.current) {
		ref.current.scrollTop = 0
	}
}
