import strings from '../strings';
import { LogUtility } from '../utilities';
export class ErrorWrapper extends Error {
    constructor(error) {
        const message = error.message || strings.common.errors.NO_MESSAGE_PROVIDED;
        super(message);
        this.name = error.name;
        Error.captureStackTrace(this, this.constructor);
        LogUtility.error(message, this);
    }
}
//# sourceMappingURL=wrapper.error.js.map