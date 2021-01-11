<script>
	import AppBar from '../AppBar.svelte';
	import Scene from '../Scene.svelte';
	import { CSSUtility } from '../../../resources/utilities';

	export let appBarComponent = AppBar;
	export let title = null;
	export let appBarProps = {};
	export let height = 'auto';
	export let width = 'auto';
</script>

<component
	style='
		--height: {CSSUtility.parse(height)};
		--width: {CSSUtility.parse(width)};
	'
>
	<slot name='appBar'>
		<svelte:component
			this={appBarComponent}
			{title}
			{...appBarProps}
		/>
	</slot>
	<Scene
		height='auto'
		width='auto'
		{...$$restProps}
	>
		<slot />
	</Scene>
</component>

<style>
	component {
		display: flex;
		flex-direction: column;

		height: var(--height);
		width: var(--width);
	}
</style>