import React, { useState } from 'react'
import { Form } from '@remix-run/react'

export default function ArtistSuggestionModal({ isOpen, onClose }) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
			<div className="bg-white p-5 rounded">
				<div>
					<label htmlFor="artistName" className="block text-sm font-medium text-gray-700">
						band name
					</label>
					<input
						type="text"
						name="artist-name"
						id="artist-name"
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div className="mt-4">
					<button
						type="submit"
						name="_action"
						value="add-artist"
						className="bg-blue-500 text-white rounded p-2"
					>
						add
					</button>
					<button type="button" onClick={onClose} className="ml-2 bg-gray-500 text-white rounded p-2">
						cancel
					</button>
				</div>
			</div>
		</div>
	)
}
