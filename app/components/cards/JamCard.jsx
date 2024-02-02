import { Link, useFetcher, Form } from '@remix-run/react'
import { useState, forwardRef } from 'react'
import Button from '../Button'
import LikeHeartRateComment from '../LikeHeartRateComment'
import ThumbIcon from 'app/assets/icons/thumb-up-outline.svg'
import PlusCircleIcon from '../icons/plus-circle'
import ThumbUpOutline from '../icons/thumb-up-outline'
import SoundIcon from '../icons/SoundIcon'
import ThumbSolidIcon from '../icons/ThumbSolidIcon'

const JamCard = forwardRef((props, ref) => {
	const {
		jam,
		user,
		showRatings,
		setShowIframe,
		setIframeUrl,
		showDateArtistLocation = true,
		onlyShowVerifiedRatings,
	} = props
	const verifiedRating = (jam.avg_rating / 2).toFixed(3)?.replace(/\.?0+$/, '')
	const unverifiedRating = (jam.avg_unverified_rating / 2).toFixed(3)?.replace(/\.?0+$/, '')
	const [showComments, setShowComments] = useState(false)
	const [showCurateOptions, setShowCurateOptions] = useState(false)
	const fetcher = useFetcher()

	function handleListenClick() {
		setIframeUrl(jam?.listen_link)
		setShowIframe(true)
	}
	const comments = jam?.ratings
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
		console.log('plus clicked')
		setShowCurateOptions(!showCurateOptions)
	}

	let songEmojis = jam.song_emoji?.split(',')
	let artistEmojis = jam.artist_emoji?.split(',')

	const link = `/add/jam?jamid=${jam?.id}&song=${jam.song_name}&artist=${jam.artist}&location=${jam.location}&date=${jam.date}`
	return (
		<div
			className={`p-6 bg-gray-50 border border-gray-200 rounded-lg shadow w-112 max-w-95p my-6 mx-auto flex flex-col justify-between h-90 ${ref ? 'measure-div' : ''}`}
			ref={ref || null}
			tabIndex={ref ? '1' : ''}
		>
			<div className="overflow-y-auto">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
					{jam.song_name} {songEmojis && songEmojis.map((emoji) => String.fromCodePoint(emoji)).join('')}
				</h5>
				{/* first row */}
				{showDateArtistLocation && (
					<div className="flex justify-between">
						{/* left */}
						<div className="flex items-center space-x-4">
							{jam.show_id && (
								<Link
									to={`/shows/${jam.show_id}`}
									className="mb-2 text-xl tracking-tight text-gray-900 underline"
								>
									{jam.date}
								</Link>
							)}
							{fetcher?.state !== 'idle' && (
								<p className="mb-2 text-xl tracking-tight text-gray-900">{`adding show...`}</p>
							)}
							{!jam.show_id && fetcher?.state === 'idle' && (
								<fetcher.Form method="post" action="?index" preventScrollReset={true}>
									<input type="hidden" name="artist_id" value={jam.artist_id} />
									<input type="hidden" name="date_text" value={jam.date} />
									<input type="hidden" name="day" value={jam?.date?.slice(8, 10)} />
									<input type="hidden" name="month" value={jam?.date?.slice(5, 7)} />
									<input type="hidden" name="year" value={jam?.date?.slice(0, 4)} />
									<input type="hidden" name="location" value={jam.location} />
									<div className="flex justify-items-start gap-8 align-middle">
										<p className="mb-2 text-xl tracking-tight text-gray-900">{jam.date}</p>
										<Button text={'add show'} type={'submit'} name={'_action'} value={'add-show'} />
									</div>
								</fetcher.Form>
							)}
						</div>
						{/* right */}
						<div className={`${showRatings ? 'flex float-right' : 'hidden'}`}>
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
							<p className="mb-2 font-normal text-gray-700 ml-auto">{showRatings ? ratingToShow : ''}</p>
						</div>
					</div>
				)}
				{/* second row */}
				{showDateArtistLocation && (
					<div className="flex justify-between">
						<h6 className="mb-2 text-xl tracking-tight text-gray-900">
							{jam.artist}{' '}
							{artistEmojis && artistEmojis.map((emoji) => String.fromCodePoint(emoji)).join('')}
						</h6>
						<p className={`${!showRatings || jam.num_ratings === 0 ? 'hidden' : 'flex float-right'}`}>
							{jam.num_ratings} fan{jam.num_ratings != 1 ? 's' : ''}
						</p>
					</div>
				)}
				{/* third row */}
				{showDateArtistLocation && <p className="mb-2 font-normal text-gray-700 mr-auto">{jam.location}</p>}
				{jam?.sounds && <p className="mb-2 font-normal text-gray-700">{jam?.sounds.join(', ')}</p>}
				{jam?.name && <p className="font-normal text-gray-700">{`added by ${jam.name} (${jam?.points})`}</p>}
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
			<div className="flex justify-between items-center">
				<SoundIcon height="h-10" width="w-10" strokeWidth="2" />
				<PlusCircleIcon height="h-10" width="w-10" strokeWidth="2" onClick={handlePlusClick} />
				<div className="flex text-right items-center mondegreen">
					<fetcher.Form
						method="post"
						action="/resources/ratings"
						name="_action"
						value="like"
						// preventScrollReset={true}
					>
						<input type="hidden" name="entity_id" value={jam?.id} />
						<input type="hidden" name="entity_type" value="Jam" />
						<input type="hidden" name="user_id" value={user?.id} />
						<input type="hidden" name="like" value={true} />
						<button type="submit" name="_action" value="like">
							{jam?.userRating?.likes > 0 ? (
								<ThumbSolidIcon height="h-10" width="w-10" strokeWidth="2" />
							) : (
								<ThumbUpOutline height="h-10" width="w-10" strokeWidth="2" />
							)}
						</button>
					</fetcher.Form>
					{jam?.likes > 0 ? `${jam?.likes}` : ''}
				</div>
			</div>
			{showCurateOptions && <LikeHeartRateComment entity={jam} profile={user} entityType="Jam" />}
		</div>
	)
})

export default JamCard
