import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { createBrowserClient, parse } from '@supabase/ssr'
import { supabaseClient } from '~/integrations/supabase'
import type { AuthSession } from '~/modules/auth'
import { createAuthSession, getAuthSession, signInWithEmail, sendMagicLink } from '~/modules/auth'

export async function loader({ request }: LoaderFunctionArgs) {
	const authSession = await getAuthSession(request)
	const cookies = parse(request.headers.get('Cookie') ?? '')
	const headers = new Headers()

	console.log('authSession in login', authSession)
	if (authSession && authSession.url) {
		console.log('redirection to authSession.url', authSession.url)
		return redirect(authSession.url)
	}

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
	return {
		env: {
			DB_URL: process.env.SUPABASE_URL,
			DB_ANON_KEY: process.env.SUPABASE_ANON_KEY,
		},
	}
}

export async function action({ request }: ActionFunctionArgs) {
	const cookies = parse(request.headers.get('Cookie') ?? '')
	const headers = new Headers()

	const formData = await request.formData()
	const email = formData.get('email')
	const password = formData.get('password')
	const _action = formData.get('_action')
	console.log('_action', _action)
	if (!email || !password) return json({ error: 'Email and password are required' }, { status: 400 })
	console.log('email', email)
	if (_action === 'magic-link') {
		console.log('magic link', email)
		const magicLinkSent = await sendMagicLink(email.toString())
		if (magicLinkSent) {
			console.log('magic link sent', magicLinkSent)
			return json({ magicLinkSuccessText: true })
		}
	}
	if (_action === 'email-password') {
		if (!email || !password) return json({ error: 'Email and password are required' }, { status: 400 })
		const session: AuthSession | null = await signInWithEmail(email.toString(), password.toString())
		console.log('session', session)
		if (!session) return json({ error: 'Invalid email or password' }, { status: 400 })
		if (session) {
			console.log('creating auth session')
			return await createAuthSession({ request, authSession: session, redirectTo: '/login-success' })
		}
	}

	if (_action === 'google') {
		console.log('google')
		// await signInWithGoogle()
		// if (session) {
		// 	return await createAuthSession({ request, authSession: session, redirectTo: '/login-success' })
		// }
		// await getSupabaseAdmin().auth.signInWithOAuth({
		// 	provider: 'google',
		// 	options: {
		// 		redirectTo: `http://jam.fans/auth/callback`,
		// 	},
		// })
		await supabaseClient.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `http://jam.fans/auth/callback`,
			},
		})
		return json({ googleSignupSuccess: true })
	}
	//if no session redirect to login
	//if session and no cookie, set cookie
	//if session and cookie, return session

	return json({ headers })
}

export default function Login() {
	const actionData = useActionData()
	const { env } = useLoaderData<typeof loader>()

	const supabase = createBrowserClient(env.DB_URL, env.DB_ANON_KEY || '')

	async function handleGoogleLogin() {
		console.log('google login')
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `http://jam.fans/auth/callback`,
			},
		})
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-start bg-gray-100">
			<div className="text-center my-6 mx-4">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">login to:</h2>
				<p className="text-lg text-gray-700">keep track of your favorites</p>
				<p className="text-lg text-gray-700">rate</p>
				<p className="text-lg text-gray-700">comment</p>
			</div>
			<div className="m-2">
				<Form method="post" className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							email
						</label>
						<input
							type="email"
							id="email"
							name="email"
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
							className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					{actionData?.error && <p className="text-red-500 text-xs italic">{actionData.error}</p>}
					<div className="flex justify-center">
						<button
							type="submit"
							name="_action"
							value="email-password"
							className="flex align-center justify-center items-center rounded-md px-4 py-2 text-sm font-medium transform hover:scale-105 transition duration-300 ease-in-out bg-gradient-to-br from-mondegreen to-custom-pink text-white shadow-lg hover:bg-gradient-to-br hover:from-mondgreen-darker hover:to-pink-darker active:scale-95 active:shadow-none min-w-32"
						>
							login
						</button>
					</div>
				</Form>
				<div className="mt-6">
					<div className="relative flex items-center">
						<div className="flex-grow border-t border-gray-300"></div>
						<span className="flex-shrink mx-4 text-sm text-gray-500">or sign in with</span>
						<div className="flex-grow border-t border-gray-300"></div>
					</div>
					<div className="mt-4 flex justify-center">
						<div
							onClick={handleGoogleLogin}
							// type="submit"
							// name="_action"
							// value="google"
							className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
							// disabled={false}
						>
							<img src="/google/lightNormal.svg" alt="Google" className="mr-2" />
							Google
						</div>
					</div>
				</div>
			</div>
			<p className="text-sm text-gray-500">be kind</p>
			<p className="text-sm text-gray-500">have fun</p>
			<p className="text-sm text-gray-500">see live music</p>
			<p className="text-sm text-gray-500 mt-10">it&apos;s just, like, our opinions, man</p>
		</div>
	)
}
