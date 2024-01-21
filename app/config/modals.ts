export const addArtistConfig = {
	title: 'add a band',
	action: 'add-artist',
	submitButtonName: 'add band',
	fields: [
		{
			label: 'band name',
			name: 'name',
			placeholder: 'band name',
			type: 'text',
			required: true,
		},
		{
			label: 'band emoji (optional)',
			name: 'emoji',
			placeholder: '',
			type: 'text',
			required: false,
		},
	],
}

export const addShowConfig = {
	title: 'add a show',
	action: 'add-show',
	submitButtonName: 'add show',
	fields: [
		{
			label: 'band',
			name: 'name',
			placeholder: 'band',
			type: 'text',
			required: true,
		},
		{
			label: 'date',
			name: 'date',
			placeholder: 'mmddyyyy',
			type: 'text',
			required: false,
		},
	],
}
