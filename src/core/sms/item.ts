import { SMSContact } from './contact';
import { Item, Factory } from '../blocks/item';

export class SMSItem extends Item<SMSItem> {
	from: SMSContact = null;
	to: SMSContact = null;
	content: any = null;
}

export class SMSItemFactory extends Factory<SMSItemFactory> {
	public static from(result: Partial<SMSItem>): SMSItem {
		return new SMSItem().combine(result);
	}
}
