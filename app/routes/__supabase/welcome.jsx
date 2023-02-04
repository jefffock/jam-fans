import { Form, useLoaderData, useNavigate, useOutletContext, Link } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { json, redirect } from '@remix-run/node';
import { useState } from 'react';
import SuccessAlert from '../../components/alerts/successAlert';

export const loader = async ({ request, params }) => {
  const response = new Response();
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	const {
		data: { user },
	} = await supabaseClient.auth.getUser();
	let profile;
	if (user && user?.id && user != null) {
		const { data } = await supabaseClient
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.single();
		profile = data;
	}
  if (profile) {
    return redirect('/');
  }
  return json({ user, profile });
}

export default function Welcome() {
  const { user, profile } = useLoaderData()
  const navigate = useNavigate()
  const { supabase, session } = useOutletContext();
  console.log('user', user, 'profile', profile)
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {  
    e.preventDefault()
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: user?.id,
          name: username,
        },
      ]);
      console.log('data', data, 'error', error)
    if (error) {
      console.error(error)
    } else {
      setSuccess(true)
    }
  }

	return (
		<div className='flex flex-col max-w-xs justify-center mx-auto text-center my-20'>
			<img
				src='/icon-circle.png'
				className='mx-auto h-12 my-4 w-auto'
				alt='Jam Fans'
			/>
			<p className='my-4'>
				Choose a name to start rating, commenting, and adding links! What shall
				ye go by &apos;round these parts?
				<br />
			</p>
			<div className='my-4'>
				<label
					htmlFor='username'
					className='block text-sm font-medium text-gray-700 text-left'
				>
					Username
				</label>
				<div className='mt-1'>
					<input
						type='username'
						name='username'
						id='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
						className='block w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-2'
						placeholder=''
					/>
				</div>
        {success &&
        <>
          <SuccessAlert title={'Success!'} description={'Your profile has been created. Thank you for helping the music you love get into more ears!'} />
          <Link className='underline' to='/add/jam'>Add or Rate Jams</Link>
        </>
        }
        {!success &&
				<button
					type='button'
					className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 my-4'
          onClick={handleSubmit}
          disable={!username}
				>
					Choose this name
				</button>
        }
			</div>
		</div>
	);
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