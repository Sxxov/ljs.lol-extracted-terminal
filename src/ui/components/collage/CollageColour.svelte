<script>
	import { CSSUtility } from '../../../resources/utilities';

	const CHOICES = [
		'--colour-background-primary',
		'--colour-background-secondary',
		'--colour-text-primary',
		'--colour-text-secondary',
		'--colour-text-primary',
		'--colour-text-secondary',
		'--colour-accent-primary',
		'--colour-accent-secondary',
	];

	const colour = CHOICES[Math.floor(Math.random() * (CHOICES.length - 1))];
</script>

<container
	style='--colour-background: {CSSUtility.parse(colour)}'
/>

<style>
	container {
		background: var(--colour-background);

		width: 100%;
		height: 100%;
	}
</style>