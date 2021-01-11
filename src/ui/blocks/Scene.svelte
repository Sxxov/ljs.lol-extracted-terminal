<script>
	import strings from '../../resources/strings';
	import {
		CSSUtility,
		ScrollUtility,
	} from '../../resources/utilities';
	import {
		dropIn as dropInRaw,
		dropOut as dropOutRaw,
		noop,
	} from '../../core/transitioner';
	import {
		isSceneOutAnimationRunning,
		isSceneInAnimationRunning,
	} from '../../resources/stores';

	export let columns = 'auto';
	export let rows = 'auto';
	export let gap = '0';
	export let justify = 'start';
	export let align = 'center';
	export let width = 'auto';
	export let height = 'auto';
	export let isPadded = true;
	export let backgroundColour = '--colour-background-primary';
	export let isInAnimated = false;
	export let isOutAnimated = false;

	const dropIn = isInAnimated ? dropInRaw : noop;
	const dropOut = isOutAnimated ? dropOutRaw : noop;

	let componentDomContent = null;
	let isLocalInAnimationRunning = false;

	$: (isInAnimated || isOutAnimated)
		&& componentDomContent
		&& isLocalInAnimationRunning
		&& (
			componentDomContent.style.display = (
				$isSceneOutAnimationRunning
					? 'none'
					: ''
			)
		);
</script>

<component
	in:dropIn
	out:dropOut
	on:introstart={() => {
		isSceneInAnimationRunning.set(isLocalInAnimationRunning = true);
	}}
	on:introend={() => {
		// eslint-disable-next-line no-unused-vars
		isSceneInAnimationRunning.set(isLocalInAnimationRunning = false);
	}}
	on:outrostart={() => {
		isSceneOutAnimationRunning.set(true);

		// ScrollUtility.disable();
	}}
	on:outroend={() => {
		isSceneOutAnimationRunning.set(false);

		// ScrollUtility.enable();
	}}
	style='
		--width: {CSSUtility.parse(width)};
		--height: {CSSUtility.parse(height)};
		--align: {CSSUtility.parse(align)};
		--justify: {CSSUtility.parse(justify)};
	'
	bind:this={componentDomContent}
>
	<container
		class='content'
		style='
			--columns: {columns};
			--rows: {rows};
			--gap: {gap};
			--is-or-not-padding: {isPadded ? "var(--padding)" : "0px"};
			--colour-background: {CSSUtility.parse(backgroundColour)};
		'
	>
		<slot>
			<container class='placeholder'>
				<string>
					{strings.ui.scenes.common.warn.EMPTY_SCENE}
				</string>
			</container>
		</slot>
	</container>
</component>

<style>
	component {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto;

		height: var(--height);
		width: var(--width);

		flex-grow: 1;
		flex-shrink: 0;
	}

	container.content {
		display: grid;
		grid-template-columns: var(--columns);
		grid-template-rows: var(--rows);
		gap: var(--gap);

		justify-items: var(--justify);
		align-items: var(--align);

		width: 100%;
		height: auto;

		background: var(--colour-background);

		padding: var(--is-or-not-padding);
		box-sizing: border-box;

		transition: var(--transition-background-colour);
	}
	
	container.placeholder {
		width: 100%;

		padding: var(--padding);
		box-sizing: border-box;
	}

	container.placeholder > string {
		text-align: center;
	}
</style>