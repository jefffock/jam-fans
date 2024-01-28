import { db } from '../../database'
import type { profiles } from '@prisma/client'
import { getAuthSession } from '../auth'

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
			id: user_id,
		},
	})
	return profile
}

export async function getProfileFromRequest(request) {
	const authSession = await getAuthSession(request)

	if (!authSession || !authSession.userId) {
		return null
	}

	return getProfile(authSession.userId)
}
