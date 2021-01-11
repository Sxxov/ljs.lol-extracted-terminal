export class SMSContact {
    constructor(name) {
        this.name = name;
        this.id = (SMSContact.registeredContactsLength++).toString();
    }
}
SMSContact.registeredContactsLength = 0;
//# sourceMappingURL=contact.js.map