export default function Contact() {
	return (
    <div className='w-100 h-100'>
		<div className='p-4 bg-white border border-gray-200 rounded-lg shadow m-4 mt-20 w-80 flex flex-col justify-between mx-auto'>
       <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 m-4">Contact</h3>
    </div>
			<h1 className='text-lg m-4'>Open to all suggestions: new artists, design, wording, features, etc. Also, please let me know if you encounter any bugs. Thank you!</h1>
      <p className='m-4'>Twitter: <a href='https://twitter.com/jeffphox' className='underline'>@jeffphox</a></p>
      <p className='m-4'>Email: <a className='underline' href='mailto:hi@jam.fans'>hi@jam.fans</a></p>
		</div>
    </div>
	);
}
