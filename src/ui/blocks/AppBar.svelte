<script>
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import Logo from './Logo.svelte';
	import { CSSUtility } from '../../resources/utilities';
	import Spacer from './Spacer.svelte';
	import { dropIn as dropInRaw, dropOut as dropOutRaw, noop } from '../../core/transitioner';

	// @export
	export const expandedHeightWritable = writable(0);
	export let computedPaddingWritable = writable(0);
	export let baseHeightWritable = writable(0);

	export let title = null;
	export let appBarPadding = '--padding';
	export let appBarPaddingWritable = writable(appBarPadding);
	export let contentPadding = 0;
	export let contentPaddingWritable = writable(contentPadding);
	export let isInAnimated = false;
	export let isOutAnimated = false;
	export let backgroundColour = '--colour-background-secondary';

	const dropIn = isInAnimated ? dropInRaw : noop;
	const dropOut = isOutAnimated ? dropOutRaw : noop;

	let appBarContainerDomContent = null;
	let appBarContainerDomContentComputedStyle = {};

	onMount(() => {
		onResize();

		window.addEventListener(
			'resize',
			onResize,
		);
	});

	onDestroy(() => {
		window.removeEventListener(
			'resize',
			onResize,
		);
	});

	function onResize() {
		appBarContainerDomContentComputedStyle = getComputedStyle(appBarContainerDomContent);

		computedPaddingWritable.set(
			Number.parseFloat(
				appBarContainerDomContentComputedStyle.paddingLeft,
			),
		);
		baseHeightWritable.set(
			Number.parseFloat(
				appBarContainerDomContentComputedStyle.height,
			),
		);
		expandedHeightWritable.set(
			Number.parseFloat(
				appBarContainerDomContentComputedStyle.height,
			)
			+ $computedPaddingWritable * 2,
		);

		// if the browser isn't done rendering for some reason
		// *cough* FF
		// defer to next tick
		if (!$computedPaddingWritable
			|| !$baseHeightWritable
			|| !$expandedHeightWritable) {
			setTimeout(onResize, 0);
		}
	}
</script>

<component>
	<container
		class='app-bar'
		bind:this={appBarContainerDomContent}
		style='
			--app-bar-padding: {CSSUtility.parse($appBarPaddingWritable)};
			--content-padding: {CSSUtility.parse($contentPaddingWritable)};
			--colour-background: {CSSUtility.parse(backgroundColour)};
		'
		in:dropIn
		out:dropOut
	>		
		<container
			class='slot'
		>
			<slot name='background' />
		</container>

		<container
			class='content left'
		>
			{#if !title}
				<container class='logo'>
					<Logo
						colour='--colour-text-primary'
					/>
				</container>
			{:else}
				<heading>{title}</heading>
			{/if}
		</container>

		<container 
			class='content right'
		>
			<slot />
		</container>
	</container>

	<Spacer
		heightWritable={expandedHeightWritable}
	/>
</component>

<style>
	container.slot {
		display: flex;
		justify-content: center;
		align-items: center;

		height: 100%;
		width: 100%;

		position: absolute;
		overflow: hidden;
	}

	container.app-bar {
		padding: var(--app-bar-padding);

		position: fixed;
		top: 0;
		width: calc(100% - var(--padding) * 2);
		z-index: 100;

		height: auto;

		display: grid;
		grid-template-columns: min-content auto;
		grid-template-rows: auto;

		background: var(--colour-background);

		transition: var(--transition-background-colour);
	}

	container.content.right {
		justify-self: right;
	}

	container.content {
		padding: var(--content-padding);
	}

	container.logo {
		padding: 0.5rem 0;
	}

	heading {
		font-size: 1.5rem;
		line-height: 3rem;
	}
</style>