<script>
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';

	export const Directions = {
		HORIZONTAL: 0,
		VERTICAL: 1,
	};

	export let height = 24;
	export let width = 24;

	export let heightWritable = writable(height);
	export let widthWritable = writable(width);
	export let direction = Directions.HORIZONTAL;
</script>

<component
	style='
		--height: calc({
			CSSUtility.parse(
				+(direction === Directions.HORIZONTAL)
				&& $heightWritable,
			)
		} - 1px);
		--width: calc({
			CSSUtility.parse(
				+(direction === Directions.VERTICAL)
				&& $widthWritable,
			)
		} - 1px);
'></component>

<style>
	component {
		height: var(--height);
		width: var(--width);

		user-select: none;
		pointer-events: none;
	}
</style>