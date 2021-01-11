import strings from '../strings';
import { ClientError } from './client.error';

export class UnsupportedOperationError extends ClientError {
	constructor(options: {
		message: string;
	}) {
		const { message } = options;

		super({
			message: `${strings.common.errors.UNSUPPORTED_OPERATION}${message ? `: ${message}` : ''}`,
		});
	}
}
