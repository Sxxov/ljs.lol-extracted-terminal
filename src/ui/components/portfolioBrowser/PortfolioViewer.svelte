<script>
	import { dropIn, dropOut } from '../../../core/transitioner';
	import Scene from '../../blocks/Scene.svelte';

	export let html;

	let contentContainerDomContent = null;
	let resolvedHtml = '';

	(async () => {
		if (html.then) {
			resolvedHtml = (await Promise.resolve(html)).default;

			return;
		}

		resolvedHtml = html;
	})();
</script>

<Scene
	isPadded={false}
	isInAnimated={true}
	isOutAnimated={true}
	width='100%'
>
	<container
		class='all'
	>
		{#if resolvedHtml}
			<container
				class='content'
				in:dropIn
				out:dropOut
				bind:this={contentContainerDomContent}
			>
				{@html resolvedHtml}
			</container>
		{/if}
	</container>
</Scene>

<style>
	container.all {
		height: 100%;
		width: calc(100vw - 17px);

		display: flex;
		justify-content: center;
		align-items: center;

		padding: var(--padding);
		box-sizing: border-box;
	}

	container.content {
		height: 100%;
		/* width: 100%; */
		width: min(100%, 512px);
	}
</style>