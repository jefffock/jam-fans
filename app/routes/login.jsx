import { Link, useLoaderData, useNavigate } from '@remix-run/react'
import { createServerClient, parse, serialize, createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import { json } from '@remix-run/node'
import SuccessAlert from '../components/alerts/successAlert'

export const loader = async ({ request }) => {
	return {
		env: {
			SUPABASE_URL: process.env.SUPABASE_URL,
			SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
		},
	}
}

export default function SignIn() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)
	const [magicLinkSuccessText, setMagicLinkSuccessText] = useState('')
	const [passwordResetSuccessText, setPasswordResetSuccessText] = useState('')
	const navigate = useNavigate()
	const { env } = useLoaderData()
	const supabase = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

	async function signInWithEmail(event) {
		setLoading(true)
		setErrorMessage(null)

		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		})
		if (error) {
			console.log('error', error)
			setLoading(false)
			setErrorMessage(error.message)
		} else {
			setLoading(false)
			navigate('/')
		}
	}

	function handleEmailChange(e) {
		setEmail(e.target.value)
	}

	function handlePasswordChange(e) {
		setPassword(e.target.value)
	}

	async function signInWithOtp(event) {
		const { data, error } = await supabase.auth.signInWithOtp({
			email: email,
		})
		if (error) {
			console.error('Sign in error :( contact hi@jam.fans or @jeffphox on Twitter for support', error)
		} else {
			setMagicLinkSuccessText(`Success! Check ${email} for your magic link!`)
		}
	}

	async function signInWithGoogle() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
		})
		if (error) {
			console.error('sign in with google error', error)
		} else {
		}
	}

	async function handlePasswordReset() {
		if (!email) return alert('Please enter your email address.')
		const { data, error } = await supabase.auth.resetPasswordForEmail(email)
		if (error) {
			console.error('error', error)
		} else {
			setPasswordResetSuccessText(`Success! Check ${email} for your password reset link!`)
		}
	}

	return (
		<div className="flex min-h-full flex-col justify-center pt-12 pb-20 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<img className="mx-auto h-12 w-auto" src="/icon-circle.png" alt="Your Company" />
				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
					Sign in to rate jams
				</h2>
				<div className="mt-2 flex justify-center text-sm text-gray-600">
					<p className="font-medium text-cyan-600 hover:text-cyan-500 inline align-middle h-min">
						Or{' '}
						<Link to="/join" className="underline">
							make an account
						</Link>
					</p>
				</div>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email address
						</label>
						<div className="mt-1">
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
								onChange={handleEmailChange}
							/>
							<p className="text-sm">We'll never share your email.</p>
						</div>
					</div>
					<div>
						<button
							type="button"
							className="flex w-full justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 mt-4"
							name="_action"
							value="magic-link"
							onClick={signInWithOtp}
						>
							Sign up/in with a magic link
						</button>
						<p className="text-sm mb-4">We'll send you a link to sign in. No password needed!</p>
					</div>
					{magicLinkSuccessText && (
						<SuccessAlert title={'Email sent!'} description={'Check your email to sign in'} />
					)}

					<div>
						<p className="text-sm">Or:</p>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password (if you have one)
						</label>
						<div className="mt-1">
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								onChange={handlePasswordChange}
								className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md border py-2 px-4 text-sm font-medium bg-white text-gray-500 shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 my-4 hover:text-white"
							name="_action"
							value="email-password"
							onClick={() => signInWithEmail()}
						>
							Sign in with email and password
						</button>
					</div>
					<div className="flex flex-row-reverse">
						<div className="text-sm" onClick={handlePasswordReset}>
							<p className="font-medium text-cyan-600 hover:text-cyan-500 hover:cursor-pointer">
								Forgot your password?
							</p>
						</div>
					</div>
					{passwordResetSuccessText && (
						<SuccessAlert title={'Email sent!'} description={'Check your email to reset your password'} />
					)}

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-gray-500">Or sign in with</span>
							</div>
						</div>
						<div className="flex justify-center my-4 google">
							<button
								type="button"
								className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
								onClick={signInWithGoogle}
							>
								<img src="/google/lightNormal.svg" alt="Google"></img>
								<p>&nbsp;&nbsp;Google</p>
							</button>
						</div>
					</div>
					<div className="flex justify-center text-sm text-gray-700">
						<div className="flex max-w-60 py-4 mx-auto">
							<Link className="underline" href="/privacy">
								Privacy Policy
							</Link>
							<p>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</p>
							<Link className="underline" href="/terms">
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
