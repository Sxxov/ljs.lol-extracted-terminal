import strings from '../strings';
import { ClientError } from './client.error';
export class JSONParseError extends ClientError {
    constructor(options = {}) {
        const { message } = options;
        super({
            message: `${strings.common.errors.JSON_PARSE}${message ? `: ${message}` : ''}`,
        });
    }
}
//# sourceMappingURL=jsonParse.error.js.map