import strings from '../strings';
import { ClientError } from './client.error';
export class NetworkError extends ClientError {
    constructor(options) {
        const { message } = options;
        super({
            message: `${strings.common.errors.NETWORK}${message ? `: ${message}` : ''}`,
        });
    }
}
//# sourceMappingURL=network.error.js.map