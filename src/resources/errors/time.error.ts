import strings from '../strings';
import { ClientError } from './client.error';

export class TimeError extends ClientError {
	constructor(options: {
		currentTime: string;
		expectedTime: string;
	}) {
		const {
			currentTime,
			expectedTime,
		} = options;

		super({
			message: `${strings.common.errors.TIME}: ${currentTime} !== ${expectedTime}`,
		});
	}
}
