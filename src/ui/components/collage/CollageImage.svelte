<script>
	import Image from '../../blocks/Image.svelte';

	let src = '';

	(async () => {
		// TODO: not hardcode this shit
		const CHOICES = [
			import('../../../raw/img/collage/0.jpg'),
			import('../../../raw/img/collage/1.jpg'),
			import('../../../raw/img/collage/2.jpg'),
			import('../../../raw/img/collage/3.jpg'),
			import('../../../raw/img/collage/4.jpg'),
			import('../../../raw/img/collage/5.jpg'),
			import('../../../raw/img/collage/6.jpg'),
			import('../../../raw/img/collage/7.jpg'),
			import('../../../raw/img/collage/8.jpg'),
			import('../../../raw/img/collage/9.jpg'),
			import('../../../raw/img/collage/10.jpg'),
			import('../../../raw/img/collage/11.jpg'),
			import('../../../raw/img/collage/12.jpg'),
			import('../../../raw/img/collage/13.jpg'),
			import('../../../raw/img/collage/14.jpg'),
			import('../../../raw/img/collage/15.jpg'),
			import('../../../raw/img/collage/16.jpg'),
			import('../../../raw/img/collage/17.jpg'),
			import('../../../raw/img/collage/18.jpg'),
			import('../../../raw/img/collage/19.jpg'),
			import('../../../raw/img/collage/20.jpg'),
			import('../../../raw/img/collage/21.jpg'),
			import('../../../raw/img/collage/22.jpg'),
			import('../../../raw/img/collage/23.jpg'),
			import('../../../raw/img/collage/24.jpg'),
			import('../../../raw/img/collage/25.jpg'),
			import('../../../raw/img/collage/26.jpg'),
			import('../../../raw/img/collage/27.jpg'),
			import('../../../raw/img/collage/28.jpg'),
			import('../../../raw/img/collage/29.jpg'),
			import('../../../raw/img/collage/30.jpg'),
			import('../../../raw/img/collage/31.jpg'),
			import('../../../raw/img/collage/32.jpg'),
			import('../../../raw/img/collage/33.jpg'),
			import('../../../raw/img/collage/34.jpg'),
			import('../../../raw/img/collage/35.jpg'),
			import('../../../raw/img/collage/36.jpg'),
			import('../../../raw/img/collage/37.jpg'),
			import('../../../raw/img/collage/38.jpg'),
			import('../../../raw/img/collage/39.jpg'),
			import('../../../raw/img/collage/40.jpg'),
			import('../../../raw/img/collage/41.jpg'),
			import('../../../raw/img/collage/42.jpg'),
			import('../../../raw/img/collage/43.jpg'),
			import('../../../raw/img/collage/44.jpg'),
			import('../../../raw/img/collage/45.jpg'),
		];

		src = CHOICES[Math.floor(Math.random() * (CHOICES.length - 1))];
	})();
</script>

{#if src}
	<Image
	{src}
	{...$$restProps}
	/>
{/if}