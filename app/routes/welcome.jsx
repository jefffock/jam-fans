import { json, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import Button from '../components/Button'
import { createProfile, getProfileFromRequest } from '../modules/profile/index.server'

export const loader = async ({ request, params }) => {
	const profile = await getProfileFromRequest(request)
	console.log('profile in /welcome', profile)
	if (profile) {
		console.log('redirecting to /', profile)
		return redirect('/')
	}
	return json({ profile })
}

export const action = async ({ request }) => {
	const formData = await request.formData()
	const username = formData.get('username')

	const profile = await createProfile({ request, username })
	console.log('profile in /welcome action', profile)
	return redirect('/')
}

export default function Welcome() {
	return (
		<div className="flex flex-col max-w-xs justify-center mx-auto text-center my-20">
			<img src="/icon-circle.png" className="mx-auto h-12 my-4 w-auto" alt="Jam Fans" />
			<p className="my-4">
				choose a name to start rating, commenting, and favoriting
				<br />
			</p>
			<div className="my-4">
				<Form method="post">
					<label htmlFor="username" className="block text-sm font-medium text-gray-700 text-left">
						name
					</label>
					<div className="mt-1">
						<input
							type="username"
							name="username"
							id="username"
							className="block w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm h-10 px-2"
							placeholder=""
						/>
						<Button
							type="submit"
							className="inline-flex items-center rounded-md px-4 py-2 m-2 text-sm font-medium leading-4 transform hover:scale-105 transition duration-300 ease-in-out bg-gradient-to-br from-mondegreen to-custom-pink text-white shadow-lg hover:bg-gradient-to-br hover:from-mondgreen-darker hover:to-pink-darker active:scale-95 active:shadow-none"
						>
							choose this name
						</Button>
					</div>
				</Form>
				{/* {success && (
					<>
						<SuccessAlert
							title={'success!'}
							description={'your profile has been created. thank you for sharing the music you love!'}
						/>
						<Link className="underline" to="/">
							start jamming
						</Link>
					</>
				)} */}
			</div>
		</div>
	)
}

/*
const [username, setUsername] = useState('');
	const [usernameTaken, setUsernameTaken] = useState(false);
	const router = useRouter();
	//check if profile exists
	useEffect(() => {
		async function checkProfile(user) {
			const { data, error } = await supabase
				.from('profiles')
				.select('id')
				.eq('id', user.id);
			if (error) {
				console.error(error);
			}
			if (data.length > 0) {
				router.push('/');
			}
		}
		if (initialUser) {
			checkProfile(initialUser);
		}
		if (!initialUser) {
			const getUser = async () => {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				return user;
			};
			getUser().then((user) => {
				if (user) {
					checkProfile(user);
				} else {
					router.push('/join');
				}
			});
		}
	}, []);

	function handelUsernameChange(e) {
		setUsernameTaken(false);
		setUsername(e.target.value);
	}

	async function handleSubmit() {
		//check if username is taken
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			//check if user has a profile
      const id = user.id
			supabase.from('profiles').select('id').eq('id', user.id);
			supabase
				.from('profiles')
				.select('name')
				.eq('name', username)
				.then((res) => {
					if (res.data.length > 0) {
						setUsernameTaken(true);
					} else if (res.data.length === 0) {
						supabase
							.from('profiles')
							.insert([
								{
									id: id,
									name: username,
								},
							])
							.then(() => {
								router.push('/');
							});
					}
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			router.push('/join');
		}
	}

	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{
					bgcolor: 'white',
					minHeight: '100vh',
					maxWidth: '100vw',
					overflow: 'hidden',
				}}
			>
				<TopBar showButton={false} />
				<Box
					sx={{
						flexDirection: 'column',
						display: 'flex',
						alignItems: 'center',
					}}
					mx='0.25em'
					my='2em'
				>
					<Typography
						fontSize={22}
						my='2em'
					>
						Welcome to Jam Fans!
					</Typography>
					<Image
						alt='Nice Jammin Logo'
						src='/icon-circle.png'
						quality={100}
						priority
						width={75}
						height={75}
					/>
					<Typography
						fontSize={16}
						my='2em'
					>
						Choose a username to start contributing:
					</Typography>
					<TextField
						autoFocus={true}
						my='2em'
						id='name'
						label='Username'
						type='text'
						variant='standard'
						value={username}
						onChange={(e) => handelUsernameChange(e)}
					/>
					{usernameTaken && <Typography my='2em'>Username taken</Typography>}
					<Button
						sx={{
							my: '2em',
						}}
						onClick={() => handleSubmit()}
						disabled={usernameTaken}
					>
						Submit
					</Button>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
*/
