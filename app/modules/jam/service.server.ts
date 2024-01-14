import { db } from '~/database'
import type { add_link, profiles } from '@prisma/client'

export async function addJam(data: {
	date: string
	artist: string
	song_id: number
	avg_rating?: number
	location?: string
	submitter_name?: string
	user_id?: string
	listen_link?: string
	song_name?: string
	num_ratings?: number
	song_submitter_name?: string
	sounds?: string[]
}) {
	const newVersion = await db.versions.create({
		data,
	})
	return newVersion
}

export async function getJam(data: { version_id: number }) {
	const { version_id } = data

	const version = await db.versions.findUnique({
		where: {
			id: version_id,
		},
	})

	return version
}

export async function rateJam(data: { profile_id: string; version_id: number; rating?: number; comment?: string }) {
	const { profile_id, version_id, rating, comment } = data

	const newRating = await db.ratings.create({
		data: {
			profile_id,
			version_id,
			rating,
			comment,
		},
	})

	const updatedVersion = await db.versions.update({
		where: {
			id: version_id,
		},
		data: {
			avg_rating: {
				increment: rating,
			},
			num_ratings: {
				increment: 1,
			},
		},
	})

	// Return both newRating and updatedVersion if needed
	return { newRating, updatedVersion }
}

export async function addLinkToJam(data: { username: string; link: string; version_id: number }) {
	const { username, link, version_id } = data

	const newLink = await db.add_link.create({
		data: {
			username,
			link,
			version_id,
		},
	})

	const updatedVersion = await db.versions.update({
		where: {
			id: version_id,
		},
		data: {
			listen_link: link,
		},
	})

	return { newLink, updatedVersion }
}

export const addSoundsToJam = async (data: { username: string; sounds: string[]; version_id: number }) => {
	const { username, sounds, version_id } = data

	const newSounds = await db.update_tags.create({
		data: {
			username,
			tags_added: sounds.join(','),
			version_id,
		},
	})

	const updatedVersion = await db.versions.update({
		where: {
			id: version_id,
		},
		data: {
			sounds,
		},
	})

	return { newSounds, updatedVersion }
}

export async function getJamsByShow(data: { show_id: number }) {
	const { show_id } = data

	const versions = await db.versions.findMany({
		where: {
			show_id,
		},
	})

	return versions
}
