<script>
	import { writable } from 'svelte/store';

	const isOnWritable = writable(
		fromCookie() == null
			? !window.matchMedia('(prefers-color-scheme: dark)').matches
			: fromCookie(),
	);
	const htmlDomContent = document.querySelector('html');

	window.matchMedia('(prefers-color-scheme: dark)')
		.addEventListener(
			'change',
			({ match }) => isOnWritable.set(!match),
		);

	isOnWritable.subscribe((isOn) => {
		toCookie(isOn);

		if (!isOn) {
			htmlDomContent.classList.add('theme:dark');
			htmlDomContent.classList.remove('theme:light');

			return;
		}

		htmlDomContent.classList.add('theme:light');
		htmlDomContent.classList.remove('theme:dark');
	});


	function fromCookie() {
		const startIndex = document.cookie.indexOf('light=') + 'light='.length;
		const remainingString = document.cookie.substr(startIndex);
		const endIndex = remainingString.indexOf(';');
		const substring = remainingString.substr(
			0,
			endIndex === -1
				? remainingString.length
				: endIndex,
		);

		console.table({
			startIndex,
			remainingString,
			endIndex,
			substring,
		});

		// Boolean('false') === true
		// !!'false' === true
		// return undefined if undefined, other wise convert string to boolean
		return substring == null
			? substring
			: substring === 'true';
	}

	function toCookie(isOn) {
		document.cookie = `light=${isOn}`;
	}
</script>

<component
	on:click={() => isOnWritable.set(!$isOnWritable)}
>
{#if !$isOnWritable}
	<svg
		xmlns="http://www.w3.org/2000/svg" 
		height="24" 
		viewBox="0 0 24 24" 
		width="24"
	>
		<path 
			d="M0 0h24v24H0z" 
			fill="none"
		/>
		<path 
			d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
		/>
	</svg>
{:else}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height="24"
		viewBox="0 0 24 24"
		width="24"
	>
		<path
			d="M0 0h24v24H0z"
			fill="none"
		/>
		<path
			d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
		/>
	</svg>
{/if}
</component>

<style>
	component {
		cursor: pointer;
		height: 100%;
		width: 100%;
	}

	svg {
		fill: var(--colour-text-primary);
	}
</style>



