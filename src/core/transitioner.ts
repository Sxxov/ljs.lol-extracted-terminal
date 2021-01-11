import {
	backInOut,
	backIn,
	backOut,
	bounceOut,
	bounceInOut,
	bounceIn,
	circInOut,
	circIn,
	circOut,
	cubicInOut,
	cubicIn,
	cubicOut,
	elasticInOut,
	elasticIn,
	elasticOut,
	expoInOut,
	expoIn,
	expoOut,
	quadInOut,
	quadIn,
	quadOut,
	quartInOut,
	quartIn,
	quartOut,
	quintInOut,
	quintIn,
	quintOut,
	sineInOut,
	sineIn,
	sineOut,
} from 'svelte/easing';
import { TransitionerResultItem, TransitionerResultItemFactory } from './transitioner/item';
import { isInAnimationRunning, isOutAnimationRunning } from '../resources/stores';

type Easings = (
	typeof backInOut
	| typeof backIn
	| typeof backOut
	| typeof bounceOut
	| typeof bounceInOut
	| typeof bounceIn
	| typeof circInOut
	| typeof circIn
	| typeof circOut
	| typeof cubicInOut
	| typeof cubicIn
	| typeof cubicOut
	| typeof elasticInOut
	| typeof elasticIn
	| typeof elasticOut
	| typeof expoInOut
	| typeof expoIn
	| typeof expoOut
	| typeof quadInOut
	| typeof quadIn
	| typeof quadOut
	| typeof quartInOut
	| typeof quartIn
	| typeof quartOut
	| typeof quintInOut
	| typeof quintIn
	| typeof quintOut
	| typeof sineInOut
	| typeof sineIn
	| typeof sineOut
)

type TransitionOptions = {
	delay?: number,
	duration?: number,
	easing?: Easings,
}

export * from './transitioner/item';

export class Transitioner {
	private isInRegistered = false;
	private isOutRegistered = false;
	private inIndex = 0;
	private outIndex = 0;
	private inLength = 0;
	private outLength = 0;

	// use arrow functions to keep 'this' bound
	// even if destructured
	public t = (): Partial<TransitionerResultItem> => {
		let index = this.inIndex % this.inLength;

		if (!this.isInRegistered) {
			index = this.inLength++;

			setTimeout(() => {
				this.isInRegistered = true;
			}, 0);
		}

		++this.inIndex;

		return {
			delay: index * 50,
		};
	}

	public tt = (): Partial<TransitionerResultItem> => {
		let index = this.outIndex % this.outLength;

		if (!this.isOutRegistered) {
			index = this.outLength++;

			setTimeout(() => {
				this.isOutRegistered = true;
			}, 0);
		}

		++this.outIndex;

		return {
			delay: index * 50,
		};
	}

	public static noop(): TransitionerResultItem {
		return TransitionerResultItemFactory.from({
			delay: 0,
			duration: 0,
			easing: (t) => t,
			css: () => '',
		});
	}

	public static fade(
		element: Element,
		{
			delay = 0,
			duration = 200,
			easing = quintInOut,
		}: TransitionOptions,
		tick = undefined,
	): TransitionerResultItem {
		const {
			opacity,
		} = getComputedStyle(element);

		return TransitionerResultItemFactory.from({
			delay,
			duration,
			easing,
			css: (t) => `opacity: ${t * +opacity}`,
			tick,
		});
	}

	public static fadeIn(
		element: Element,
		options: TransitionOptions,
	): TransitionerResultItem {
		isInAnimationRunning.set(true);

		return Transitioner.fade(
			element,
			{
				easing: quintOut,
				...options,
			},
			Transitioner.onInTick,
		);
	}

	public static fadeOut(
		element: Element,
		options: TransitionOptions,
	): TransitionerResultItem {
		isOutAnimationRunning.set(true);

		return Transitioner.fade(
			element,
			{
				easing: quintIn,
				...options,
			},
			Transitioner.onOutTick,
		);
	}

	public static dropIn(
		element: Element,
		{
			delay = 0,
			duration = 500,
			easing = expoOut,
		}: TransitionOptions,
	): TransitionerResultItem {
		const computed = getComputedStyle(element);
		const opacity = Number(computed.opacity);
		const transform = computed.transform === 'none'
			? ''
			: computed.transform;

		isInAnimationRunning.set(true);

		return TransitionerResultItemFactory.from({
			delay,
			duration,
			easing,
			css: (t, u) => `
				transform: ${transform} translateY(${u * -20}px);
				opacity: ${opacity * Math.min(t * 2, 1)};
			`,
			tick: Transitioner.onInTick,
		});
	}

	public static dropOut(
		element: Element,
		{
			delay = 0,
			duration = 200,
			easing = expoIn,
		}: TransitionOptions,
	): TransitionerResultItem {
		const computed = getComputedStyle(element);
		const opacity = Number(computed.opacity);
		const transform = computed.transform === 'none'
			? ''
			: computed.transform;

		isOutAnimationRunning.set(true);

		return TransitionerResultItemFactory.from({
			delay,
			duration,
			easing,
			css: (t, u) => `
				transform: ${transform} translateY(${u * -20}px);
				opacity: ${opacity * t};
			`,
			tick: Transitioner.onOutTick,
		});
	}

	private static onInTick(t: number) {
		if (t !== 1) {
			return;
		}

		isInAnimationRunning.set(false);
	}

	private static onOutTick(t: number) {
		if (t !== 0) {
			return;
		}

		isOutAnimationRunning.set(false);
	}
}

export const {
	fade,
	fadeIn,
	fadeOut,
	dropIn,
	dropOut,
	noop,
} = Transitioner;
