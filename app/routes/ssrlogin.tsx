import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node'
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { Form, useActionData } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { signInWithEmail, createAuthSession, getAuthSession } from '~/modules/auth'

export async function loader({ request }: LoaderFunctionArgs) {
	const authSession = await getAuthSession(request)
	const cookies = parse(request.headers.get('Cookie') ?? '')
	const headers = new Headers()

	console.log('authSession in ssrlogin', authSession)

	// const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
	// 	cookies: {
	// 		get(key) {
	// 			return cookies[key]
	// 		},
	// 		set(key, value, options) {
	// 			headers.append('Set-Cookie', serialize(key, value, options))
	// 		},
	// 		remove(key, options) {
	// 			headers.append('Set-Cookie', serialize(key, '', options))
	// 		},
	// 	},
	// })
	return new Response('...', {
		headers,
	})
}

export async function action({ request }: ActionFunctionArgs) {
	const cookies = parse(request.headers.get('Cookie') ?? '')
	const headers = new Headers()

	const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
		cookies: {
			get(key) {
				return cookies[key]
			},
			set(key, value, options) {
				headers.append('Set-Cookie', serialize(key, value, options))
			},
			remove(key, options) {
				headers.append('Set-Cookie', serialize(key, '', options))
			},
		},
	})
	const formData = await request.formData()
	const email = formData.get('email')
	const password = formData.get('password')
	if (!email || !password) return json({ error: 'Email and password are required' }, { status: 400 })
	console.log('email', email)
	console.log('password', password)
	const session: AuthSession | null = await signInWithEmail(email.toString(), password.toString())
	console.log('session', session)
	if (!session) return json({ error: 'Invalid email or password' }, { status: 400 })
	// return new Response(session, {
	// 	headers,
	// })
	//if session redirect to home
	if (session) {
		return await createAuthSession({ request, authSession: session, redirectTo: '/login-success' })
		// return redirect('/', {
		// 	headers: {
		// 		'Set-Cookie': serialize('supabaseSession', session.accessToken, {
		// 			path: '/',
		// 			maxAge: 60 * 60 * 24 * 30, // 30 days
		// 		}),
		// 	},
		// })
	}
	//if no session redirect to login
	//if session and no cookie, set cookie
	//if session and cookie, return session

	return json({ session }, { headers })
}

export default function Login() {
	const actionData = useActionData()

	return (
		<Form method="post">
			<div>
				<label htmlFor="email">Email:</label>
				<input type="email" id="email" name="email" required />
			</div>
			<div>
				<label htmlFor="password">Password:</label>
				<input type="password" id="password" name="password" required />
			</div>
			{actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}
			<button type="submit">Login</button>
		</Form>
	)
}
