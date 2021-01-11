export class Item<T> {
	public combine(options: Partial<T>): T {
		Object.keys(options).forEach((optionKey) => { this[optionKey] = options[optionKey]; });

		return this as any;
	}
}

export class Factory<T> {}
