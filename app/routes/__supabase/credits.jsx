export default function Credits() {
	return (
		<div className='p-4 w-full h-full pb-20'>
			<div className='flex flex-col items-center mt-10 p-4 mx-auto max-w-xl border rounded-xl text-gray-800'>
				<h1 className='text-3xl self-center pb-6'>Credits</h1>
				<p className='text-lg  mb-6'>
					When adding jams, the show and setlist data comes from:
				</p>

				<h2 className='text-2xl font-bold mb-2'>Phish.net</h2>
				<p className='text-lg  mb-6'>Phish, Trey Anastasio, TAB</p>
				<p className='text-lg mb-6'>
					<a
						className='underline text-blue-700 hover:text-blue-800'
						href='https://phish.net/credits'
					>
						Phish.net
					</a>{' '}
					is an amazing resource for <em></em>all things Phish. Thanks to the{' '}
					<a
						className='underline text-blue-700 hover:text-blue-800'
						href='https://phish.net/credits'
					>
						Phish.net team
					</a>
					!
				</p>
				<h2 className='text-2xl font-bold mt-8 mb-2'>Fan sites using Songfish</h2>
				<ul className='text-lg m-6 text-left self-start'>
					<li className='my-2'>
						Eggy - <a href='https://thecarton.net' className='underline text-blue-700 hover:text-blue-800'>thecarton.net</a>
					</li>
					<li className='my-2'>
						Goose - <a href='https://elgoose.net' className='underline text-blue-700 hover:text-blue-800'>elgoose.net</a>
					</li>
					<li className='my-2'>
						Neighbor - <a href='https://www.neighbortunes.net' className='underline text-blue-700 hover:text-blue-800'>neighbortunes.net</a>
					</li>
          <li className='my-2'>
						Taper's Choice - <a href='https://taperschoice.net' className='underline text-blue-700 hover:text-blue-800'>taperschoice.net/</a>
					</li>
					<li className='my-2'>
						Umphrey's McGee - <a href='https://allthings.umphreys.com' className='underline text-blue-700 hover:text-blue-800'>allthings.umphreys.com</a>
					</li>
				</ul>
				<p className='text-lg  mb-6'>
					Thank you to the fans who created, maintain and update these sites. Check them out!<br/><br/>They all use <a
						className='underline text-blue-700 hover:text-blue-800'
						href='https://songfishapp.com/'
					>
						Songfish
					</a>
				, which means that when adding a jam to Jam Fans, you can choose a song name to see all performances. Songfish is a setlist software that "allows a band or fans to preserve concert
					setlists and data. The software allows users to search that data and
					generate statistics." Thanks{' '}
					<a
						href='https://adamscheinberg.com/'
						className='underline text-blue-700 hover:text-blue-800'
					>
						Adam Scheinberg
					</a>
					!
				</p>
				<h2 className='text-2xl font-bold mb-2 mt-8'>Setlist.fm</h2>
				<p className='text-lg  mb-6'>All other artists</p>
				<p className='text-lg  mb-10 self-start'>
					<a
						className='underline text-blue-700 hover:text-blue-800'
						href='https://www.setlist.fm/'
					>
						Setlist.fm
					</a>{' '}
					has setlists by every band you can think of. Thank you to the
					setlist.fm contributors!
				</p>
				<div className='relative'>
					<div
						className='absolute inset-0 flex items-center'
						aria-hidden='true'
					>
						<div className='w-full border-t border-gray-300' />
					</div>
					<div className='relative flex justify-center'>
						<span className='bg-white px-2 text-3xl'>Thank You!</span>
					</div>
				</div>
				<p className='text-lg py-4'>
					Artists, crew, staff, tapers, fans, friends and family of fans, and
					everyone else - thank you for playing your part in creating and
					sharing this music.{' '}
				</p>
			</div>
		</div>
	);
}
