<script>
	import lottie from 'lottie-web';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';

	// @export
	export let animationCurrentFrameWritable = writable(0);
	/** @type {ReturnType<typeof lottie.loadAnimation>} */
	export let animation = null;

	export let src = '';
	export let animationData = null;
	export let height = '100%';
	export let width = '100%';
	export let options = {};
	export let overrideColour = null;

	let containerDomContent = null;
	let isAnimationCurrentFrameBeingUpdatedInternally = false;
	let isAnimationCurrentFrameBeingUpdatedExternally = false;

	onMount(async () => {
		const json = await Promise.resolve(animationData)
			|| (
				!src
					? {}
					: await (
						await fetch(src)
					).json()
			);

		animation = lottie.loadAnimation({
			container: containerDomContent,
			animationData: json,
			autoplay: true,
			loop: true,
			...options,
		});

		animation.addEventListener('enterFrame', () => {
			if (isAnimationCurrentFrameBeingUpdatedExternally) {
				isAnimationCurrentFrameBeingUpdatedExternally = false;
	
				return;
			}

			isAnimationCurrentFrameBeingUpdatedInternally = true;

			animationCurrentFrameWritable.set(animation.currentRawFrame);
		});
	});

	$: isAnimationCurrentFrameBeingUpdatedInternally
		? isAnimationCurrentFrameBeingUpdatedInternally = false
		: (
			animation?.goToAndStop($animationCurrentFrameWritable),
			(isAnimationCurrentFrameBeingUpdatedExternally = true)
		);
</script>

<component
	style='
		--height: {CSSUtility.parse(height)};
		--width: {CSSUtility.parse(width)};
	'
>
	<container
		bind:this={containerDomContent}
		class='{overrideColour ? 'override' : ''}'
		style='
			--colour-override: {CSSUtility.parse(overrideColour)}
		'
	>
</component>

<style>
	component {
		height: var(--height);
		width: var(--width);

		overflow: hidden;
	}

	container.override :global(*) {
		fill: var(--colour-override);
		stroke: var(--colour-override);
	}

	/* :global(.lottie-player) {
		top: 50%;
    	transform: translateY(-50%);
	} */
</style>