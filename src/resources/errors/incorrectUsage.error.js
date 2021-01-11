import strings from '../strings';
import { ClientError } from './client.error';
export class IncorrectUsageError extends ClientError {
    constructor(options) {
        const { message } = options;
        super({
            message: `${strings.common.errors.INCORRECT_USAGE}${message ? `: ${message}` : ''}`,
        });
    }
}
//# sourceMappingURL=incorrectUsage.error.js.map