export class SMSContact {
	private static registeredContactsLength = 0;
	public id = (SMSContact.registeredContactsLength++).toString();

	constructor(public name?: string) {}
}
