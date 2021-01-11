<script>
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import Dialog from '../Dialog.svelte';
	import Button from '../Button.svelte';
	import strings from '../../../resources/strings';
	import AppBarScene from '../scenes/AppBarScene.svelte';

	export let title = 'Ok.dialog';
	export let sceneColumns = 'auto';
	export let sceneRows = 'auto';
	export let sceneGap = '0';
	export let depth = 3;
	export let dismissOnClick = true;
	export let isActiveWritable = writable(true);

	const dispatch = createEventDispatcher();
	let dialogDomContent = null;
</script>

<Dialog
	{depth}
	{dismissOnClick}
	{isActiveWritable}
	bind:this={dialogDomContent}
>
	<AppBarScene
		{title}
		columns={sceneColumns}
		rows={sceneRows}
		gap={sceneGap}
	>
		<slot></slot>
	</AppBarScene>
	<container class='buttons'>
		<Button 
			icon='adjust'
			width='100%'
			backgroundColour='--colour-ok-primary'
			hoverColour='--colour-ok-secondary'
			rippleColour='--colour-text-secondary'
			on:click={() => {
				dialogDomContent.dismiss();
				dispatch('ok');
			}}
		>
			{strings.common.info.OK}
		</Button>
	</container>
</Dialog>

<style>
	container.buttons {
		background: var(--colour-background-primary);
	}
</style>