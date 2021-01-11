<script>
	import { writable } from 'svelte/store';
	// import { dropIn, dropOut } from '../../core/transitioner';
	import { navigatorAppBarExpandedHeight } from '../../resources/stores';

	import { CSSUtility, WindowUtility } from '../../resources/utilities';

	import Button from '../blocks/Button.svelte';
	import Image from '../blocks/Image.svelte';
	import Scene from '../blocks/Scene.svelte';

	/** @type {Record<string, () => void>} */
	export let keyAndCallbackMap;
	export let keyAndPreviewImageMap = [];

	const keys = Object.keys(keyAndCallbackMap);
	const callbacks = Object.values(keyAndCallbackMap);

	const { innerWritable } = WindowUtility;
	$: inner = $innerWritable;
	const componentHeightWritable = writable(0);
	$: componentHeightWritable.set(inner.height - $navigatorAppBarExpandedHeight);
</script>

<Scene
	isPadded={false}
	isInAnimated={true}
	isOutAnimated={true}
	width='100%'
>
	<container
		class='all'
		style='
			--height: {CSSUtility.parse($componentHeightWritable)}
		'
	>
		{#each keys as key, i}
			<container
				class='button'
			>
				<Button
					height='100%'
					width='100%'
					on:click={callbacks[i]}
					roundness='0'
					padding='0'
					hoverColour={keyAndPreviewImageMap[key] ? '--colour-background-primary' : '--colour-accent-secondary'}
					backgroundColour={keyAndPreviewImageMap[key] ? 'transparent' : '--colour-accent-primary'}
				>
					<icon 
						class={keyAndPreviewImageMap[key] ? 'hover-off' : ''} 
						slot='icon'
					>
						arrow_forward
					</icon>
					<heading
						class={keyAndPreviewImageMap[key] ? 'hover-off' : ''} 
					>
						{key}
					</heading>
					<container
						class='background'
						slot='background'
					>
						{#if keyAndPreviewImageMap[key]}
							<Image 
								src={keyAndPreviewImageMap[key]}
							/>
						{/if}
					</container>
				</Button>
			</container>
		{/each}
	</container>
</Scene>

<style>
	container.all {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		grid-auto-rows: 1fr;

		height: var(--height);
		width: 100%;

		/* gap: var(--padding); */
		/* padding: var(--padding); */
		box-sizing: border-box;
	}

	@media only screen and (max-width: 840px) {
		container.all {
			grid-auto-flow: row;
		}
	}

	container.background {
		height: 100%;
		width: 100%;

		position: absolute;
		top: 0;
		left: 0;

		z-index: -1;

		opacity: 1;
	}

	heading.hover-off, 
	icon.hover-off {
		opacity: 0;

		transition: opacity 0.2s var(--ease-slow-slow);
	}

	container.button:hover heading.hover-off, 
	container.button:hover icon.hover-off {
		opacity: 1;
	}
</style>

