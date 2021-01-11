import strings from '../strings';
import { LogUtility } from '../utilities';

export interface ErrorWrapper extends Error, LogUtility {}

export class ErrorWrapper extends Error {
	constructor(error: Error) {
		const message = error.message || strings.common.errors.NO_MESSAGE_PROVIDED;

		super(message);
		this.name = error.name;
		Error.captureStackTrace(this, this.constructor);

		LogUtility.error(message, this);
	}
}
