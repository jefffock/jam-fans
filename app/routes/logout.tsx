import { destroyAuthSession } from '~/modules/auth'

export const loader = async ({ request }) => {
	return destroyAuthSession(request)
}

export const action = async ({ request }) => {
	return destroyAuthSession(request)
}
