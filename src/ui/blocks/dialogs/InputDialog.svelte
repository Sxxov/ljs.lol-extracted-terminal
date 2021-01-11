<script>
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import Dialog from '../Dialog.svelte';
	import Button from '../Button.svelte';
	import Input from '../Input.svelte';
	import strings from '../../../resources/strings';
	import Spacer from '../Spacer.svelte';
	import AppBarScene from '../scenes/AppBarScene.svelte';

	export let title = 'Input.dialog';
	export let sceneColumns = 'auto';
	export let sceneRows = 'auto';
	export let sceneGap = '0';
	export let depth = 3;
	export let dismissOnClick = false;
	export let isActiveWritable = writable(true);
	export let clearOnDismiss = true;

	const dispatch = createEventDispatcher();
	let dialog = null;
	let input = null;

	$: $isActiveWritable && input?.focus();

	function dismiss() {
		dialog.dismiss();

		if (clearOnDismiss) {
			input.valueWritable.set('');
		}
	}
</script>

<Dialog
	{depth}
	{dismissOnClick}
	{isActiveWritable}
	bind:this={dialog}
>
	<AppBarScene
		{title}
		columns={sceneColumns}
		rows={sceneRows}
		gap={sceneGap}
	>
		<slot></slot>
		<Spacer />
		<Input
			label={title}
			buttonComponent={null}
			bind:this={input}
			on:submit={({ detail: value }) => {
				dismiss();
				dispatch('submit', value);
			}}
		/>
	</AppBarScene>
	<container class='buttons'>
		<Button 
			icon='close'
			width='100%'
			backgroundColour='--colour-background-primary'
			hoverColour='--colour-background-secondary'
			rippleColour='--colour-text-secondary'
			on:click={() => {
				dismiss();
				dispatch('cancel');
			}}
		>
			{strings.common.info.CANCEL}
		</Button>
		<Button 
			icon='adjust'
			width='100%'
			backgroundColour='--colour-ok-primary'
			hoverColour='--colour-ok-secondary'
			rippleColour='--colour-text-secondary'
			on:click={() => input.submit()}
		>
			{strings.common.info.CONFIRM}
		</Button>
	</container>
</Dialog>

<style>
	container.buttons {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		background: var(--colour-background-primary);
	}
</style>