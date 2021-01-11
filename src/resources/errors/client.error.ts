import strings from '../strings';
import { LogUtility } from '../utilities/log.utility';

export interface ClientError extends Error, LogUtility {}

export class ClientError extends LogUtility.mixClass(Error) {
	constructor(options: {
		message: string;
	}) {
		const message = options.message || strings.common.errors.NO_MESSAGE_PROVIDED;

		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace?.(this, this.constructor);

		LogUtility.error(message, this);
	}
}
