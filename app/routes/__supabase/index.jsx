import { Link, Outlet } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import ArtistBar from '../../components/ArtistBar';
import JamList from '../../components/JamList';
import JamFilters from '../../components/JamFilters';
import JamFiltersSlideout from '../../components/JamFilters';
import { useState } from 'react';
import FiltersButton from '../../components/FiltersButton';
import JamsHome from '../../components/JamsHome';

export const loader = async ({ request, params }) => {
	const response = new Response();
	const supabaseClient = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{ request, response }
	);
	//get artists
	let { data: artists } = await supabaseClient
		.from('artists')
		.select('nickname, emoji_code, url, artist')
		.order('name_for_order', { ascending: true })
	//get base versions
	const { data: versions } = await supabaseClient
		.from('versions')
		.select('*')
		.order('avg_rating', { ascending: false })
		.limit(100);
	//get songs
	const { data: songs } = await supabaseClient.from('songs').select('song, artist').order('song', { ascending: true });
  const { data: sounds } = await supabaseClient.from('sounds').select('label, text');
	artists = [{ nickname: 'All Bands', emoji_code: '0x221E', url: null, artist: 'All Bands' }, { nickname: 'Phish', emoji_code: '0x1F41F', url: 'phish', artist: 'Phish' }, { nickname: 'Grateful Dead', emoji_code: '0x1F480', url: 'grateful-dead', artist: 'Grateful Dead' }].concat(artists)
  //make title
  console.log('sounds', sounds)
  let title = '';
	if (initialTags) {
		for (var i = 0; i < initialTags.length; i++) {
			title += tagsList[initialTags[i]];
			if (i < initialTags.length - 1) title += ', ';
		}
	}
	if (initialSong) {
		title += ' ' + initialSong + ' ';
	}
	title += ' Jams';
	if (initialArtist) {
		title += ' by ' + initialArtist;
	}
	if (initialBeforeDate && initialAfterDate) {
    if (initialBeforeDate === initialAfterDate) {
      title += ' from ' + initialBeforeDate;
    } else {
      title += ' from ' + initialAfterDate + ' to ' + initialBeforeDate;
    }
	}
	if (initialBeforeDate && !initialAfterDate) {
		title += ' from ' + initialBeforeDate + ' and before ';
	}
	if (initialAfterDate && !initialBeforeDate) {
		title += ' from ' + initialAfterDate + ' and after ';
	}
	let subtitle = '';
	let newLimit = initialLimit !== 'null' ? initialLimit : 'All';
	if (initialOrderBy) {
		switch (initialOrderBy) {
			case 'id':
				subtitle += newLimit + ' recently added';
				break;
			case 'artist':
				subtitle += newLimit !== 'All' ? 'First ' + newLimit : 'All';
				subtitle += 'by artist name';
				order === 'asc' ? (subtitle += ' (A-Z)') : (subtitle += ' (Z-A)');
				break;
			case 'song_name':
				subtitle += newLimit !== 'All' ? 'First ' + newLimit : 'All';
				subtitle += 'by song name';
				order === 'asc' ? (subtitle += ' (A-Z)') : (subtitle += ' (Z-A)');
				break;
			case 'date':
				if (order === 'asc') {
					subtitle += newLimit + ' oldest';
				} else {
					subtitle += newLimit + ' newest';
				}
				break;
			case 'avg_rating':
				subtitle += newLimit + ' highest-rated';
				break;
			case 'num_ratings':
				subtitle += newLimit + ' most-rated';
				break;
		}
	}
	title.trim();
	subtitle.trim();
	const fullTitle = title + ': ' + subtitle + ' on Jam Fans';


	return json(
		{ artists, songs, versions, sounds },
		{
			headers: response.headers,
		}
	);
};

export default function Index({ supabase, session }) {
	const { artists, songs, versions, sounds, title } = useLoaderData();
  const [open, setOpen] = useState(false);
  if (!artists) return <div>Loading...</div>;

	return (
      <JamsHome supabase={supabase} session={session} artists={artists}  songs={songs} versions={versions} sounds={sounds} open={open} setOpen={setOpen}/>
	);
}
