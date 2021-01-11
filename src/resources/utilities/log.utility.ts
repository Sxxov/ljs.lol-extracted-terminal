// eslint-disable-next-line max-classes-per-file
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface Global {
			__logLevel: number;
		}
	}
}

export class LogUtility {
	public static LOG_LEVEL = {
		DEBUG: 4,
		INFO: 3,
		WARN: 2,
		ERROR: 1,
		NONE: 0,
	}

	public static mixClass(ClassItem: {
		new(...args: any[]);
	}): typeof ProcessedClassItem {
		const ProcessedClassItem = class extends ClassItem {};

		ProcessedClassItem.prototype.debug = LogUtility.debug;
		ProcessedClassItem.prototype.log = LogUtility.log;
		ProcessedClassItem.prototype.warn = LogUtility.warn;
		ProcessedClassItem.prototype.error = LogUtility.error;

		return ProcessedClassItem;
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public static addToContext(ctx: any): void {
		globalThis.__logLevel = globalThis.__logLevel ?? 2;

		ctx.debug = LogUtility.debug;
		ctx.log = LogUtility.log;
		ctx.warn = LogUtility.warn;
		ctx.error = LogUtility.error;
	}

	public static debug(message = '', ctx: any = this): void {
		LogUtility.__boiler({
			message,
			logLevel: LogUtility.LOG_LEVEL.DEBUG,
			printFunction: console.log,
			ctx,
		});
	}

	public static log(message = '', ctx: any = this): void {
		LogUtility.__boiler({
			message,
			logLevel: LogUtility.LOG_LEVEL.INFO,
			printFunction: console.log,
			ctx,
		});
	}

	public static error(message = '', ctx: any = this): void {
		LogUtility.__boiler({
			message,
			logLevel: LogUtility.LOG_LEVEL.ERROR,
			printFunction: console.error,
			ctx,
		});
	}

	public static warn(message = '', ctx: any = this): void {
		LogUtility.__boiler({
			message,
			logLevel: LogUtility.LOG_LEVEL.WARN,
			printFunction: console.warn,
			ctx,
		});
	}

	private static async __boiler({
		message = '',
		logLevel = LogUtility.LOG_LEVEL.INFO,
		printFunction = console.log,
		ctx,
	}): Promise<void> {
		// eslint-disable-next-line no-nested-ternary
		const constructor = getTag(ctx);

		// get the log level name from 'logLevel' as value (eg. { ...VERBOSE: 4 } → 'VERBOSE')
		const [logLevelProperty] = Object.keys(this.LOG_LEVEL)
			.filter((key) => this.LOG_LEVEL[key] === logLevel);

		const currentTime = new Date().toLocaleString();

		const logMessage = `[${currentTime}] [${constructor}/${logLevelProperty}]: ${message}`;

		if (logLevel > globalThis.__logLevel) {
			return;
		}

		printFunction(logMessage);

		function getTag(context: any): string {
			if (typeof context === 'string') {
				return context;
			}

			if (!context?.constructor?.name
				|| context.constructor === LogUtility) {
				return 'null';
			}

			return context.constructor.name;
		}
	}
}
