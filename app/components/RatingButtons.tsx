import { useFetcher } from '@remix-run/react'
import RatingButton from './RatingButton'

export default function RatingButtons({ entity, entityType, actionName }) {
	const fetcher = useFetcher()
	const ratings = [6, 7, 8, 9, 10]
	console.log('entity in rating buttons', entity)
	return (
		<div className="flex justify-center gap-4 p-2 max-w-screen">
			{ratings.map((rating) => (
				<RatingButton
					key={rating}
					rating={rating}
					entityId={entity.id}
					entityType={entityType}
					actionName={actionName}
					fetcher={fetcher}
					currentRating={entity.userRating}
				/>
			))}
		</div>
	)
}
