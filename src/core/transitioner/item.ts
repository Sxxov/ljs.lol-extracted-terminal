import { quintInOut } from 'svelte/easing';
import { Item, Factory } from '../blocks/item';

export type TransitionCSSString = string;

export class TransitionerResultItem extends Item<TransitionerResultItem> {
	delay = 0;
	duration = 200;
	easing = quintInOut;
	css: (time: number, invertedTime: number) => TransitionCSSString = (() => {}) as any;
	tick: (time: number, invertedTime: number) => void = undefined;
}

export class TransitionerResultItemFactory extends Factory<TransitionerResultItemFactory> {
	public static from(result: Partial<TransitionerResultItem>): TransitionerResultItem {
		return new TransitionerResultItem().combine(result);
	}
}
