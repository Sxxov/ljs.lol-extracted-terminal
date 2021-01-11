import { CoreAnimator } from '../core.animator.js';
import { $ } from '../../utilities/$.utility.js';
export class AnimationFactory {
    constructor(thisArg) {
        this.ctx = thisArg;
    }
    create(options) {
        const baseObject = {
            type: undefined,
            index: undefined,
            data: undefined,
            ...options,
        };
        const baseItemsObject = {
            __caller: this.ctx.constructor,
            __container: options.type === 'null' || options.type === 'meta' ? null : this.createAndReturnNewContainerDom(options),
            __framesBeforeCurrent: this.ctx.getTotalFramesBeforeIndex(options.index || 0),
            uid: Math.round(performance.now()).toString(),
            domContent: null,
            offset: 0,
            disabled: false,
            object: {},
            respectDevicePixelRatio: true,
            totalFrames: null,
            bezier: [0, 0, 1, 1],
            height: {
                maximum: null,
                minimum: null,
            },
            width: {
                maximum: null,
                minimum: null,
            },
            onFrame: () => { },
            onVisible: () => { },
            onHidden: () => { },
            onRedraw: () => { },
            ...options.items,
        };
        return {
            ...baseObject,
            items: baseItemsObject,
        };
    }
    createAndReturnNewContainerDom(animationObject) {
        const animatorContainer = $(document.createElement('div'));
        animatorContainer.addClass([
            CoreAnimator.PREFIX,
            'container',
            Math.round(performance.now()).toString(),
        ]);
        if (animationObject
            .items
            .invert === true) {
            animatorContainer.addClass('invert');
        }
        this.ctx.activate(animatorContainer);
        this.ctx.animatorContainersWrapper.appendChild(animatorContainer);
        this.ctx.animatorContainers.push(animatorContainer);
        return animatorContainer;
    }
}
//# sourceMappingURL=animation.factory.js.map