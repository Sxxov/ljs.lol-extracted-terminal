<script>
	import Card from '../blocks/Card.svelte';
	import Lottie from '../blocks/Lottie.svelte';
	import Scene from '../blocks/Scene.svelte';

	export let src = null;
	export let animationData = null;
	export let options = null;
</script>

<Card
	isPadded={false}
	{...$$restProps}
>
	<Lottie
		{src}
		{animationData}
		{options}
	/>
	<Scene
		isPadded={true}
		width='100%'
	>
		<slot></slot>
	</Scene>
</Card>