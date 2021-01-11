import strings from '../strings';
import { ClientError } from './client.error';
export class PublishError extends ClientError {
    constructor(options) {
        const { message } = options;
        super({
            message: `${strings.common.errors.PUBLISH}${message ? `: ${message}` : ''}`,
        });
    }
}
//# sourceMappingURL=publish.error.js.map