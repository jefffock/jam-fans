import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import AttributePicker from '../AttributePicker'
import Button from '../Button'
import RateComment from '../RateComment'
import HeartOutline from '../icons/HeartOutlineIcon'
import HeartSolid from '../icons/HeartSolidIcon'
import PlusCircleSolid from '../icons/PlusCircleSolid'
import SoundIcon from '../icons/SoundIcon'
import ThumbSolidIcon from '../icons/ThumbSolidIcon'
import PlusCircleIcon from '../icons/plus-circle'
import ThumbUpOutline from '../icons/thumb-up-outline'

export default function EntityCard({
	item,
	profile,
	displayRatings,
	setIframeOpen,
	setIframeUrl,
	showDateArtistLocation = true,
	onlyShowVerifiedRatings,
	ref,
	setDateFilter,
	setArtistFilters,
	setOpen,
	setActiveAddTab,
	setActiveTab,
	attributes,
	inAdd,
}) {
	const verifiedRating = (item?.avg_rating / 2).toFixed(1)?.replace(/\.?0+$/, '')
	// const unverifiedRating = (item?.avg_unverified_rating / 2).toFixed(1)?.replace(/\.?0+$/, '')
	const [showComments, setShowComments] = useState(false)
	const [showCurateOptions, setShowCurateOptions] = useState(false)
	const fetcher = useFetcher()
	const addShowFetcher = useFetcher()

	const previousAttributes =
		(attributes &&
			item?.attribute_ids?.map((attributeId) =>
				JSON.stringify(attributes?.find((attribute) => attribute.id === attributeId))
			)) ||
		[]
	const [stringifiedSelectedAttributes, setStringifiedSelectedAttributes] = useState(
		[...previousAttributes.map((item) => item)] ?? []
	)

	let parsedSelectedAttributes
	if (stringifiedSelectedAttributes) {
		parsedSelectedAttributes = stringifiedSelectedAttributes?.map((item) => JSON.parse(item)).filter(Boolean)
	}

	const newParsedSelectedAttributes = parsedSelectedAttributes.filter((attr) => !item.attribute_ids.includes(attr.id))

	function handleListenClick() {
		setIframeUrl(item?.listen_link)
		setIframeOpen(true)
	}

	const comments = item?.ratings
		?.filter((rating) => {
			return rating.f3 && rating.f3.trim() !== ''
		})
		.map((rating) => {
			return {
				rating: rating.f1,
				name: rating.f2,
				comment: rating.f3,
			}
		})

	function handleCommentClick() {
		setShowComments(!showComments)
	}

	function handlePlusClick() {
		setShowCurateOptions(!showCurateOptions)
	}

	let songEmojis = item.song_emoji?.split(',')
	let artistEmojis = item.artist_emoji?.split(',')

	const ratingToShow = verifiedRating

	function handleDateClick() {
		setDateFilter(item.date)
		setArtistFilters([JSON.stringify(item?.artist_id)])
		setOpen(true)
		setActiveTab('add')
		setActiveAddTab('jamSetShow')
	}

	function handleAttributesChange(e) {
		const newAttribute = e.target.value
		let updatedAttributes = []
		if (e.target.checked) {
			updatedAttributes = [...stringifiedSelectedAttributes, newAttribute]
		} else {
			updatedAttributes = stringifiedSelectedAttributes?.filter(
				(attribute) => JSON.parse(attribute).id !== JSON.parse(newAttribute).id
			)
		}
		setStringifiedSelectedAttributes(updatedAttributes)
	}

	const likesToShow = fetcher?.state === 'idle' ? item?.likes || '' : Number(item?.likes) + 1

	const sortedSounds = item?.attributes
		?.filter((soundItem) => {
			const foundAttribute = attributes?.find((attribute) => attribute.label === soundItem)
			return foundAttribute?.is_sound
		})
		.sort((a, b) => a.localeCompare(b))

	const sortedPlatforms = item?.attributes
		?.filter((platformItem) => {
			const foundAttribute = attributes?.find((attribute) => attribute.label === platformItem)
			return foundAttribute && !foundAttribute.is_sound
		})
		.sort((a, b) => a.localeCompare(b))

	return (
		<div
			className={`p-4 bg-gray-50 border border-gray-200 rounded-lg shadow my-4 flex flex-col justify-between h-90 max-w-95p w-112`}
			onClick={() => console.log('item', item)}
		>
			<div className="overflow-y-auto">
				<div className="flex justify-between">
					{item?.entity === 'Jam' && (
						<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
							{item.song_name}{' '}
							{songEmojis && songEmojis.map((emoji) => String.fromCodePoint(emoji)).join('')}
						</h5>
					)}
					{item?.entity === 'Set' && (
						<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900" onClick={handleDateClick}>
							{item.date}
						</h5>
					)}
					{item?.entity === 'Show' && (
						<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900" onClick={handleDateClick}>
							{item.date_text}
						</h5>
					)}
					{fetcher?.state !== 'idle' && (
						<p className="mb-2 text-xl tracking-tight text-gray-900">{`updating...`}</p>
					)}
					{/* first row */}
					{item.entity === 'Show' && <h5 className="mb-2 text-xl tracking-tight text-gray-500 ">show</h5>}
					{item.entity === 'Set' && (
						<h5 className="mb-2 text-xl tracking-tight text-gray-500 ">
							{item.set_number.replace('_', ' ')}
						</h5>
					)}
					{item.entity === 'Jam' && <h5 className="mb-2 text-xl tracking-tight text-gray-500 ">jam</h5>}
				</div>
				{showDateArtistLocation && (
					<div className="flex justify-between">
						{/* left */}
						<div className="flex items-center space-x-4">
							{item.entity === 'Jam' && item.show_id && (
								<h5
									className={`mb-2 text-xl tracking-tight text-gray-900 ${inAdd ? '' : 'underline cursor-pointer'}`}
									onClick={handleDateClick}
								>
									{item.date}
								</h5>
							)}
							{item.entity === 'Jam' && !item.show_id && (
								<addShowFetcher.Form method="post" action="?index" preventScrollReset={true}>
									<input type="hidden" name="artist_id" value={item.artist_id} />
									<input type="hidden" name="date_text" value={item.date} />
									<input type="hidden" name="day" value={item?.date?.slice(8, 10)} />
									<input type="hidden" name="month" value={item?.date?.slice(5, 7)} />
									<input type="hidden" name="year" value={item?.date?.slice(0, 4)} />
									<input type="hidden" name="location" value={item.location} />
									<div className="flex justify-items-start gap-8 align-middle">
										<p className="mb-2 text-xl tracking-tight text-gray-900">{item.date}</p>
										<Button
											text={addShowFetcher?.state === 'idle' ? 'add show' : 'adding show...'}
											type={'submit'}
											name={'_action'}
											value={'add-show'}
											disabled={addShowFetcher?.state !== 'idle'}
										/>
									</div>
								</addShowFetcher.Form>
							)}
							{item.entity !== 'Jam' && (
								<h6 className="mb-2 text-xl tracking-tight text-gray-900">
									{item.artists.artist}{' '}
									{artistEmojis && artistEmojis.map((emoji) => String.fromCodePoint(emoji)).join('')}
								</h6>
							)}
						</div>
						{/* right */}
						<div className={`${displayRatings ? 'flex float-right' : 'hidden'}`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="w-5 h-5"
							>
								<path
									fillRule="evenodd"
									d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
									clipRule="evenodd"
								/>
							</svg>
							<p className="mb-2 font-normal text-gray-700 ml-auto">
								{displayRatings ? ratingToShow : ''}
							</p>
						</div>
					</div>
				)}
				{/* second row */}
				{showDateArtistLocation && (
					<div className="flex justify-between">
						{item.entity === 'Jam' && (
							<h6 className="mb-2 text-xl tracking-tight text-gray-900">
								{item.artists.artist}{' '}
								{artistEmojis && artistEmojis.map((emoji) => String.fromCodePoint(emoji)).join('')}
							</h6>
						)}
						{item.entity !== 'Jam' && (
							<p className="mb-2 font-normal text-gray-700 mr-auto">{item.location}</p>
						)}
						<p className={`${!displayRatings || item.num_ratings === 0 ? 'hidden' : 'flex float-right'}`}>
							{item.num_ratings} rating{item.num_ratings != 1 ? 's' : ''}
						</p>
					</div>
				)}
				{/* third row */}
				{showDateArtistLocation && item.entity === 'Jam' && (
					<p className="mb-2 font-normal text-gray-700 mr-auto">{item.location}</p>
				)}
				{sortedSounds && <p className="font-normal text-gray-700 max-w-80">{sortedSounds.join(', ')}</p>}
				{sortedPlatforms && <p className="font-normal text-gray-700">{sortedPlatforms.join(', ')}</p>}
				{showCurateOptions && !newParsedSelectedAttributes.length > 0 && <br />}
				{showCurateOptions && (
					<AttributePicker
						attributes={attributes}
						cantUncheckDefaults={true}
						defaults={stringifiedSelectedAttributes}
						handleAttributesChange={handleAttributesChange}
						title="add sounds, where to listen"
						parsedSelectedAttributes={parsedSelectedAttributes}
						previousAttributes={previousAttributes}
						previewAboveLabel={true}
						newAttributes={newParsedSelectedAttributes}
						disableButton={!newParsedSelectedAttributes?.length > 0}
						entityType={item.entity}
						entityId={item.id}
					/>
				)}
				{item?.name && <p className="font-normal text-gray-700">{`added by ${item.name} (${item?.points})`}</p>}
				{comments && comments.length > 0 && (
					<button
						className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 my-2"
						onClick={() => handleCommentClick()}
					>
						{showComments ? 'Hide Comments' : 'Show Comments'}
					</button>
				)}
				{showComments &&
					comments.map((comment, index) => {
						return (
							<div className="flex flex-col bg-white rounded-lg shadow-md p-6 my-4" key={index}>
								<p className="mb-3 font-medium text-gray-700">{comment.comment}</p>
								<p className="text-gray-600">
									{comment.name} - {comment.rating}
								</p>
							</div>
						)
					})}
				{showComments && comments.length > 2 && (
					//hide comments
					<button
						className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 my-2"
						onClick={() => handleCommentClick()}
					>
						Hide Comments
					</button>
				)}
			</div>
			<div className="flex justify-between mt-2">
				{item?.listen_link ? (
					<SoundIcon height="h-10" width="w-10" strokeWidth="2" onClick={handleListenClick} />
				) : (
					<SoundIcon height="h-10" width="w-10" strokeWidth="2" color="#CCC6C6" />
				)}
				{showCurateOptions ? (
					<PlusCircleSolid height="h-10" width="w-10" onClick={handlePlusClick} />
				) : (
					<PlusCircleIcon height="h-10" width="w-10" strokeWidth="2" onClick={handlePlusClick} />
				)}
				{profile && (
					<fetcher.Form method="post" action="/resources/ratings">
						<input type="hidden" name="entity_id" value={item?.id} />
						<input type="hidden" name="entity_type" value={item.entity} />
						<input type="hidden" name="is_favorite" value={item?.userRating?.favorite} />

						<button type="submit" name="_action" value="favorite" className="mondegreen my-auto">
							<div className="flex items-center align-middle">
								{item?.userRating?.favorite ? (
									<HeartSolid height="h-10" width="w-10" strokeWidth="2" className="my-auto" />
								) : (
									<HeartOutline height="h-10" width="w-10" strokeWidth="2" className="my-auto" />
								)}
							</div>
						</button>
					</fetcher.Form>
				)}
				<fetcher.Form method="post" action="/resources/ratings">
					<input type="hidden" name="entity_id" value={item?.id} />
					<input type="hidden" name="entity_type" value={item.entity} />
					<button type="submit" name="_action" value="like">
						<div className="flex text-right items-center align-middle mondegreen">
							{item?.userRating?.likes > 0 ? (
								<ThumbSolidIcon height="h-10" width="w-10" strokeWidth="2" />
							) : (
								<ThumbUpOutline height="h-10" width="w-10" strokeWidth="2" />
							)}
							{likesToShow}
						</div>
					</button>
				</fetcher.Form>
			</div>
			{showCurateOptions && (
				<div className="w-100">
					<RateComment entity={item} profile={profile} entityType={item.entity} />
				</div>
			)}
		</div>
	)
}
