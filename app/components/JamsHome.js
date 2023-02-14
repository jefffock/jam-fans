//import components used below
import JamFiltersSlideout from './JamFilters';
import ArtistBar from './ArtistBar';
import FiltersButton from './FiltersButton';
import JamList from './JamList';
import { useState } from 'react';
import { useFetcher } from '@remix-run/react';

export default function JamsHome({
	supabase,
	session,
	artists,
	songs,
	jams,
	sounds,
	open,
	setOpen,
	title,
	count,
	search,
  user,
  profile,
  setClientHeight,
  setHeight
}) {
  const fetcher = useFetcher();
  const [showIframe, setShowIframe] = useState(false);
	if (!artists) return <div>Loading...</div>;

	return (
		<div className='bg-gray-100'>
			<ArtistBar artists={artists} search={search}/>
			<div className='flex justify-center pt-3 pb-0 mb-0'>
				<FiltersButton
					open={open}
					setOpen={setOpen}
				/>
			</div>
			<JamFiltersSlideout
				sounds={sounds}
				artists={artists}
				songs={songs}
				open={open}
				setOpen={setOpen}
				totalCount={count}
				search={search}
        showIframe={showIframe}
        
			/>
			<JamList
				jams={jams}
				sounds={sounds}
				title={title}
        user={user}
        profile={profile}
        search={search}
        setClientHeight={setClientHeight}
      setHeight={setHeight}
      showIframe={showIframe}
      setShowIframe={setShowIframe}
			/>
		</div>
	);
}
