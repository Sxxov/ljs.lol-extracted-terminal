import strings from '../strings';
import { LogUtility } from '../utilities/log.utility';
export class ClientError extends LogUtility.mixClass(Error) {
    constructor(options) {
        const message = options.message || strings.common.errors.NO_MESSAGE_PROVIDED;
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
        LogUtility.error(message, this);
    }
}
//# sourceMappingURL=client.error.js.map