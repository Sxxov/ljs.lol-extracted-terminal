import { Item, Factory } from '../blocks/item';

export class CompatiblerResultItem extends Item<CompatiblerResultItem> {
	common = {
		BaseSupportVersion: false,
	};
	// rendering = {
	// 	MediaRecorder: false,
	// 	MediaStream: false,
	// };
}

export class CompatiblerResultItemFactory extends Factory<CompatiblerResultItemFactory> {
	public static from(result: Partial<CompatiblerResultItem>): CompatiblerResultItem {
		return new CompatiblerResultItem().combine(result);
	}
}
