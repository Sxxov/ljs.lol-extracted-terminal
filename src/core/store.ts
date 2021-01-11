// copied from svelte's implementation
export class Store {
	public subscribers = [];
	public subscriberQueue = [];
	public value = null;
	public stop = null;

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	constructor(value?: any) {
		this.value = value ?? null;
	}

	private neq(a: unknown, b: unknown): boolean {
		// eslint-disable-next-line no-self-compare, eqeqeq
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	public set(newValue: unknown): void {
		if (this.neq(this.value, newValue)) {
			this.value = newValue;
			if (this.stop) { // store is ready
				const runQueue = !this.subscriberQueue.length;
				for (let i = 0; i < this.subscribers.length; i += 1) {
					const s = this.subscribers[i];
					s[1]();
					this.subscriberQueue.push(s, this.value);
				}
				if (runQueue) {
					for (let i = 0; i < this.subscriberQueue.length; i += 2) {
						this.subscriberQueue[i][0](this.subscriberQueue[i + 1]);
					}
					this.subscriberQueue.length = 0;
				}
			}
		}
	}

	public update(fn: (value: any) => unknown): void {
		this.set(fn(this.value));
	}

	public subscribe(run: (value: any) => void, invalidate = () => {}): Store['unsubscribe'] {
		const subscriber: [(value: any) => void, () => void] = [run, invalidate];
		this.subscribers.push(subscriber);
		if (this.subscribers.length === 1) {
			this.stop = () => {};
		}
		run(this.value);
		return () => {
			this.unsubscribe(subscriber);
		};
	}

	public unsubscribe(subscriber: [(value: any) => void, () => void]): void {
		const index = this.subscribers.indexOf(subscriber);
		if (index !== -1) {
			this.subscribers.splice(index, 1);
		}
		if (this.subscribers.length === 0) {
			this.stop();
			this.stop = null;
		}
	}
}
