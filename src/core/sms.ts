import { SMSItem, SMSItemFactory } from './sms/item';
import { SMSContact } from './sms/contact';
import { IncorrectUsageError } from '../resources/errors';

export type SMSCallback = (message: SMSItem) => void | SMSItem;

export * from './sms/contact';
export * from './sms/item';

export class SMS {
	private static readonly BROADCAST_CONTACT = new SMSContact('BROADCAST');
	private static readonly BROADCAST_INDEX = 0;
	private static contacts: SMSContact[] = [
		SMS.BROADCAST_CONTACT,
	];
	private static messageGroups: SMSItem[][] = [
		[],
	];
	private static callbackGroups: SMSCallback[][] = [
		[],
	];
	private contactIndex = NaN;

	constructor(private contact: SMSContact) {
		if (contact === undefined) {
			throw new IncorrectUsageError({
				message: 'contact === undefined',
			});
		}

		if (SMS.contacts.indexOf(this.contact) !== -1) {
			this.contactIndex = SMS.contacts.indexOf(this.contact);

			return;
		}

		SMS.contacts.push(contact);
		SMS.messageGroups.push([]);

		this.contactIndex = SMS.contacts.indexOf(this.contact);
	}

	public sendBroadcast(content: unknown): void {
		this.send(
			SMS.BROADCAST_CONTACT,
			content,
		);
	}

	public receiveBroadcast(callback: SMSCallback): void;
	public receiveBroadcast(from: SMSContact, callback: SMSCallback): void;
	public receiveBroadcast(from: unknown, callback: SMSCallback = undefined): void {
		let realFrom = from as SMSContact;
		let realCallback = callback;

		if (typeof from === 'function'
			&& callback === undefined) {
			realFrom = null;
			realCallback = from as SMSCallback;
		}

		SMS.callbackGroups[SMS.BROADCAST_INDEX]
			.push(realCallback);

		SMS.dispatchBroadcast(realFrom);
	}

	public send(to: SMSContact, content: unknown): void {
		if (SMS.messageGroups[this.contactIndex] == null) {
			SMS.messageGroups[this.contactIndex] = [];
		}

		SMS.messageGroups[this.contactIndex]
			.push(
				SMSItemFactory.from({
					to,
					from: this.contact,
					content,
				}),
			);

		SMS.dispatch(this.contact);
	}

	public fetch(from: SMSContact): SMSItem[] {
		const result: SMSItem[] = [];

		SMS.messageGroups
			?.forEach((messageGroup) => {
				const resolvedMessageIndexes: number[] = [];

				messageGroup
					?.forEach((message, i) => {
						if (message.from !== from) {
							return;
						}

						result.push(message);

						resolvedMessageIndexes.push(i);
					});

				resolvedMessageIndexes.forEach((unneededIndex) => delete messageGroup[unneededIndex]);
				SMS.trimArray(messageGroup);
			});

		return result;
	}

	public receive(from: SMSContact, callback: SMSCallback): void {
		if (from === SMS.BROADCAST_CONTACT) {
			return this.receiveBroadcast(callback);
		}

		if (SMS.callbackGroups[this.contactIndex] == null) {
			SMS.callbackGroups[this.contactIndex] = [];
		}

		SMS.callbackGroups[this.contactIndex]
			.push(callback);

		SMS.dispatch(from);
	}

	private static dispatch(from: SMSContact): void {
		SMS.messageGroups
			?.forEach((messageGroup) => {
				const resolvedMessageIndexes: number[] = [];

				messageGroup
					?.forEach((message, valueIndex) => {
						if (message.from !== from) {
							return;
						}

						const {
							to,
						} = message;

						const targetContactIndex = SMS.contacts.indexOf(to);

						SMS.callbackGroups[targetContactIndex]
							?.forEach((callback) => {
								callback(message);

								resolvedMessageIndexes.push(valueIndex);
							});
					});

				resolvedMessageIndexes.forEach((unneededIndex) => delete messageGroup[unneededIndex]);
				SMS.trimArray(messageGroup);
			});
	}

	private static dispatchBroadcast(from?: SMSContact) {
		SMS.messageGroups
			?.forEach((messageGroup) => {
				const resolvedMessageIndexes: number[] = [];

				messageGroup
					?.forEach((message, valueIndex) => {
						if (from != null
							&& message.from !== from) {
							return;
						}

						if (message.to !== SMS.BROADCAST_CONTACT) {
							return;
						}

						SMS.callbackGroups[SMS.BROADCAST_INDEX]
							?.forEach((callback) => {
								callback(message);

								resolvedMessageIndexes.push(valueIndex);
							});
					});

				resolvedMessageIndexes.forEach((unneededIndex) => delete messageGroup[unneededIndex]);
				SMS.trimArray(messageGroup);
			});
	}

	private static trimArray<T>(array: T[]): void {
		const referenceArray = [...array];

		// go from top to bottom of array
		// stop whenever it's not undefined anymore
		let i = 0;
		while (i < referenceArray.length
			&& referenceArray[i] === undefined) {
			array.shift();

			++i;
		}

		// go from bottom to top of array
		// stop whenever it's not undefined anymore
		let ii = array.length - 1;
		while (ii >= 0
			&& referenceArray[ii] === undefined) {
			array.pop();

			--ii;
		}
	}
}
