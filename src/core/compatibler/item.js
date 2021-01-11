import { Item, Factory } from '../blocks/item';
export class CompatiblerResultItem extends Item {
    constructor() {
        super(...arguments);
        this.common = {
            BaseSupportVersion: false,
        };
        // rendering = {
        // 	MediaRecorder: false,
        // 	MediaStream: false,
        // };
    }
}
export class CompatiblerResultItemFactory extends Factory {
    static from(result) {
        return new CompatiblerResultItem().combine(result);
    }
}
//# sourceMappingURL=item.js.map