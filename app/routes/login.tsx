import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { parse } from '@supabase/ssr'
import type { AuthSession } from '~/modules/auth'
import { createAuthSession, getAuthSession, signInWithEmail } from '~/modules/auth'

export async function loader({ request }: LoaderFunctionArgs) {
	const authSession = await getAuthSession(request)
	const cookies = parse(request.headers.get('Cookie') ?? '')
	const headers = new Headers()

	console.log('authSession in login', authSession)

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

	const formData = await request.formData()
	const email = formData.get('email')
	const password = formData.get('password')
	if (!email || !password) return json({ error: 'Email and password are required' }, { status: 400 })
	console.log('email', email)
	console.log('password', password)
	const session: AuthSession | null = await signInWithEmail(email.toString(), password.toString())
	console.log('session', session)
	if (!session) return json({ error: 'Invalid email or password' }, { status: 400 })
	if (session) {
		return await createAuthSession({ request, authSession: session, redirectTo: '/login-success' })
	}
	//if no session redirect to login
	//if session and no cookie, set cookie
	//if session and cookie, return session

	return json({ session }, { headers })
}

export default function Login() {
	const actionData = useActionData()

	return (
		<div className="min-h-screen flex flex-col items-center justify-start bg-gray-100">
			<div className="text-center my-8 mx-4">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">login to:</h2>
				<p className="text-lg text-gray-700">keep track of your favorites</p>
				<p className="text-lg text-gray-700">rate stuff</p>
				<p className="text-lg text-gray-700">comment on stuff</p>
			</div>
			<div className="m-2">
				<form method="post" className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							required
							className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					{actionData?.error && <p className="text-red-500 text-xs italic">{actionData.error}</p>}
					<button
						type="submit"
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mondegreen hover:bg-custom-pink"
					>
						login
					</button>
				</form>
			</div>
			<p className="text-sm text-gray-500">be kind</p>
			<p className="text-sm text-gray-500">have fun</p>
			<p className="text-sm text-gray-500">see live music</p>
			<p className="text-sm text-gray-500 mt-10">it&apos;s just, like, our opinions, man</p>
		</div>
	)
}
