export function emojiToUnicode(emoji) {
	let comp
	if (emoji.length === 1) {
		comp = emoji.charCodeAt(0)
	} else {
		comp = (emoji.charCodeAt(0) - 0xd800) * 0x400 + (emoji.charCodeAt(1) - 0xdc00) + 0x10000
		if (comp < 0) {
			comp = emoji.charCodeAt(0)
		}
	}
	return '0x' + comp.toString(16)
}
