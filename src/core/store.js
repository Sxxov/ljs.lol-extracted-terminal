// copied from svelte's implementation
export class Store {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(value) {
        this.subscribers = [];
        this.subscriberQueue = [];
        this.value = null;
        this.stop = null;
        this.value = value ?? null;
    }
    neq(a, b) {
        // eslint-disable-next-line no-self-compare, eqeqeq
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    set(newValue) {
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
    update(fn) {
        this.set(fn(this.value));
    }
    subscribe(run, invalidate = () => { }) {
        const subscriber = [run, invalidate];
        this.subscribers.push(subscriber);
        if (this.subscribers.length === 1) {
            this.stop = () => { };
        }
        run(this.value);
        return () => {
            this.unsubscribe(subscriber);
        };
    }
    unsubscribe(subscriber) {
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
//# sourceMappingURL=store.js.map