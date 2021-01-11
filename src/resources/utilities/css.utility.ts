import { IncorrectUsageError } from '../errors/incorrectUsage.error';
import { ClientError } from '../errors/client.error';
import { WindowUtility } from './window.utility';

export class CSSUtility {
	public static parse(value: string|number): string|0 {
		switch (true) {
			case value == null:
				return '0px';
			case value[0] === '-'
				&& value[1] === '-':
				return `var(${value})`;
			case this.isNumber(value):
				return `${value}px`;
			default:
				return value as string;
		}
	}

	public static unparse(value: string, ctx?: HTMLElement): number {
		switch (true) {
			case value == null:
				return 0;
			case this.isNumber(value):
				return Number(value);
			case value[value.length - 1] === '%':
				this.assertCtx(ctx);
				return ctx.clientWidth * (Number.parseFloat(value as string) / 100);
			case this.isSingularValue(value, 'px'):
				return Number.parseFloat(value);
			case this.isSingularValue(value, 'vh'):
				return WindowUtility.viewport.height;
			case this.isSingularValue(value, 'vw'):
				return WindowUtility.viewport.width;
			case this.isSingularValue(value, 'vmax'):
				return Math.max(WindowUtility.viewport.height, WindowUtility.viewport.width);
			case this.isSingularValue(value, 'vmin'):
				return Math.min(WindowUtility.viewport.height, WindowUtility.viewport.width);
			case (value as string).indexOf('var(--') === 0:
				return this.calc(value as string, document.documentElement);
			default:
				this.assertCtx(ctx);
				return this.calc(value as string, ctx);
		}
	}

	private static isSingularValue(value: string, suffix: string): boolean {
		const regex = new RegExp(`\\d*${suffix}`);
		const regexG = new RegExp(regex, 'g');
		const isSingular = value.match(regexG)?.length === 1;
		const isNumber = this.isNumber(value.replace(regex, ''));

		return isSingular && isNumber;
	}

	private static calc(value: string, ctx: HTMLElement): number {
		// eslint-disable-next-line dot-notation
		ctx.style['x'] = value;

		// eslint-disable-next-line dot-notation
		const result = Number.parseFloat(getComputedStyle(ctx)['x']);

		// eslint-disable-next-line dot-notation
		ctx.style['x'] = null;

		if (Number.isNaN(result)) {
			throw new ClientError({
				message: 'result === NaN',
			});
		}

		return result;
	}

	private static assertCtx(ctx: HTMLElement): void {
		if (ctx != null) {
			return;
		}

		throw new IncorrectUsageError({
			message: `ctx === ${ctx}`,
		});
	}

	private static isNumber(value: any): boolean {
		return !Number.isNaN(Number(value));
	}
}
