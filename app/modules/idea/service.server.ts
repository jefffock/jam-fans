import { db } from '~/database'

export async function getIdeas() {
	const ideas = await db.ideas.findMany()
	return ideas
}
