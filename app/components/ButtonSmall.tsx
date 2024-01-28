export default function ButtonSmall({ text = '', name = '', value = '', type, onClick, disabled }) {
	return (
		<button
			type={type}
			name={name}
			value={value}
			onClick={onClick}
			disabled={disabled}
			className={`${disabled ? 'text-gray-400 border-gray-400 cursor-default' : 'text-gray-700 border-gray-300 hover:text-cyan-700 hover:border-cyan-700'} h-min bg-white inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm`}
		>
			{text}
		</button>
	)
}
