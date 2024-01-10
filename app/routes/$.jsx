import { Link, Outlet, useNavigate } from '@remix-run/react';
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import ArtistBar from '../components/ArtistBar';
import JamList from '../components/JamList';
import JamFilters from '../components/JamFilters';
import JamFiltersSlideout from '../components/JamFilters';
import { useState, useEffect } from 'react';
import FiltersButton from '../components/FiltersButton';
import JamsHome from '../components/JamsHome';
import Hero from '../components/Hero';
import TopNav from '~/components/TopNav';
import BottomNav from '~/components/BottomNav';

export const loader = async () => {
	console.log('in catchall $');
	return redirect('/jams');
	const response = new Response();
	const cookies = parse(request.headers.get('Cookie') ?? '')
  const headers = new Headers()

  const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    cookies: {
      get(key) {
        return cookies[key]
      },
      set(key, value, options) {
        headers.append('Set-Cookie', serialize(key, value, options))
      },
      remove(key, options) {
        headers.append('Set-Cookie', serialize(key, '', options))
      },
    },
  })
	//get url search param page
	const url = new URL(request.url);
	const searchParams = new URLSearchParams(url.search);
	const queryParams = Object.fromEntries(searchParams);
	const page = queryParams.page || 1;
	console.log('page', page);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	let profile;
	if (user && user?.id && user != null) {
		const { data } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.single();
		profile = data;
	}
	console.log('user', user);
	console.log('profile', profile);
	if (user && !profile) {
		console.log('redirecting to /welcome');
		return redirect('/welcome');
	}

	//get artists
	
	let { data: artists } = await supabase
		.from('artists')
		.select('nickname, emoji_code, url, artist')
		.order('name_for_order', { ascending: true });
	//get base versions
	// let { data: versions } = await supabase
	// 	.from('versions')
	//   .select('*')
	//   // .select('*,ratings(*), ')
	// 	.order('avg_rating', { ascending: false })
	// 	.order('num_ratings', { ascending: false })
	// 	.order('song_name', { ascending: true })
	// 	.limit(100);
	//get songs
	const { data: songs } = await supabase
		.from('songs')
		.select('song, artist')
		.order('song', { ascending: true });
	const { data: sounds } = await supabase
		.from('sounds')
		.select('label, text')
		.order('label', { ascending: true });
	const { data: profiles } = await supabase
		.from('profiles')
		.select('name, points')
		.order('points', { ascending: false });

	const startRange = page ? (page - 1) * 15 : 0;
	const endRange = page ? page * 15 : 15;
	const { data: jams } = await supabase
		.from('jams')
		.select('*')
		.order('avg_rating', { ascending: false })
		.order('num_ratings', { ascending: false })
		.order('song_name', { ascending: true })
		.order('id', { ascending: false })
		.range(startRange, endRange);

	artists = [
		{
			nickname: 'All Bands',
			emoji_code: '0x221E',
			url: null,
			artist: 'All Bands',
		},
		{ nickname: 'Phish', emoji_code: '0x1F41F', url: 'phish', artist: 'Phish' },
		{
			nickname: 'Grateful Dead',
			emoji_code: '0x1F480',
			url: 'grateful-dead',
			artist: 'Grateful Dead',
		},
	].concat(artists);
	//make title
	let title = '🔥 Jams by All Bands';
	let count = await supabase
		.from('versions')
		.select('*', { count: 'exact', head: true });
	count = count.count;
	return json(
		{
			artists,
			songs,
			sounds,
			count,
			user,
			profile,
			title,
			profiles,
			initialJams: jams,
		},
		{
			headers: response.headers,
		}
	);
};

export default function Index({ supabase, session }) {
	const { artists, songs, sounds, title, count, user, profile, initialJams } =
		useLoaderData();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false); //for slideout filters
	const [scrollPosition, setScrollPosition] = useState(0);
	const [clientHeight, setClientHeight] = useState(null);
	const [shouldFetch, setShouldFetch] = useState(true);
	const [height, setHeight] = useState(null);
	const [page, setPage] = useState(2);
	const fetcher = useFetcher();
	const [jams, setJams] = useState(initialJams);

	useEffect(() => {
		const scrollListener = () => {
			setClientHeight(window.innerHeight);
			setScrollPosition(window.scrollY);
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', scrollListener);
		}

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('scroll', scrollListener);
			}
		};
	}, []);

	useEffect(() => {
		if (!shouldFetch || !height) return;
		if (clientHeight + scrollPosition + 2500 < height) return;
		fetcher.load(`/?index&page=${page}`);
		setShouldFetch(false);
	}, [clientHeight, scrollPosition]);

	useEffect(() => {
		if (fetcher.data && fetcher.data.initialJams.length === 0) {
			setShouldFetch(false);
			return;
		}

		if (fetcher.data && fetcher.data.initialJams.length > 0) {
			setJams((jams) => [...jams, ...fetcher.data.initialJams]);
			setPage((page) => page + 1);
			setShouldFetch(true);
		}
	}, [fetcher.data]);

	return (
		 <div className='w-full h-full overflow-x-hidden'>
    {/* <Login supabase={supabase} session={session} />
      <Nav /> */}

      <TopNav supabase={supabase} session={session}/>
      {/* <Outlet context={{ supabase, session }} /> */}
	  <Hero
		  open={open}
		  setOpen={setOpen}
	  />
	  <JamsHome
		  supabase={supabase}
		  session={session}
		  artists={artists}
		  songs={songs}
		  jams={jams}
		  sounds={sounds}
		  open={open}
		  setOpen={setOpen}
		  count={count}
		  user={user}
		  profile={profile}
		  title={title}
		  setHeight={setHeight}
	  />
      <BottomNav supabase={supabase} session={session}/>
      </div>
	);
}
