<script>
	import { onMount } from 'svelte';

	import { ScrollAnimator } from '../../resources/animators';
	import { CSSUtility, $ as S } from '../../resources/utilities';

	export let textColour = 'white';
	export let textAlign = 'left';
	export let fontSize = 'min(calc(14vmax + 2rem), 16rem';
	export let lineHeightMultiplier = 0.6;
	export let index = 0;

	const isOutlineProvided = $$slots.outline;
	const isFillProvided = $$slots.fill;

	const totalFrames = 120 * 4;

	let fillDomContent = null;
	let outlineDomContent = null;

	onMount(() => {
		if (isOutlineProvided) {
			createOutline();
		}

		if (isFillProvided) {
			createFill();
		}
	});

	function createFill() {
		const charRevealScrollAnimator = new ScrollAnimator();

		charRevealScrollAnimator.add({
			index: 0,
			type: 'null',
			items: {
				totalFrames,
			},
		});

		separateTextContentIntoSpans(fillDomContent, 'letter');

		fillDomContent.childNodes.forEach((node, childNodeIndex) => {
			// add reveal animations
			charRevealScrollAnimator.add({
				index,
				type: 'null',
				items: {
					totalFrames,
					offset: -((totalFrames
						* (1 - (childNodeIndex) / (fillDomContent.childNodes.length - 1))
					)) / 4,
					bezier: [0.75, 0, 0.25, 1],
					onHidden: (animation) => {
						animation.items.onFrame(animation, 0);
					},
					onFrame: (animation, frame) => {
						const domContent = S(node);

						domContent.css({
							transform: `translateY(${
								(
									((childNodeIndex) % 2 ? 1 : -1)
									* (frame)
									* 2
								)
								/ window.devicePixelRatio
							}px)`,
							opacity: Number(frame < 239),
						});
					},
				},
			});
		});
	}

	function createOutline() {
		const revealScrollAnimator = new ScrollAnimator();

		separateTextContentIntoSpans(outlineDomContent, 'letter');

		revealScrollAnimator.add({
			index: 0,
			type: 'null',
			items: {
				totalFrames,
			},
		});

		outlineDomContent.childNodes.forEach((node, childNodeIndex) => {
			// add reveal animations
			revealScrollAnimator.add({
				index,
				type: 'null',
				items: {
					totalFrames,
					offset: -((totalFrames
						* ((childNodeIndex) / (outlineDomContent.childNodes.length - 1))
					)) / 2,
					bezier: [0.75, 0, 0.25, 1],
					onHidden: (animation) => {
						animation.items.onFrame(animation, 0);
					},
					onFrame: (animation, frame) => {
						const domContent = S(node);

						domContent.css({
							transform: `translateX(-${
								(frame) * 2
							}px)`,
							opacity: Number(frame < 239),
						});
					},
				},
			});
		});
	}

	function separateTextContentIntoSpans(domContent, mode) {
		const {
			textContent,
			className,
		} = domContent;

		domContent.textContent = '';

		let processedTextContent = null;

		switch (mode) {
			case 'letter': {
				processedTextContent = textContent
					.trim() // remove whitespace & newlines, at the end of string
					.replace(/[\t\v ]/g, '') // remove only whitespace, wthin string
					.replace(/\n\n/g, '\n') // combine double newlines
					.split('');
				break;
			}
			case 'block': {
				processedTextContent = textContent
					.trim() // remove whitespace & newlines, at the end of string
					.replace(/\n/g, '__split__\n') // add split point
					.split('__split__');
				break;
			}
			default:
				return;
		}

		// split into spans
		processedTextContent.fastEach((titleChar) => {
			if (titleChar.replace(/[\t\v ]/g, '') === '\n') {
				const brDom = document.createElement('br');

				domContent.appendChild(brDom);

				return;
			}

			const spanDom = document.createElement('span');

			spanDom.className = `${className} char`;
			spanDom.textContent = titleChar;

			domContent.appendChild(spanDom);
		});
	}
</script>

<component
	style='
		--colour-text: {CSSUtility.parse(textColour)};
		--align-text: {CSSUtility.parse(textAlign)};
		--font-size: {CSSUtility.parse(fontSize)};
		--line-height: calc({CSSUtility.parse(fontSize)} * {lineHeightMultiplier});
	'
>
	<!-- jank, too bad -->
	{#if isFillProvided}
		<heading 
			class='fill'
			bind:this={fillDomContent}
		>
			<slot name='fill'></slot>
		</heading>
	{/if}
	{#if isOutlineProvided}
		<heading 
			class='outline'
			bind:this={outlineDomContent}
		>
			<slot name='outline'></slot>
		</heading>
	{/if}
	<!-- default slot to suppress https://github.com/sveltejs/svelte/issues/4546 -->
	<slot />
</component>

<style>
	component {
		height: min-content;
		width: 100%;

		padding: calc(var(--padding) / 2);
		box-sizing: border-box;

		user-select: none;
		pointer-events: none;

		margin-bottom: calc(-2 * var(--line-height));
	}

	@media only screen and (max-width: 1024px) {
		component {
			margin-bottom: 0;
		}
	}

	heading {
		white-space: pre-line;
		
		font-size: var(--font-size);
		line-height: var(--line-height);
		padding-right: 0.08em;
		/* padding-bottom: 4rem; */
		/* height: var(--height); */

		text-align: var(--align-text);

		word-wrap: break-word;
	}

	heading * {
		display: inline-block;
	}

	heading.fill {
		color: var(--colour-text);
	}

	heading.outline {
		-webkit-text-stroke: 1px var(--colour-text);
		-webkit-text-fill-color: transparent;
	}

	/* container > heading:not(:first-child) {
		margin-top: 4rem;
	} */
</style>