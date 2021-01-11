<script>
	import { writable } from 'svelte/store';
	import { Shadow } from '../../core/shadow';
	import { CSSUtility } from '../../resources/utilities';
	import { fade, dropIn, dropOut } from '../../core/transitioner';

	export let depth = 3;
	export let dismissOnClick = true;
	export let isActiveWritable = writable(true);
	export let roundness = '--roundness';
	export function dismiss() {
		isActiveWritable.set(false);
	};

	let contentDomContent = null;
	let allDomContent = null;
	let overlayDomContent = null;

	$: contentDomContent && Shadow.apply(depth, contentDomContent);
	$: allDomContent && allDomContent.addEventListener('dismiss', () => overlayDomContent.click());
</script>

{#if $isActiveWritable}
	<component
		in:dropIn
		out:dropOut
		class={$isActiveWritable ? '' : 'inactive'}
		bind:this={allDomContent}
	>
		
			<overlay
				transition:fade
				on:click={() => dismissOnClick && isActiveWritable.set(false)}
				bind:this={overlayDomContent}
			/>
			<container
				bind:this={contentDomContent}
				class='content {$isActiveWritable ? '' : 'inactive'}'
				style='
					--border-radius: {CSSUtility.parse(roundness)};
				'
			>
				<slot></slot>
			</container>
	</component>
{/if}

<style>
	component {
		display: grid;
		align-items: center;
		justify-items: center;

		visibility: visible;

		position: fixed;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 1;

		pointer-events: visible;
	}

	component.inactive {
		pointer-events: none;
	}

	container.content {
		height: min-content;
		width: min-content;

		display: grid;
		grid-template-rows: 1fr min-content;

		/* transform: translateY(0px);
		opacity: 1;
		transition: 
			all 0.3s var(--ease-fast-slow),
			min-height 0s,
			opacity 0s; */

		transform: matrix(1, 0, 0, 1, 0, 0);

		min-width: 480px;
		min-height: 240px;

		overflow: hidden;

		z-index: 2;

		border-radius: var(--border-radius);

		box-shadow: var(--shadow);
	}

	container.content.inactive {
		/* transform: translateY(-20px);
		opacity: 0;

		transition: 
			all 0.2s var(--ease-slow-fast),
			opacity 0.1s 0.1s var(--ease-slow-fast); */

		box-shadow: var(--shadow-inactive);
	}
</style>