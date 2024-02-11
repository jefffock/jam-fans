import { Link, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'

export default function LoginSuccess() {
	const navigate = useNavigate()

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate('/')
		}, 5000)

		return () => clearTimeout(timer)
	}, [navigate])

	return (
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h1>login successful</h1>
			<p>you will be redirected to the homepage in 5 seconds. if not, please click the link below</p>{' '}
			<Link to="/" style={{ fontSize: '20px', textDecoration: 'underline' }}>
				click here to start jamming
			</Link>
		</div>
	)
}
