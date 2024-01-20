import { db } from '../../database'
import type { profiles } from '@prisma/client'

export async function addPoints(data: { user_id: string; points: number }) {
	const { user_id, points } = data

	const updatedUser = await db.profiles.update({
		where: {
			id: user_id,
		},
		data: {
			points: {
				increment: points,
			},
		},
	})

	return { updatedUser }
}

export async function createProfile(user_id: string, name: string) {
	const newProfile = await db.profiles.create({
		data: {
			id: user_id,
			name,
		},
	})
	return newProfile
}

export async function getProfile(user_id: string) {
	const profile = await db.profiles.findUnique({
		where: {
			id: 'd154fade-4a07-470d-beb5-d4098c945111',
		},
	})
	return profile
}
