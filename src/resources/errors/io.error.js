import strings from '../strings';
import { ClientError } from './client.error';
export class IOError extends ClientError {
    constructor(options) {
        const { message, fsError, } = options;
        super({
            message: `${strings.common.errors.IO}${message ? `: ${message}` : ''}\n${fsError?.message ?? ''}\n${fsError?.stack ?? ''}`,
        });
    }
}
//# sourceMappingURL=io.error.js.map