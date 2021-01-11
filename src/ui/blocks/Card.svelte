<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Shadow } from '../../core/shadow';
	import { CSSUtility } from '../../resources/utilities';
	import Scene from './Scene.svelte';

	export let depth = 3;
	export let backgroundColour = '--colour-background-secondary';
	export let hoverColour = '--colour-accent-primary';

	export let roundness = '--roundness';

	export let isFloatingInverted = false;
	
	export let height = 'auto';
	export let width = 'auto';

	export let heightWritable = writable(height);
	export let widthWritable = writable(width);

	let componentDomContent = null;

	onMount(() => {
		Shadow.apply(depth, componentDomContent);
	});
</script>

<component
	bind:this={componentDomContent}
	style='
		--colour-background: {CSSUtility.parse(backgroundColour)};
		--colour-hover: {CSSUtility.parse(hoverColour)};
		--height: {CSSUtility.parse($heightWritable)};
		--width: {CSSUtility.parse($widthWritable)};
		--box-shadow: {isFloatingInverted ? 'var(--shadow)' : 'var(--shadow-inactive)'};
		--active-box-shadow: {isFloatingInverted ? 'var(--shadow-inactive)' : 'var(--shadow)'};
		--card-roundness: {CSSUtility.parse(roundness)};
	'
>
	<Scene
		backgroundColour='transparent'
		height='100%'
		width='100%'
		{...$$restProps}
	>
		<slot></slot>
	</Scene>
</component>

<style>
	component {
		background: var(--colour-background);

		height: var(--height);
		width: var(--width);

		border-radius: var(--card-roundness);

		box-shadow: var(--box-shadow);

		transition: 0.2s var(--ease-slow-slow);
	}

	component:hover {
		background: var(--colour-hover);
	}

	component:active {
		box-shadow: var(--active-box-shadow);
	}
</style>