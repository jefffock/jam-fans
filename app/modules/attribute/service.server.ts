import { db } from '../../database'

export async function getAttributes() {
	const sounds = await db.attributes.findMany({
		orderBy: {
			label: 'asc',
		},
	})
	return sounds
}

export async function getSoundsCount(): Promise<number> {
	const count = await db.attributes.count({
		where: {
			is_sound: true, // Filter to count only where sound is true
		},
	})
	return count
}
