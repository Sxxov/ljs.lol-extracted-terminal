import strings from '../strings';
import { ClientError } from './client.error';
export class TimeError extends ClientError {
    constructor(options) {
        const { currentTime, expectedTime, } = options;
        super({
            message: `${strings.common.errors.TIME}: ${currentTime} !== ${expectedTime}`,
        });
    }
}
//# sourceMappingURL=time.error.js.map