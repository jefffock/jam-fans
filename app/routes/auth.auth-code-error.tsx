import { Link } from '@remix-run/react'

export default function AuthCodeError() {
	return (
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h1>Auth Code Error</h1>
			<Link to="/" style={{ fontSize: '20px', textDecoration: 'none' }}>
				Go to Homepage
			</Link>
		</div>
	)
}
