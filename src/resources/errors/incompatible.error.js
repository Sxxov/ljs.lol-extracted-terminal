import strings from '../strings';
import { ClientError } from './client.error';
export class IncompatibleError extends ClientError {
    constructor(options) {
        const { message } = options;
        super({
            message: `${strings.common.errors.INCOMPATIBLE}${message ? `: ${message}` : ''}`,
        });
    }
}
//# sourceMappingURL=incompatible.error.js.map