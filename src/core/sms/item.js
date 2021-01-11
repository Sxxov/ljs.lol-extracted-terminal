import { Item, Factory } from '../blocks/item';
export class SMSItem extends Item {
    constructor() {
        super(...arguments);
        this.from = null;
        this.to = null;
        this.content = null;
    }
}
export class SMSItemFactory extends Factory {
    static from(result) {
        return new SMSItem().combine(result);
    }
}
//# sourceMappingURL=item.js.map