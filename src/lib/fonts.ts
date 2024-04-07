import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const fontSettings = persisted('fonts', {
	baseFont: 'inter',
	titleFont: 'montserrat',
	monoFont: 'jetbrains'
});

export const fonts = {
	base: {
		inter: {
			name: 'Inter',
			path: '/fonts/base/inter.css',
			id: 'inter'
		},
		roboto: {
			name: 'Roboto',
			path: '/fonts/base/roboto.css',
			id: 'roboto'
		},
		merriweather: {
			name: 'Merriweather',
			path: '/fonts/base/merriweather.css',
			id: 'merriweather'
		}
	},
	title: {
		bebasNeue: {
			name: 'Bebas Neue',
			path: '/fonts/title/bebas neue.css',
			id: 'bebasNeue'
		},
		inter: {
			name: 'Inter',
			path: '/fonts/title/inter.css',
			id: 'inter'
		},
		merriweather: {
			name: 'Merriweather',
			path: '/fonts/title/merriweather.css',
			id: 'merriweather'
		},
		montserrat: {
			name: 'Montserrat',
			path: '/fonts/title/montserrat.css',
			id: 'montserrat'
		}
	},
	mono: {
		jetbrains: {
			name: 'Jetbrains Mono',
			path: '/fonts/mono/jetbrains.css',
			id: 'jetbrains'
		},
		roboto: {
			name: 'Roboto Mono',
			path: '/fonts/mono/roboto.css',
			id: 'roboto'
		},
		space: {
			name: 'Space Mono',
			path: '/fonts/mono/space.css',
			id: 'space'
		}
	}
};

export function applyFonts() {
	if (browser) {
		// Use get to retrieve the current value of the fontSettings store
		const fontsValue = get(fontSettings);

		// Apply base font
		console.log('BASEFONT: ', fontsValue.baseFont);

		const baseFontLink = document.createElement('link');
		baseFontLink.rel = 'stylesheet';
		baseFontLink.href = fonts.base[fontsValue.baseFont].path;
		document.head.appendChild(baseFontLink);

		// Apply title font
		const titleFontLink = document.createElement('link');
		titleFontLink.rel = 'stylesheet';
		// Correctly handle 'bebas neue' to 'bebasNeue'
		const titleFontKey = fontsValue.titleFont.replace('bebas neue', 'bebasNeue');
		titleFontLink.href = fonts.title[titleFontKey].path;
		document.head.appendChild(titleFontLink);

		// Apply mono font
		const monoFontLink = document.createElement('link');
		monoFontLink.rel = 'stylesheet';
		monoFontLink.href = fonts.mono[fontsValue.monoFont].path;
		document.head.appendChild(monoFontLink);
	}
}
