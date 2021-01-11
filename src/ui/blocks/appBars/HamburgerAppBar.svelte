<script>
	import { writable } from 'svelte/store';
	import Hamburger from '../Hamburger.svelte';
	import ScrollableAppBar from './ScrollableAppBar.svelte';

	// @export
	export let expandedHeightWritable = writable(0);
	export let scrolledHeightWritable = writable(0);
	export let baseHeightWritable = writable(0);

	export let toppings = null;
</script>

<ScrollableAppBar
	bind:expandedHeightWritable
	bind:scrolledHeightWritable
	bind:baseHeightWritable
	{...$$restProps}
>
	<container>
		<Hamburger
			{toppings}
			buttonSize='calc(2rem + 32px)'
			menuTopOffsetWritable={scrolledHeightWritable}
		/>
	</container>
</ScrollableAppBar>

<style>
	container {
		/* width: calc(2rem + 32px); */
		/* --scroll-minimum-padding is defined on parent */
		height: 100%;
		padding: calc((var(--scroll-minimum-padding) / 2) + 0.5rem) 0;
		box-sizing: border-box;
	}
</style>