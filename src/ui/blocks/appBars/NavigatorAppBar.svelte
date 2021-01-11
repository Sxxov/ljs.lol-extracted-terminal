<script>
	import { writable } from 'svelte/store';
	import ScrollableAppBar from './ScrollableAppBar.svelte';
	import Navigator from '../Navigator.svelte';

	// @export
	export let expandedHeightWritable = writable(0);
	export let scrolledHeightWritable = writable(0);
	export let baseHeightWritable = writable(0);

	export let backgroundColour = '--colour-background-primary';
	export let hoverColour = '--colour-background-secondary';
	export let textColour = '--colour-text-primary';
	export let rippleColour = '--colour-text-secondary';

	export let routes = null;
</script>

<ScrollableAppBar
	bind:expandedHeightWritable
	bind:scrolledHeightWritable
	bind:baseHeightWritable
	{...$$restProps}
	{backgroundColour}
>
	<container>
		<Navigator
			{routes}
			{backgroundColour}
			{hoverColour}
			{textColour}
			{rippleColour}
			hamburgerProps={{
				buttonSize: 'calc(2rem + 32px)',
				menuTopOffsetWritable: scrolledHeightWritable,
			}}
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