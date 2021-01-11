<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import AppBar from '../AppBar.svelte';
	import { CSSUtility } from '../../../resources/utilities';

	// @export
	export let expandedHeightWritable = writable(0);
	export let scrolledHeightWritable = writable(0);
	export let baseHeightWritable = writable(0);

	export let mininumPadding = 8;

	let componentDomContent = null;
	let computedPaddingWritable = null;
	let appBar = null;
	const appBarPaddingWritable = writable(0);
	const scrollYWritable = writable(0);

	onMount(() => {
		computedPaddingWritable = appBar.computedPaddingWritable;
		expandedHeightWritable = appBar.expandedHeightWritable;
	});

	window.addEventListener(
		'scroll',
		() => {
			scrollYWritable.set(
				(() => {
					if ($computedPaddingWritable === null) {
						return window.scrollY;
					}

					if ($computedPaddingWritable * 2 - window.scrollY < 0) {
						return $computedPaddingWritable * 2;
					}

					return window.scrollY;
				})(),
			);
		},
		{
			passive: true,
		},
	);

	$: scrolledHeightWritable.set($expandedHeightWritable - $scrollYWritable);
	$: appBarPaddingWritable.set(`calc(var(--padding) - (${$scrollYWritable}px / 2)) var(--padding)`);
</script>

<component
	bind:this={componentDomContent}
>
	<AppBar
		contentPadding='{CSSUtility.parse(mininumPadding)} 0'
		bind:this={appBar}
		bind:baseHeightWritable
		{appBarPaddingWritable}
		{...$$restProps}
	>
		<slot />
	</AppBar>
</component>

<style>
	/* component {
		padding: 
			var(--scroll-top-padding)
			var(--padding);

		position: fixed;
		top: 0;
		width: calc(100% - var(--padding) * 2);
		z-index: 1;

		height: auto;

		display: grid;
		grid-template-columns: min-content auto;
		grid-template-rows: auto;

		background: var(--colour-background-secondary);
	}

	container.content {
		justify-self: right;
	}

	container.logo {
		padding: calc((var(--scroll-minimum-padding) / 2) + 0.5rem) 0;
	}

	heading {
		font-size: 1.5rem;
		line-height: 3rem;
		padding: calc(var(--scroll-minimum-padding) / 2) 0;
	} */
</style>