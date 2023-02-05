import { Link } from "react-router-dom";

export default function ArtistBar({ artists, search }) {
  if (!artists) return <div>Loading...</div>;
  return (
    <>
    <div className="flex h-30 w-screen overflow-x-scroll items-starts justify-items-center pl-1 pr-10">
      {artists?.map((artist, index) => {
        let url = ""
        if (search) url = search?.replace(/artists-.+?(?=&|$)/g, "") 
        if (!search) url = `/jams/?`
        url += `&artists-${artist.url}=${artist.url}`
        return (
          <ArtistInBar key={index} artist={artist} url={url} />
        );
      }
      )}
    </div>
    </>
  );
}

function ArtistInBar({ artist, url }) {
  return (
    <div className='group text-center min-w-20 my-6 hover:mb-0 px-4 transition-all duration-300 transform hover:scale-125 hover:z-10'>
    <Link to={url} >
    <p className='text-center text-2xl'>{String.fromCodePoint(artist.emoji_code)}</p>
    <p className='text-center text-sm whitespace-nowrap'>{artist.nickname}</p>
    </Link>
  </div>
  )
  }
