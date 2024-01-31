import { PrismaClient, Prisma } from '@prisma/client'
import { createClient } from 'redis'
import { NODE_ENV } from '../utils/env'
export type {
	users,
	add_link,
	artists,
	helpful_votes_ideas,
	helpful_votes_ratings,
	ideas,
	issues,
	jams_lists,
	lists,
	profiles,
	ratings,
	sets,
	shows,
	songs,
	sounds,
	update_tags,
	versions,
} from '@prisma/client'

const redis = createClient()

redis.on('error', (err) => console.log('Redis Client Error', err))

let db: PrismaClient

declare global {
	// eslint-disable-next-line no-var
	var __db__: PrismaClient
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production, we'll have a single connection to the DB.
if (NODE_ENV === 'production') {
	db = new PrismaClient()
} else {
	if (!global.__db__) {
		global.__db__ = new PrismaClient()
	}
	db = global.__db__
	db.$connect()
	console.log('Connected to DB')
}

export { db, Prisma, redis }
