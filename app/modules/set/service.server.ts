export async function getSets({ db }) {
	const sets = await db.sets.findMany()
	return sets
}

export async function getSetsCount({ db }): Promise<number> {
	const count = await db.sets.count()
	return count
}
