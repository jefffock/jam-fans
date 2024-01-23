import { getAuthSession, requireAuthSession } from '~/modules/auth'
import { getProfile } from '~/modules/profile/service.server'
import { json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { useState, useEffect } from 'react'

export const loader = async ({ request }) => {
	const authSession = await getAuthSession(request)

	let profile = null
	if (authSession) {
		profile = await getProfile(authSession.userId)
	}
	// try {
	// 	const authSession = await getAuthSession(request)
	// 	if (authSession) {
	// 		profile = await getProfile(authSession.userId)
	// 	}
	// 	console.log('authSession in account loader', authSession)
	// 	console.log('authSession account', authSession)
	// 	// const profile = await getProfile(authSession?.userId)
	// 	console.log('profile in account loader', profile)
	// } catch (error) {
	// 	console.log('error in account loader', error)
	// 	return json({ error })
	// }
	return json({ profile })
}

export default function Account({ profile }) {
	console.log('profile in account', profile)
	const [userProfile, setUserProfile] = useState(profile)

	useEffect(() => {
		setUserProfile(profile)
	})

	return (
		<>
			<h1>Account</h1>
			<p>{userProfile?.name}</p>
			<Form method="post" action="/logout">
				<button type="submit">Logout</button>
			</Form>
		</>
	)
}
