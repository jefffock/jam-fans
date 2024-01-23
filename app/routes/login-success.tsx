import { Link } from '@remix-run/react'

export default function LoginSuccess() {
	return (
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h1>Login Successful</h1>
			<p>Welcome back! Your login was successful.</p>
			<Link to="/" style={{ fontSize: '20px', textDecoration: 'none' }}>
				Go to Homepage
			</Link>
		</div>
	)
}
