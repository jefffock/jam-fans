import { Link } from '@remix-run/react'
import { useState } from 'react'

export default function JamCard({ jam, sounds, user, profile, setShowIframe, setIframeUrl, showRatings }) {
	const ratingToShow = (jam.avg_rating / 2).toFixed(3)?.replace(/\.?0+$/, '')
	const [showComments, setShowComments] = useState(false)

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

	let songEmojis = jam.song_emoji?.split(',')
	let artistEmojis = jam.artist_emoji?.split(',')

	const link = `/add/jam?jamid=${jam?.id}&song=${jam.song_name}&artist=${jam.artist}&location=${jam.location}&date=${jam.date}`
	return (
		<div
			className={`p-6 bg-gray-50 border border-gray-200 rounded-lg shadow w-112 m-6 flex flex-col justify-between h-80`}
		>
			<div>
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
					{jam.song_name} {songEmojis && songEmojis.map((emoji) => String.fromCodePoint(emoji)).join('')}
				</h5>
				{/* first row */}
				<div className="flex justify-between">
					<h5 className="mb-2 text-xl tracking-tight text-gray-900">{jam.date}</h5>
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
						<p className="mb-3 font-normal text-gray-700 ml-auto">{showRatings ? ratingToShow : ''}</p>
					</div>
				</div>
				{/* second row */}
				<div className="flex justify-between">
					<h6 className="mb-2 text-xl tracking-tight text-gray-900">
						{jam.artist} {artistEmojis && artistEmojis.map((emoji) => String.fromCodePoint(emoji)).join('')}
					</h6>
					<p className={`${!showRatings || jam.num_ratings === 0 ? 'hidden' : 'flex float-right'}`}>
						{jam.num_ratings} fan{jam.num_ratings != 1 ? 's' : ''}
					</p>
				</div>
				{/* third row */}
				<p className="mb-3 font-normal text-gray-700 mr-auto">{jam.location}</p>
				{jam?.sounds && <p className="mb-3 font-normal text-gray-700">{jam?.sounds.join(', ')}</p>}
				{jam?.name && <p className="font-normal text-gray-700">{`Added by ${jam.name} (${jam?.points})`}</p>}
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
			<div className="flex justify-between mt-3">
				{!user && (
					<Link
						to={link}
						className="underline self-center align-middle transition-all ease-in hover:scale-125 duration-500 hover:duration-20000 hover:pl-2 color text-cyan-500 hover:text-cyan-600"
					>
						Add Sounds
					</Link>
				)}
				{user && (
					<Link to={link} className="underline self-center align-middle text-cyan-500 hover:text-cyan-600">
						{jam.listen_link ? 'Curate' : 'Curate and/or add a link'}
					</Link>
				)}
				<div className="transition-all ease-in hover:scale-125 duration-500 hover:duration-20000">
					{jam?.listen_link && (
						<button
							onClick={() => handleListenClick()}
							className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 focus:ring-4 focus:outline-none focus:ring-cyan-50 motion-reduce:transition-none motion-reduce:hover:transform-none"
						>
							Listen
							<svg
								aria-hidden="true"
								className="w-4 h-4 ml-2 -mr-1"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clipRule="evenodd"
								></path>
							</svg>
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
