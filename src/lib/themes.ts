import { persisted } from 'svelte-persisted-store';

export const theme = persisted('theme', 'azure');

export const themes = [
	'amber',
	'azure',
	'blue',
	'cyan',
	'fuchsia',
	'green',
	'grey',
	'indigo',
	'jade',
	'lime',
	'orange',
	'pink',
	'pumpkin',
	'purple',
	'red',
	'sand',
	'slate',
	'violet',
	'yellow',
	'zinc'
];
