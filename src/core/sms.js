import { SMSItemFactory } from './sms/item';
import { SMSContact } from './sms/contact';
import { IncorrectUsageError } from '../resources/errors';
export * from './sms/contact';
export * from './sms/item';
export class SMS {
    constructor(contact) {
        this.contact = contact;
        this.contactIndex = NaN;
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
    sendBroadcast(content) {
        this.send(SMS.BROADCAST_CONTACT, content);
    }
    receiveBroadcast(from, callback = undefined) {
        let realFrom = from;
        let realCallback = callback;
        if (typeof from === 'function'
            && callback === undefined) {
            realFrom = null;
            realCallback = from;
        }
        SMS.callbackGroups[SMS.BROADCAST_INDEX]
            .push(realCallback);
        SMS.dispatchBroadcast(realFrom);
    }
    send(to, content) {
        if (SMS.messageGroups[this.contactIndex] == null) {
            SMS.messageGroups[this.contactIndex] = [];
        }
        SMS.messageGroups[this.contactIndex]
            .push(SMSItemFactory.from({
            to,
            from: this.contact,
            content,
        }));
        SMS.dispatch(this.contact);
    }
    fetch(from) {
        const result = [];
        SMS.messageGroups
            ?.forEach((messageGroup) => {
            const resolvedMessageIndexes = [];
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
    receive(from, callback) {
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
    static dispatch(from) {
        SMS.messageGroups
            ?.forEach((messageGroup) => {
            const resolvedMessageIndexes = [];
            messageGroup
                ?.forEach((message, valueIndex) => {
                if (message.from !== from) {
                    return;
                }
                const { to, } = message;
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
    static dispatchBroadcast(from) {
        SMS.messageGroups
            ?.forEach((messageGroup) => {
            const resolvedMessageIndexes = [];
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
    static trimArray(array) {
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
SMS.BROADCAST_CONTACT = new SMSContact('BROADCAST');
SMS.BROADCAST_INDEX = 0;
SMS.contacts = [
    SMS.BROADCAST_CONTACT,
];
SMS.messageGroups = [
    [],
];
SMS.callbackGroups = [
    [],
];
//# sourceMappingURL=sms.js.map