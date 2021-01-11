<script>
	import {
		onMount,
		createEventDispatcher,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import { Shadow } from '../../core/shadow';
	import Ripple from './Ripple.svelte';
	import { CSSUtility } from '../../resources/utilities';

	export let backgroundColour = '--colour-accent-primary';
	export let hoverColour = '--colour-accent-secondary';
	export let rippleColour = 'white';
	export let textColour = '--colour-text-primary';
	export let icon = 'done';
	export let iconSize = '1rem';
	export let width = 'max-content';
	export let roundness = '--roundness';
	export let height = 'max(calc(var(--border-radius) * 2), 56px)';
	export let depth = 1;
	export let isText = true;
	export let textAlign = 'center';
	export let padding = '16px max(var(--border-radius), 24px)';

	const speed = 1000;
	const sizeIn = 20;
	const opacityIn = 0.2;
	const dispatch = createEventDispatcher();

	const ripples = (() => {
		const arrayWritable = writable([]);
		return {
			...arrayWritable,
			add: (item) => arrayWritable.update((items) => [...items, item]),
			clear: () => arrayWritable.update(() => []),
		};
	})();

	let componentDomContent;
	const self = {
		domContent: null,
		get width() {
			return +!!self.domContent && self.domContent.offsetWidth;
		},
		get height() {
			return +!!self.domContent && self.domContent.offsetHeight;
		},
		get x() {
			return +!!self.domContent && self.domContent.getBoundingClientRect().x;
		},
		get y() {
			return +!!self.domContent && self.domContent.getBoundingClientRect().y;
		},
	};

	onMount(() => {
		Shadow.apply(-depth, self.domContent);
		Shadow.apply(depth, componentDomContent);
	});

	const coords = { x: 50, y: 50 };

	$: offsetX = Math.abs((self.width / 2) - coords.x);
	$: offsetY = Math.abs((self.height / 2) - coords.y);
	$: deltaX = (self.width / 2) + offsetX;
	$: deltaY = (self.height / 2) + offsetY;
	$: scaleRatio = Math.sqrt((deltaX ** 3) + (deltaY ** 3));
	
	let __touched = false;
	let __timer = null;
	function onMouseDown(event, type) {
		switch (type) {
			case 'touch': {
				__touched = true;
				ripples.add({
					x: event.pageX - self.x,
					y: event.pageY - self.y,
					size: scaleRatio,
				});
	
				break;
			}
			case 'click': {
				if (__touched) {
					__touched = false;

					break;
				}

				ripples.add({
					x: event.clientX - self.x,
					y: event.clientY - self.y,
					size: scaleRatio,
				});

				break;
			}
			default:
		}

		clearTimeout(__timer);
		__timer = setTimeout(() => {
			ripples.clear();
		}, speed + (speed * 2));

		if (!event.currentTarget) {
			return;
		}

		event
			.currentTarget
			.parentElement
			.classList
			.remove('unpressed');
	}

	function onMouseUp(event) {
		if (!event.currentTarget) {
			return;
		}

		event
			.currentTarget
			.parentElement
			.classList
			.add('unpressed');
	}
</script>

<component
	class='unpressed'
	bind:this={componentDomContent}
	style='
		--width: {CSSUtility.parse(width)};
		--height: {CSSUtility.parse(height)};
		--border-radius: {CSSUtility.parse(roundness)};
	'
>
	<container
		class='background'
	>
		<slot name='background' />
	</container>
	<button
		bind:this={self.domContent}
		style='
			--colour-background: {CSSUtility.parse(backgroundColour)};
			--colour-hover: {CSSUtility.parse(hoverColour)};
			--colour-ripple: {CSSUtility.parse(rippleColour)};
			--colour-text: {CSSUtility.parse(textColour)};
			--button-padding: {CSSUtility.parse(padding)};
			--icon-size: {CSSUtility.parse(iconSize)};
			--text-align: {textAlign};
		'
		on:click={() => dispatch('click')}
		on:focus={(event) => event.currentTarget.parentElement.classList.remove('unpressed')}
		on:blur={(event) => event.currentTarget.parentElement.classList.add('unpressed')}
		on:touchstart|passive={(event) => onMouseDown(event.touches[0], 'touch')}  
		on:mousedown={(event) => onMouseDown(event, 'click')}
		on:touchend|passive={(event) => onMouseUp(event)}
		on:mouseup={(event) => onMouseUp(event)}
	>
		<span class='content'>
			{#if isText}
				<icon>
					<slot name='icon'>
						{icon ?? ''}
					</slot>
				</icon>
				<string>
					<slot></slot>
				</string>
			{:else}
				<slot></slot>
			{/if}
		</span>	
		<svg>
			{#each $ripples as ripple}
				<Ripple 
					x='{ripple.x}' 
					y='{ripple.y}' 
					size={ripple.size} 
					{speed} 
					{sizeIn} 
					{opacityIn} 
					fill={rippleColour}
				/>
			{/each}
		</svg>
	</button>
</component>

<style>
	component {
		height: var(--height);
		width: var(--width);

		box-shadow: var(--shadow);

		transform: translateX(0px);

		border-radius: var(--border-radius);

		transition: 0.2s var(--ease-slow-slow);
	}

	component.unpressed {
		box-shadow: var(--shadow-inactive);
	}

	/* component:hover {
		width: calc(var(--width) + 28px);
	} */

	button {
		/* for stupid cunts that don't support 'max()'' */
		height: 56px;
		height: var(--height);
		width: var(--width);

		background: var(--colour-background);

		transform: matrix(1, 0, 0, 1, 0, 0);
		padding: var(--button-padding);

		border: 0;
		outline: none;
		-webkit-tap-highlight-color: transparent;

		cursor: pointer;

		border-radius: var(--border-radius);

		box-shadow: var(--shadow-inactive);

		transition: 0.2s var(--ease-slow-slow);
	}
	
	button:hover {
		background: var(--colour-hover);
	}

	button:active {
		box-shadow: var(--shadow);
	}

	button * {
		color: var(--colour-text);
	}

	.content {
		position: relative;
		height: 100%;
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: var(--text-align);

		margin: 0;
		padding: 0;
		/* z-index: 0; */
	}

	string {
		font-size: 1rem;
		font-variation-settings: var(--font-variation-regular);

		margin: 0;
		user-select: none;
	}

	string:not(:empty) {
		padding-left: 8px;
	}

	icon:empty ~ string {
		padding-left: 0;
	}

	svg {
		height: 100%;
		width: 100%;

		border-radius: var(--border-radius);

		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
	}

	icon {
		font-size: var(--icon-size);
		line-height: var(--icon-size);
	}

	container.background {
		height: 100%;
		width: 100%;

		position: absolute;
	}
</style>