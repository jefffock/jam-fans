import { useFetcher } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ArtistBar({ artists, search }) {
  if (!artists) return <div>Loading...</div>;
  const fetcher = useFetcher()

  function handleArtistClick(artist) {

  }
  console.log('search', search)
  return (
    <div className="flex h-30 w-screen overflow-x-scroll space-x-10 items-starts justify-items-center px-1">
      {artists?.map((artist, index) => {
        let url = search?.replace(/artists-.+?(?=&|$)/g, "") 
        url += `&artists-${artist.url}=${artist.url}&`
        // add one query for the artist 'eggy'
        return (
          // <div key={index} className='text-center min-w-20 mb-2'>
          //   <Link to={url} >
          //   <p className='text-center text-2xl'>{String.fromCodePoint(artist.emoji_code)}</p>
          //   <p className='text-center text-sm whitespace-nowrap'>{artist.nickname}</p>
          //   </Link>
          // </div>
          <ArtistInBar key={index} artist={artist} url={url} />
        );
      }
      )}
    </div>
  );
}

function ArtistInBar({ artist, url }) {
  return (
    <div className='text-center min-w-20 mb-2'>
    <Link to={url} >
    <p className='text-center text-2xl'>{String.fromCodePoint(artist.emoji_code)}</p>
    <p className='text-center text-sm whitespace-nowrap'>{artist.nickname}</p>
    </Link>
  </div>
  )
  }
