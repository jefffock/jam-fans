export default function Iframe({ formattedIframeUrl, closeIframe }: { src: string }) {
	const isRelisten = formattedIframeUrl?.includes('relist')
	return (
		<div
			className={`z-20 fixed bottom-0 left-0 pt-1 pr-1 m-0 ${
				isRelisten ? 'w-full h-1/3' : 'max-w-80  max-h-50 md:mb-0'
			} drop-shadow-sm rounded-tr-xl md:rounded-bl-none bg-black flex flex-col`}
		>
			<button onClick={closeIframe} className="text-left text-white ml-2">
				Close &#215;
			</button>
			<iframe src={formattedIframeUrl} title={'listen'} height={'100%'} width={'100%'}></iframe>
		</div>
	)
}
