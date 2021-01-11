<script>
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';

	export let x;
	export let y;
	export let sizeIn;
	export let size;
	export let speed;
	export let opacityIn;
	export let fill;

	const rippleSize = tweened(sizeIn, { duration: speed });
	const rippleOpacity = tweened(opacityIn, { duration: speed + (speed * 2.5), easing: expoOut });

	onMount(() => {
		rippleSize.set(size);
		rippleOpacity.set(0);
	});
</script>

<circle style='fill: {fill};' cx="{x}" cy="{y}" r={$rippleSize} opacity={$rippleOpacity}/>