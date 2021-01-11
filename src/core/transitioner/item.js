import { quintInOut } from 'svelte/easing';
import { Item, Factory } from '../blocks/item';
export class TransitionerResultItem extends Item {
    constructor() {
        super(...arguments);
        this.delay = 0;
        this.duration = 200;
        this.easing = quintInOut;
        this.css = (() => { });
        this.tick = undefined;
    }
}
export class TransitionerResultItemFactory extends Factory {
    static from(result) {
        return new TransitionerResultItem().combine(result);
    }
}
//# sourceMappingURL=item.js.map