// eslint-disable-next-line import/named
import { CompatiblerResultItemFactory } from './compatibler/item';
import { IncompatibleError } from '../resources/errors';
export * from './compatibler/item';
export class Compatibler {
    static test() {
        return CompatiblerResultItemFactory.from({
            // use functions to calculate final result
            // because getters aren't enumerable
            common: {
                BaseSupportVersion: 'noModule' in document.createElement('script'),
            },
        });
    }
    static throw(result) {
        const reason = Object.keys(result)
            .map((categoryKey) => {
            const categoryValue = result[categoryKey];
            const prefix = `[${categoryKey}]: `;
            const unsupportedItems = Object.keys(categoryValue)
                .map((categoryValueKey) => (!categoryValue[categoryValueKey]
                ? categoryValueKey
                : null));
            if (unsupportedItems.join('') === '') {
                return '';
            }
            const unsupportedItemsResult = [];
            unsupportedItems.forEach((unsupportedItem) => (unsupportedItem != null
                && unsupportedItemsResult.push(`${prefix}${unsupportedItem}\n`)));
            return unsupportedItemsResult.join('');
        })
            .join('\n');
        if (reason.trim().length === 0) {
            return;
        }
        throw new IncompatibleError({
            message: reason,
        });
    }
}
//# sourceMappingURL=compatibler.js.map