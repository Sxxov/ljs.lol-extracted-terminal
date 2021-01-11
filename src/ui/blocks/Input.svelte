<script>
	import {
		onMount,
		createEventDispatcher,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import { RandomUtility, CSSUtility } from '../../resources/utilities';
	import Button from './Button.svelte';
	import Hint from './Hint.svelte';
	import { Shadow } from '../../core/shadow';

	// @export
	export let valueWritable = writable('');
	export let value = $valueWritable;
	export function focus() {
		inputDomContent.focus();
	};
	export function submit() {
		dispatch('submit', valueWritable);
	}
	
	export let label = 'Input';
	export let buttonComponent = Button;
	export let buttonProps = {};
	export let hintLevelWritable = writable(0);
	export let hintWritable = writable(null);
	export let depth = 3;
	export let roundness = 'var(--roundness)';
	export let height = 56;
	export let width = '100%';
	export let buttonWidth = height;
	export let fontSize = '1rem';
	export let labelTop = 28;
	export let minIndent = 16;
	export let indent = 'max(var(--min-indent), var(--roundness))';
	export let backgroundColour = '--colour-background-secondary';
	export let activeBackgroundColour = '--colour-background-primary';
	export let textColour = '--colour-text-primary';
	export let labelColour = '--colour-text-secondary';
	export let floatingLabelIndent = '0';

	const dispatch = createEventDispatcher();

	const selfId = RandomUtility.int();
	let isActive = false;
	let formDomContent = null;
	let inputDomContent = null;

	$: valueWritable.set(value);
	// $: value = $valueWritable;
	valueWritable.subscribe((valueFromValueWritable) => {
		value = valueFromValueWritable;
	});

	onMount(() => {
		Shadow.apply(depth, formDomContent);
	});
</script>

<component
	style='
		--border-radius: {CSSUtility.parse(roundness)};
		--width: {CSSUtility.parse(width)};
		--height: {CSSUtility.parse(height)};
		--font-size: {CSSUtility.parse(fontSize)};
		--label-top: {CSSUtility.parse(labelTop)};
		--min-indent: {CSSUtility.parse(minIndent)};
		--indent: {CSSUtility.parse(indent)};
		--button-width: {CSSUtility.parse(buttonWidth)};
	'
>
	<form 
		class='{isActive ? '' : 'inactive'} {value ? 'valued' : ''}'
		onsubmit='return false'
		bind:this={formDomContent}
		style='
			--active-colour-background: {CSSUtility.parse(activeBackgroundColour)};
			--colour-background: {CSSUtility.parse(backgroundColour)}
		'
	>
		<input
			type='text'
			id={selfId}
			class='text'
			placeholder={label}
			bind:value
			bind:this={inputDomContent}
			on:focus={() => { isActive = true; }}
			on:blur={() => { isActive = false; }}
			style='
				--colour-text: {CSSUtility.parse(textColour)};
			'
		>
		<label
			for='{selfId}'
			style='
				--colour-label: {CSSUtility.parse(labelColour)};
				--floating-label-indent: {CSSUtility.parse(floatingLabelIndent)};
			'
		>
			<string>
				{label}
			</string>
		</label>
		<slot 
			name='button'
			{submit}
		>
			{#if buttonComponent}
				<container
					class='button'
				>
					<svelte:component
						this={buttonComponent}
						height='100%'
						width='100%'
						on:click={submit}
						{...buttonProps}
					></svelte:component>
				</container>
			{:else}
				<button
					style='display: none'
					on:click={submit}
				></button>
			{/if}
		</slot>
	</form>
	{#if $hintWritable !== null}
		<Hint levelWritable={hintLevelWritable}>{$hintWritable}</Hint>
	{/if}
</component>

<style>
	component {
		position: relative;
		/* padding: var(--label-top-position) 0 0; */
		width: 100%;
	}

	form {
		display: flex;

		transform: matrix(1, 0, 0, 1, 0, 0);

		background: var(--colour-background);
		box-shadow: var(--shadow-inactive);

		margin: 0;

		border-radius: var(--border-radius);

		transition: 0.2s var(--ease-slow-slow);
	}

	form:not(.inactive) {
		background: var(--active-colour-background);
		box-shadow: var(--shadow);

		margin: var(--label-top) 0 0 0;
	}

	form.valued {
		margin: var(--label-top) 0 0 0;
	}

	input.text {
		width: 100%;
		height: var(--height);

		padding: 0;
		border: 0;
		outline: 0;

		background: transparent;

		font-family: var(--font-family-2);
		font-variation-settings: var(--font-variation-regular);

		/* for browsers that doesn't support the default value with 'max()' */
		padding: 0 var(--min-indent);
		padding: 0 var(--indent);

		font-size: var(--font-size);
		line-height: 0.9em;
		letter-spacing: -0.08em;
		color: var(--colour-text);

		transition: 0.2s var(--ease-slow-slow);
	}

	/* input.text:focus {
		font-variation-settings: var(--font-variation-bold);
	} */
	
	input.text::placeholder {
		color: transparent;
	}

	input.text:placeholder-shown ~ label {
		font-size: var(--font-size);
		line-height: var(--font-size);

		/* for browsers that doesn't support the default value with 'max()' */
		text-indent: var(--min-indent);
		text-indent: var(--indent);

		cursor: text;
		top: calc(var(--height) / 2 - (var(--font-size) / 2));
	}

	label {
		position: absolute;
		top: calc(0px - var(--label-top));
		display: block;

		/* font-family: var(--font-family-2);
		font-variation-settings: var(--font-variation-regular); */
		text-indent: var(--floating-label-indent);
		font-size: 1rem;
		line-height: 1rem;
		

		transition: 0.2s var(--ease-slow-slow);
	}

	label > string {
		color: var(--colour-label);
		display: inline;
	}

	input.text:focus ~ label {
		position: absolute;
		top: calc(0px - var(--label-top));
		display: block;

		/* font-variation-settings: var(--font-variation-bold); */
		text-indent: var(--floating-label-indent);
		font-size: 1rem;
		color: var(--colour-accent-primary);
	}

	/* reset input */
	input.text:required, input.text:invalid {
		box-shadow: none;
	}

	container.button {
		width: var(--button-width);
	}
</style>