import { IncorrectUsageError } from '../errors/incorrectUsage.error';
import { ClientError } from '../errors/client.error';
import { WindowUtility } from './window.utility';
export class CSSUtility {
    static parse(value) {
        switch (true) {
            case value == null:
                return '0px';
            case value[0] === '-'
                && value[1] === '-':
                return `var(${value})`;
            case this.isNumber(value):
                return `${value}px`;
            default:
                return value;
        }
    }
    static unparse(value, ctx) {
        switch (true) {
            case value == null:
                return 0;
            case this.isNumber(value):
                return Number(value);
            case value[value.length - 1] === '%':
                this.assertCtx(ctx);
                return ctx.clientWidth * (Number.parseFloat(value) / 100);
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
            case value.indexOf('var(--') === 0:
                return this.calc(value, document.documentElement);
            default:
                this.assertCtx(ctx);
                return this.calc(value, ctx);
        }
    }
    static isSingularValue(value, suffix) {
        const regex = new RegExp(`\\d*${suffix}`);
        const regexG = new RegExp(regex, 'g');
        const isSingular = value.match(regexG)?.length === 1;
        const isNumber = this.isNumber(value.replace(regex, ''));
        return isSingular && isNumber;
    }
    static calc(value, ctx) {
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
    static assertCtx(ctx) {
        if (ctx != null) {
            return;
        }
        throw new IncorrectUsageError({
            message: `ctx === ${ctx}`,
        });
    }
    static isNumber(value) {
        return !Number.isNaN(Number(value));
    }
}
//# sourceMappingURL=css.utility.js.map