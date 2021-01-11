export class Item {
    combine(options) {
        Object.keys(options).forEach((optionKey) => { this[optionKey] = options[optionKey]; });
        return this;
    }
}
export class Factory {
}
//# sourceMappingURL=item.js.map