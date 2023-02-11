import JamCard from './cards/JamCard';
import { Link } from '@remix-run/react';
import InfoAlert from './alerts/InfoAlert';
import { useState, useEffect, useCallback } from 'react';

export default function JamList({
	jams,
	sounds,
	title,
	user,
	profile,
	search,
  setHeight,
  showIframe,
  setShowIframe,
}) {
	const artistStartIndex = search?.indexOf('artists-') + 'artists-'.length;
	const urlStartIndex = search?.indexOf('=', artistStartIndex);
	const artistUrl = search?.substring(artistStartIndex, urlStartIndex);
	const [iframeUrl, setIframeUrl] = useState('');
	const [formattedIframeUrl, setFormattedIframeUrl] = useState('');

  const divHeight = useCallback(
    (node) => {
      if (node !== null) {
        setHeight(node.getBoundingClientRect().height);
      }
    },
    [jams.length]
  );
  const isRelisten = iframeUrl.includes('relist');

	useEffect(() => {
		let reformattedLink;
		if (!reformattedLink && iframeUrl) {
			if (iframeUrl.includes('youtu')) {
				if (iframeUrl.includes('watch?v=')) {
					reformattedLink = iframeUrl.replace('watch?v=', 'embed/');
				}
				if (iframeUrl.includes('youtu.be')) {
					let youTubeId;
					let regExp =
						/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
					let match = iframeUrl.match(regExp);
					if (match && match[2].length == 11) {
						youTubeId = match[2];
						reformattedLink = `https://www.youtube.com/embed/${youTubeId}?autoplay=1`;
					}
				}
			}
		}
		setFormattedIframeUrl(reformattedLink ?? iframeUrl);
	}, [iframeUrl]);

  function closeIframe() {
    setShowIframe(false)
  }

	return (
		<div className='pb-60' ref={divHeight}>
			{jams?.length > 0 && (
				<h1 className='my-3 mx-auto px-2 text-3xl tracking-tight text-gray-900 text-center'>
					{title}
				</h1>
			)}
			<div className='flex flex-wrap max-w-100vw justify-center'>
				{jams?.length > 0 &&
					jams?.map((jam, index) => {
						return (
							<JamCard
								key={index}
								jam={jam}
								sounds={sounds}
								user={user}
								profile={profile}
								setShowIframe={setShowIframe}
								setIframeUrl={setIframeUrl}
							/>
						);
					})}
				{jams?.length === 0 && (
					<div className='flex flex-col m-4 justify-center'>
						<InfoAlert
							title={`No ${title} (yet)`}
							description={
								"If you could go ahead and add one, yeah, that'd be great (no account needed!)"
							}
						/>
						<Link
							to={artistUrl ? `/add/jam?artistUrl=${artistUrl}` : '/add/jam'}
							className='text-center text-xl underline'
						>
							Add a jam
						</Link>
					</div>
				)}
			</div>
			{showIframe && formattedIframeUrl &&  (
				<div className={`z-20 fixed bottom-0 left-0 pt-1 pl-1 pb-1 m-0 ${isRelisten ? 'w-full h-1/3' : 'max-w-80  max-h-50 md:mb-0'} drop-shadow-sm rounded-tl-lg rounded-bl-lg mb-14 md:pb-0 md:rounded-bl-none bg-white flex flex-col`}>
          <button onClick={closeIframe} className='text-right mr-2'>Close &#215;</button>
					<iframe
						src={formattedIframeUrl}
						// title={`Listen to ${jam.song_name} from ${jam.date}`}
						height={'100%'}
						width={'100%'}
					></iframe>
				</div>
			)}
		</div>
	);
}
