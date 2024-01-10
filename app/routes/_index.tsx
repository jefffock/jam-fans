
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json, redirect, LoaderFunctionArgs } from '@remix-run/node';
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { useState, useEffect } from 'react';
import FiltersButton from '../components/FiltersButton';
import Hero from '../components/Hero';
import JamsHome from '../components/JamsHome';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	console.log('in index loader')
	  const response = new Response();
	  const cookies = parse(request.headers.get('Cookie') ?? '')
	const headers = new Headers()
  
	const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
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
	  const { data: sounds } = await supabase
		  .from('sounds')
		  .select('label, text')
		  .order('label', { ascending: true });
	  let { data: allArtists } = await supabase
		  .from('artists')
		  .select('nickname, emoji_code, url, artist')
		  .order('name_for_order', { ascending: true });
  
	  const url = new URL(request.url);
	  const searchParams = new URLSearchParams(url.search);
	  const queryParams = Object.fromEntries(searchParams);
  
	  delete queryParams['show-ratings'];
	  delete queryParams['limit[label]'];
	  const page = Number(queryParams.page) || 1;
	  delete queryParams.page;
  
	  const stringParams = JSON.stringify(queryParams);
  
	  console.log('page', page);
	  //iterate through queryParamsArray and build a supabase query
	  let song;
	  let date;
	  let beforeDate;
	  let afterDate;
	  let orderBy = 'avg_rating';
	  let asc = false;
	  let limit = 100;
	  let showListenable = false;
	  let urlToShow;
	  let queryObjToStore = {};
	  let soundsInQuery: any[] = [];
	  let artistsInQuery = [];
  
	  for (const [key, value] of Object.entries(queryParams)) {
		  if (key.includes('sound')) {
			  soundsInQuery.push(value);
		  }
		  if (key.includes('artist')) {
			  artistsInQuery.push(value);
		  }
		  if (key.includes('song')) {
			  song = value;
		  }
		  if (key.includes('before')) {
			  beforeDate = value;
		  }
		  if (key.includes('after')) {
			  afterDate = value;
		  }
		  if (key.includes('order')) {
			  orderBy = value;
		  }
		  if (key.includes('asc')) {
			  asc = true;
		  }
		  if (key.includes('limit')) {
			  limit = Number(value);
		  }
		  if (key.includes('show-links')) {
			  showListenable = true;
		  }
		  if (key.includes('date')) {
			  date = value;
		  }
		  if (key.includes('order')) {
			  orderBy = value;
		  }
	  }
	  console;
	  //cnovert date from mmddyyyy with no hyphens to yyyy-mm-dd
	  if (date) {
		  let year = date.slice(4, 8);
		  let month = date.slice(0, 2);
		  let day = date.slice(2, 4);
		  date = year + '-' + month + '-' + day;
	  }
	  console.log('date in jams loader', date);
	  const list = await supabase
		  .from('jams_lists')
		  .select('*')
		  .eq('params', stringParams)
		  .single();
	  if (list.data) {
		  urlToShow = '/jams/lists/' + list.data.id;
	  }
	  let jams = supabase.from('jams').select('*');
	  let artistsInQueryNames: any[] = [];
	  console.log('artistsInQuery', artistsInQuery);
	  if (artistsInQuery?.length > 0) {
		  //if first element is null, break
		  if (artistsInQuery[0] !== 'null') {
			  artistsInQuery.forEach((artist) => {
				  artistsInQueryNames.push(allArtists?.find((a) => a.url === artist)?.artist);
			  });
			  console.log('artistsInQueryNames', artistsInQueryNames);
			  jams = jams.in('artist', artistsInQueryNames);
		  }
	  }
	  if (song) {
		  jams = jams.eq('song_name', song);
	  }
	  if (afterDate && !date) {
		  let after = afterDate + '-01-01';
		  jams = jams.gte('date', after);
	  }
	  if (beforeDate && !date) {
		  let before = beforeDate + '-12-31';
		  jams = jams.lte('date', before);
	  }
	  if (showListenable) {
		  console.log('showListenable', showListenable);
		  jams = jams.not('listen_link', 'is', null);
	  }
	  if (soundsInQuery) {
		  let arrayOfLabels: any[] = [];
		  soundsInQuery.forEach((sound) => {
			  arrayOfLabels.push(sounds?.find((s) => s.text === sound)?.label);
		  });
		  if (arrayOfLabels.length > 0) {
			  jams = jams.contains('sounds', arrayOfLabels);
		  }
	  }
	  if (date) {
		  console.log('date in index', date);
		  jams = jams.eq('date', date);
	  }
	  console.log('orderBy in jams loader', orderBy);
	  jams = jams.order(orderBy, { ascending: false });
	  if (orderBy === 'avg_rating') {
		  jams = jams.order('num_ratings', { ascending: false });
	  }
	  if (orderBy === 'num_ratings') {
		  jams = jams.order('avg_rating', { ascending: false });
	  }
	  jams = jams.order('song_name', { ascending: true });
	  jams = jams.order('id', { ascending: false });
	  const startRange = page ? (page - 1) * 15 : 0;
	  const endRange = page ? page * 15 : 15;
	  console.log('startRange', startRange);
	  console.log('endRange', endRange);
	  jams = jams.range(startRange, endRange);
	  // jams = jams.limit(10);
	  const { data: jamsFetched } = await jams;
	  // if (orderBy === 'avg_rating') {
	  // }
	  // if (orderBy === 'num_ratings') {
	  // 	jams = jams.order('avg_rating', { ascending: false });
	  // }
	  //get base versions
	  // const { data: versions } = await supabase
	  // 	.from('versions')
	  // 	.select('*')
	  // 	.order('avg_rating', { ascending: false })
	  // 	.limit(100);
	  //get songs
	  const { data: songs } = await supabase
		  .from('songs')
		  .select('song, artist');
	//   let artists: any[] = [
	// 	  {
	// 		  nickname: 'All Bands',
	// 		  emoji_code: '0x221E',
	// 		  url: null,
	// 		  artist: 'All Bands',
	// 	  }
	//   ].concat(allArtists);

	  const artists = [{
		nickname: 'All Bands',
		emoji_code: '0x221E',
		url: null,
		artist: 'All Bands',
	}].concat(allArtists || []);
  
	  let title = '🔥 ';
	  if (soundsInQuery?.length > 0) {
		  for (var i = 0; i < soundsInQuery.length; i++) {
			  title += sounds?.find((s) => s.text === soundsInQuery[i])?.label;
			  //addcommaexceptlast
			  if (i < soundsInQuery.length - 2) title += ', ';
			  if (i === soundsInQuery.length - 2) title += ' and ';
			  soundsInQuery.forEach((sound) => {});
		  }
		  //remove last two characters
	  }
	  if (song) {
		  title += ' ' + song;
	  }
	  title += ' Jams';
	  if (artistsInQueryNames?.length > 0 && !date) {
		  title += ' by ';
		  title += ' ';
		  for (var j = 0; j < artistsInQueryNames.length; j++) {
			  if (artistsInQueryNames[j] === 'Grateful Dead') title += 'The ';
			  title += artistsInQueryNames[j];
			  if (j < artistsInQueryNames.length - 2) title += ', ';
			  if (j === artistsInQueryNames.length - 2) title += ' and ';
		  }
	  }
	  if (artistsInQueryNames?.length === 0 && !date) {
		  title += ' by All Bands';
	  }
	  if (date) {
		  title += ' from ' + new Date(date + 'T16:00:00').toLocaleDateString();
	  }
	  if (beforeDate && afterDate && !date) {
		  if (beforeDate === afterDate) {
			  title += ' from ' + beforeDate;
		  } else {
			  title += ' from ' + afterDate + ' to ' + beforeDate;
		  }
	  }
	  if (beforeDate && !afterDate && !date) {
		  title += ' from ' + beforeDate + ' and before ';
	  }
	  if (afterDate && !beforeDate && !date) {
		  title += ' from ' + afterDate + ' and after ';
	  }
	  title.trim();
	  const fullTitle = title + ' on Jam Fans';
  
	  let countFromSB = await supabase
		  .from('versions')
		  .select('*', { count: 'exact', head: true });
	  const count = Number(countFromSB.count);
	  const search = url.search;
  
	  return json(
		  {
			  artists,
			  songs,
			  initialJams: jamsFetched,
			  sounds,
			  fullTitle,
			  title,
			  count,
			  search,
			  user,
			  profile,
			  initialPage: page,
		  },
		  {
			  headers: response.headers,
		  }
	  );
  };
  
  export default function Index() {
	  const {
		  artists,
		  songs,
		  sounds,
		  fullTitle,
		  title,
		  count,
		  search,
		  user,
		  profile,
		  initialJams,
		  initialPage,
	  } = useLoaderData<typeof loader>();
	  const [open, setOpen] = useState(false);
	  const [scrollPosition, setScrollPosition] = useState(0);
	  const [clientHeight, setClientHeight] = useState<number | null>(null);
	  const [shouldFetch, setShouldFetch] = useState(true);
	  const [height, setHeight] = useState(null);
	  const [page, setPage] = useState(2);
	  const fetcher = useFetcher();
	  const [jams, setJams] = useState(initialJams);
	  const [urlToLoad, setUrlToLoad] = useState(null);
  
	  if (!artists) return <div>Loading...</div>;
  
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
	  if (typeof document !== 'undefined' && urlToLoad) {
		  console.log('loading', urlToLoad);
		  fetcher.load(urlToLoad);
		  setUrlToLoad(null);
	  }
	  }, [urlToLoad]);
  
	  useEffect(() => {
		  if (typeof window !== 'undefined') {
			  if (initialPage === 1) {
				  setJams(initialJams);
			  }
		  }
	  }, [initialJams]);
  
	  useEffect(() => {
		  if (!shouldFetch || !height) return;
		  if ((clientHeight &&
			  (page !== 2 && clientHeight + scrollPosition + 2000 < height)) || (clientHeight &&
			  (page === 2 && clientHeight + scrollPosition + 1500 < height))
		  )
			  return;
		  let newSearch = search.slice(1);
		  let urlToFetch = `/jams?index&${newSearch}&page=${page}`;
		  fetcher.load(urlToFetch);
		  setShouldFetch(false);
	  }, [clientHeight, scrollPosition]);
  
	  useEffect(() => {
		const data: any = fetcher.data
			if (data?.initialJams?.length === 0) {
				setShouldFetch(false);
				return;
			}
	
			if (data?.initialJams?.length > 0 && jams) {
				const allJams = [...jams, ...data.initialJams];
				setJams(allJams);
				setPage((page) => page + 1);
				setShouldFetch(true);
			}
	  }, [fetcher.data]);
  

	return (
		 <div className='w-full h-full overflow-x-hidden'>
    {/* <Login supabase={supabase} session={session} />
      <Nav /> */}
	  <Hero
		  open={open}
		  setOpen={setOpen}
	  />
	  <JamsHome
				artists={artists}
				songs={songs}
				jams={jams}
				sounds={sounds}
				open={open}
				setOpen={setOpen}
				// fullTitle={fullTitle}
				title={title}
				count={count}
				search={search}
				user={user}
				profile={profile}
				setClientHeight={setClientHeight}
				setHeight={setHeight}
				setUrlToLoad={setUrlToLoad}
			/>
      </div>
	);
}
