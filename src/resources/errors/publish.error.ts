import strings from '../strings';
import { ClientError } from './client.error';

export class PublishError extends ClientError {
	constructor(options: {
		message: string;
	}) {
		const { message } = options;

		super({
			message: `${strings.common.errors.PUBLISH}${message ? `: ${message}` : ''}`,
		});
	}
}
