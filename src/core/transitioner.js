import { expoIn, expoOut, quintInOut, quintIn, quintOut, } from 'svelte/easing';
import { TransitionerResultItemFactory } from './transitioner/item';
import { isInAnimationRunning, isOutAnimationRunning } from '../resources/stores';
export * from './transitioner/item';
export class Transitioner {
    constructor() {
        this.isInRegistered = false;
        this.isOutRegistered = false;
        this.inIndex = 0;
        this.outIndex = 0;
        this.inLength = 0;
        this.outLength = 0;
        // use arrow functions to keep 'this' bound
        // even if destructured
        this.t = () => {
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
        };
        this.tt = () => {
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
        };
    }
    static noop() {
        return TransitionerResultItemFactory.from({
            delay: 0,
            duration: 0,
            easing: (t) => t,
            css: () => '',
        });
    }
    static fade(element, { delay = 0, duration = 200, easing = quintInOut, }, tick = undefined) {
        const { opacity, } = getComputedStyle(element);
        return TransitionerResultItemFactory.from({
            delay,
            duration,
            easing,
            css: (t) => `opacity: ${t * +opacity}`,
            tick,
        });
    }
    static fadeIn(element, options) {
        isInAnimationRunning.set(true);
        return Transitioner.fade(element, {
            easing: quintOut,
            ...options,
        }, Transitioner.onInTick);
    }
    static fadeOut(element, options) {
        isOutAnimationRunning.set(true);
        return Transitioner.fade(element, {
            easing: quintIn,
            ...options,
        }, Transitioner.onOutTick);
    }
    static dropIn(element, { delay = 0, duration = 500, easing = expoOut, }) {
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
    static dropOut(element, { delay = 0, duration = 200, easing = expoIn, }) {
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
    static onInTick(t) {
        if (t !== 1) {
            return;
        }
        isInAnimationRunning.set(false);
    }
    static onOutTick(t) {
        if (t !== 0) {
            return;
        }
        isOutAnimationRunning.set(false);
    }
}
export const { fade, fadeIn, fadeOut, dropIn, dropOut, noop, } = Transitioner;
//# sourceMappingURL=transitioner.js.map