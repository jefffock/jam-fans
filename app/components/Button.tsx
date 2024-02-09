export default function Button({
	text = '',
	name = '',
	value = '',
	type,
	onClick,
	disabled,
	children,
	size = 'small',
	color,
	className = '',
}) {
	return (
		<button
			type={type}
			name={name}
			value={value}
			onClick={onClick}
			disabled={disabled}
			className={`${className} ${disabled ? 'text-gray-400 border-gray-400 cursor-default' : `text-gray-700 border-gray-300 hover:text-${color ?? 'cyan-700'} hover:border${color ?? 'cyan-700'}`} h-min bg-white inline-flex items-center px-4 py-2 border ${size === 'small' ? 'text-md' : size === 'large' ? 'text-lg' : 'text-md'} rounded-md shadow-sm`}
		>
			{children || text}
		</button>
	)
}
