import { json } from '@remix-run/node'
import { getJamsCount } from '../modules/jam/index.server'

export const loader = async ({ request }) => {
	const url = new URL(request.url)
	const queryParams = Object.fromEntries(url.searchParams.entries())

	const count = await getJamsCount(queryParams)

	return json({ count })
}
