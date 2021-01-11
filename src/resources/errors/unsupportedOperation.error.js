import strings from '../strings';
import { ClientError } from './client.error';
export class UnsupportedOperationError extends ClientError {
    constructor(options) {
        const { message } = options;
        super({
            message: `${strings.common.errors.UNSUPPORTED_OPERATION}${message ? `: ${message}` : ''}`,
        });
    }
}
//# sourceMappingURL=unsupportedOperation.error.js.map