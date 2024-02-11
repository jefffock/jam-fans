import { getSupabaseAdmin } from '~/integrations/supabase'
import { SERVER_URL } from '~/utils/env'

import { mapAuthSession } from './mappers'
import type { AuthSession } from './types'

// async function signInWithOtp(event) {
// 	const { data, error } = await supabase.auth.signInWithOtp({
// 		email: email,
// 	})
// 	if (error) {
// 		console.error('Sign in error :( contact hi@jam.fans or @jeffphox on Twitter for support', error)
// 	} else {
// 		setMagicLinkSuccessText(`Success! Check ${email} for your magic link!`)
// 	}
// }

export async function signInWithGoogle() {
	console.log('in signInWithGoogle')
	const { data, error } = await getSupabaseAdmin().auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: `http://jam.fans/auth/callback`,
		},
	})
	if (error) {
		console.error('sign in with google error', error)
	} else {
		console.log('data google', data)
		return data
	}
}

// async function handlePasswordReset() {
// 	if (!email) return alert('Please enter your email address.')
// 	const { data, error } = await supabase.auth.resetPasswordForEmail(email)
// 	if (error) {
// 		console.error('error', error)
// 	} else {
// 		setPasswordResetSuccessText(`Success! Check ${email} for your password reset link!`)
// 	}
// }

export async function createEmailAuthAccount(email: string, password: string) {
	const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
		email,
		password,
		email_confirm: true, // FIXME: demo purpose, assert that email is confirmed. For production, check email confirmation
	})

	if (!data.user || error) return null

	return data.user
}

export async function signInWithEmail(email: string, password: string) {
	console.log('signInWithEmail', email, password)
	const { data, error } = await getSupabaseAdmin().auth.signInWithPassword({
		email,
		password,
	})
	console.log('data signInWithEmail', data)
	console.log('error signInWithEmail', error)

	if (!data.session || error) return null

	return mapAuthSession(data.session)
}

export async function sendMagicLink(email: string) {
	console.log('in sendMagicLink', email)
	console.log('SERVER_URL', SERVER_URL)
	return getSupabaseAdmin().auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: `${SERVER_URL}/oauth/callback`,
		},
	})
}

export async function sendResetPasswordLink(email: string) {
	return getSupabaseAdmin().auth.resetPasswordForEmail(email, {
		redirectTo: `${SERVER_URL}/reset-password`,
	})
}

export async function updateAccountPassword(id: string, password: string) {
	const { data, error } = await getSupabaseAdmin().auth.admin.updateUserById(id, { password })

	if (!data.user || error) return null

	return data.user
}

export async function deleteAuthAccount(userId: string) {
	const { error } = await getSupabaseAdmin().auth.admin.deleteUser(userId)

	if (error) return null

	return true
}

export async function getAuthAccountByAccessToken(accessToken: string) {
	const { data, error } = await getSupabaseAdmin().auth.getUser(accessToken)

	if (!data.user || error) return null

	return data.user
}

export async function refreshAccessToken(refreshToken?: string): Promise<AuthSession | null> {
	if (!refreshToken) return null

	const { data, error } = await getSupabaseAdmin().auth.refreshSession({
		refresh_token: refreshToken,
	})

	if (!data.session || error) return null

	return mapAuthSession(data.session)
}

export async function verifyAuthSession(authSession: AuthSession) {
	const authAccount = await getAuthAccountByAccessToken(authSession.accessToken)

	return Boolean(authAccount)
}
