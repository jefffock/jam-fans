import JamCard from './cards/JamCard'
import React, { PureComponent } from 'react'

// These item sizes are arbitrary.
// Yours should be based on the content of the item.
const columnWidths = new Array(1000).fill(true).map(() => 75 + Math.round(Math.random() * 50))
const rowHeights = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 50))

export function VirtualJamList({ jams }) {
	const isServerRender = typeof document === 'undefined'
	// const useSSRLayoutEffect = isServerRender ? () => {} : useLayoutEffect;

	// function useIsHydrating(queryString: string) {
	//   const [isHydrating] = useState(
	//     () => !isServerRender && Boolean(document.querySelector(queryString)),
	//   );
	//   return isHydrating;
	// }
	// 	return <div>{jams && jams.map((jam) => <JamCard jam={jam} />)}</div>
	// }

	// export const InfiniteJamList =
	// 	() =>
	// 	({
	// 		// Are there more items to load?
	// 		// (This information comes from the most recent API request.)
	// 		hasNextPage,

	// 		// Are we currently loading a page of items?
	// 		// (This may be an in-flight flag in your Redux store for example.)
	// 		isNextPageLoading,

	// 		// Array of items loaded so far.
	// 		items,

	// 		// Callback function responsible for loading the next page of items.
	// 		loadNextPage,
	// 	}) => {
	// 		// If there are more items to be loaded then add an extra row to hold a loading indicator.
	// 		const itemCount = hasNextPage ? items.length + 1 : items.length

	// 		// Only load 1 page of items at a time.
	// 		// Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
	// 		const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage

	// 		// Every row is loaded except for our loading indicator row.
	// 		const isItemLoaded = (index) => !hasNextPage || index < items.length

	// 		// Render an item or a loading indicator.
	// 		// const Item = ({ index, style }) => {
	// 		// 	let content
	// 		// 	if (!isItemLoaded(index)) {
	// 		// 		content = 'Loading...'
	// 		// 	} else {
	// 		// 		content = items[index].name
	// 		// 	}

	// 		// 	return <div style={style}>{content}</div>
	// 		// }

	function cellRenderer({ columnIndex, key, rowIndex, style }) {
		return (
			<div key={key} style={style}>
				{list[rowIndex][columnIndex]}
			</div>
		)
	}

	// if (isServerRender) {
	return (
		<div>
			{jams?.map((jam, index) => (
				<JamCard key={index} jam={jam} />
			))}
		</div>
	)
	return <div>loading...</div>
	// }

	const height = document.documentElement.clientHeight
	const width = document.documentElement.clientWidth
	const Cell = ({ index, style }) => {
		let content
		if (!isItemLoaded(index)) {
			content = 'Loading...'
		} else {
			content = items[index]
		}
		return (
			<div>
				<p style={style}>test{index}</p>
			</div>
		)
	}

	return (
		<Grid
			cellRenderer={cellRenderer}
			columnCount={() => 400 / 300}
			columnWidth={300}
			rowCount={() => 1000 / 600}
			rowHeight={600}
			itemData={jams}
			height={height}
			width={width}
		>
			{Cell}
		</Grid>
	)
}
