import { json } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import type { AuthSession } from '@supabase/supabase-js'
import { useState } from 'react'
import Button from '~/components/Button'
import SuccessAlert from '~/components/alerts/successAlert'
import {
	createAuthSession,
	createEmailAuthAccount,
	sendMagicLink,
	signInWithEmail,
	signInWithGoogle,
} from '~/modules/auth'

// export async function loader() {
// 	return redirect('/')
// }

export async function action({ request }) {
	const formData = await request.formData()
	const email = formData.get('email')
	const password = formData.get('password')
	const _action = formData.get('_action')
	console.log('email', email)
	console.log('password', password)
	if (_action === 'magic-link') {
		console.log('magic link', email)
		const magicLinkSent = await sendMagicLink(email.toString())
		if (magicLinkSent) {
			console.log('magic link sent', magicLinkSent)
			return json({ magicLinkSuccessText: true })
		}
	}
	if (_action === 'email-password') {
		console.log('email password', email, password)
		const session: AuthSession = await createEmailAuthAccount(email.toString(), password.toString())
		if (session) {
			return await createAuthSession({ request, authSession: session, redirectTo: '/login-success' })
		}
		return json({ passwordSignupSuccess: true })
	}
	if (_action === 'google') {
		console.log('google')
		const session = await signInWithGoogle()
		if (session) {
			return await createAuthSession({ request, authSession: session, redirectTo: '/login-success' })
		}
	}
	const session = await signInWithEmail(email.toString(), password.toString())
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

export default function NewJoin() {
	const [magicLinkSuccessText, setMagicLinkSuccessText] = useState(false)
	const [passwordSignupSuccess, setPasswordSignupSuccess] = useState(false)
	const [passwordResetSuccessText, setPasswordResetSuccessText] = useState(false)

	const handlePasswordChange = (e) => {
		console.log('password', e.target.value)
	}

	const handlePasswordReset = async () => {
		const email = prompt('Enter your email address')
		if (email) {
			const passwordResetSent = await sendPasswordReset(email)
			if (passwordResetSent) {
				setPasswordResetSuccessText(true)
			}
		}
	}

	return (
		<div className="flex min-h-full flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<img className="mx-auto h-12 w-auto" src="/icon-circle.png" alt="Your Company" />
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					sign up to favorite, comment, and rate
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600 max-w">
					<a href="#" className="font-medium text-cyan-600 hover:text-cyan-500">
						or{' '}
						<Link to="/login" className="underline">
							sign in
						</Link>
					</a>
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-6 shadow sm:rounded-lg">
					<Form method="post">
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
							<p className="mt-2 text-sm text-gray-500">never shared</p>
						</div>

						<div className="mt-4">
							<Button
								type="submit"
								className="inline-flex items-center rounded-md px-4 py-2 m-2 text-sm font-medium leading-4 transform hover:scale-105 transition duration-300 ease-in-out bg-gradient-to-br from-mondegreen to-custom-pink text-white shadow-lg hover:bg-gradient-to-br hover:from-mondgreen-darker hover:to-pink-darker active:scale-95 active:shadow-none max-w-fit"
								name="_action"
								value="magic-link"
								disabled={false}
							>
								sign up with a magic link
							</Button>
							<p className="text-sm text-gray-500">
								sends a login link to your email. no password needed
							</p>
						</div>

						{magicLinkSuccessText && (
							<SuccessAlert title={'email sent'} description={'check your email to sign in'} />
						)}

						<div className="mt-16">
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								or, create a password (if you really want one)
							</label>
							<input
								type="password"
								id="password"
								name="password"
								className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							/>
						</div>

						{passwordSignupSuccess && (
							<SuccessAlert
								title={'Confirmation email sent!'}
								description={
									"Check your email to confirm you're you. If we didn't do this, some beautiful, passionate fans would make millions of fake accounts to manipulate the ratings. This only needs to be done once. Thanks!"
								}
							/>
						)}

						<div className="mt-4">
							<Button
								type="submit"
								className="w-full justify-center rounded-md border bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 hover:text-gray-900"
								name="_action"
								value="email-password"
								disabled={false}
							>
								sign up with email and password
							</Button>
						</div>

						<div className="flex justify-between mt-4">
							<p
								className="text-sm font-medium text-cyan-600 hover:text-cyan-500 hover:cursor-pointer"
								onClick={handlePasswordReset}
							>
								forgot your password?
							</p>
						</div>

						{passwordResetSuccessText && (
							<SuccessAlert
								title={'Email sent!'}
								description={'Check your email to reset your password'}
							/>
						)}

						<div className="mt-6">
							<div className="relative flex items-center">
								<div className="flex-grow border-t border-gray-300"></div>
								<span className="flex-shrink mx-4 text-sm text-gray-500">Or sign up with</span>
								<div className="flex-grow border-t border-gray-300"></div>
							</div>
							<div className="mt-4 flex justify-center">
								<Button
									type="submit"
									name="_action"
									value="google"
									className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
									disabled={true}
								>
									<img src="/google/lightNormal.svg" alt="Google" className="mr-2" />
									Google
								</Button>
							</div>
						</div>

						<div className="mt-6 flex justify-center">
							<Link to="/privacy" className="text-sm underline text-gray-700 hover:text-gray-900">
								privacy policy
							</Link>
							<span className="mx-2 text-sm text-gray-500">|</span>
							<Link to="/terms" className="text-sm underline text-gray-700 hover:text-gray-900">
								terms of service
							</Link>
						</div>
					</Form>
				</div>
			</div>
		</div>
	)
}
