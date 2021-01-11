// eslint-disable-next-line import/named
import { CompatiblerResultItem, CompatiblerResultItemFactory } from './compatibler/item';
import { IncompatibleError } from '../resources/errors';

export * from './compatibler/item';

export class Compatibler {
	public static test(): CompatiblerResultItem {
		return CompatiblerResultItemFactory.from({
			// use functions to calculate final result
			// because getters aren't enumerable
			common: {
				BaseSupportVersion: 'noModule' in document.createElement('script'),
			},
			// rendering: {
			// 	MediaRecorder: (() => {
			// 		try {
			// 			// @ts-expect-error
			// 			new MediaRecorder(
			// 				new MediaStream(),
			// 				{
			// 					mimeType: 'video/webm; codecs=vp9',
			// 				},
			// 			);

			// 			return true;
			// 		} catch (err) {
			// 			return false;
			// 		}
			// 	})(),
			// 	MediaStream: typeof MediaStream !== 'undefined',
			// },
		});
	}

	public static throw(result: CompatiblerResultItem): void {
		const reason: string = Object.keys(result)
			.map((categoryKey) => {
				const categoryValue = result[categoryKey];
				const prefix = `[${categoryKey}]: `;

				const unsupportedItems: string[] = Object.keys(categoryValue)
					.map(
						(categoryValueKey) => (
							!categoryValue[categoryValueKey]
								? categoryValueKey
								: null
						),
					);

				if (unsupportedItems.join('') === '') {
					return '';
				}

				const unsupportedItemsResult = [];

				unsupportedItems.forEach(
					(unsupportedItem) => (
						unsupportedItem != null
						&& unsupportedItemsResult.push(`${prefix}${unsupportedItem}\n`)
					),
				);

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
