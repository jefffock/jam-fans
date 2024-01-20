import { useState, useEffect } from 'react'

export default function Hero() {
	return (
		<div className="flex flex-col items-center justify-center p-4 pb-6 bg-white text-cyan-600">
			<div className="max-w-4xl flex-col align-middle text-cyan-700 mt-6">
				<p className="text-xl mx-auto text-center text-mondegreen">discover and share</p>
				<p className="text-xl mx-auto text-center bg-lime">jams, sets, and shows</p>
				<p className="text-xl mx-auto text-center mb-8">with love and gratitude</p>
			</div>
		</div>
	)
}
