export enum Modes {
	START = 'start',
	BISECT = 'bisect',
	END = 'end',
}

type Position = Modes|number;

export class StringUtility {
	private baseCtx: string = null;
	public static Modes = Modes;

	public static bisectBr(string: string): string {
		return new StringUtility(string)
			.br(StringUtility.Modes.BISECT)
			.build();
	}

	constructor(private ctx: string) {
		this.baseCtx = ctx;
	}

	public build(): string {
		return this.ctx;
	}

	public newLine(position: Position): this {
		return this.insertAt('\n', position);
	}

	public br(position: Position): this {
		return this.insertAt('<br>', position);
	}

	public CRLF(position: Position): this {
		return this.insertAt('&#13;&#10;', position);
	}

	public insertAt(substr: string, position: Position): this {
		this.ctx = `${
			this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position))
		}${
			substr
		}${
			this.ctx.substring(this.getPosition(position), this.getModePosition(Modes.END))
		}`;

		return this;
	}

	private getPosition(position: Position): number {
		switch (typeof position) {
			case 'string':
				return this.getModePosition(position);
			case 'number':
				return position;
			default:
				return null;
		}
	}

	private getModePosition(mode: Modes): number {
		switch (mode) {
			case Modes.START:
				return 0;
			case Modes.END:
				return this.ctx.length;
			case Modes.BISECT:
				return (() => {
					const ctxParts = this.baseCtx.split(' ');

					return this.baseCtx.indexOf(
						ctxParts[
							Math.floor(
								ctxParts.length / 2,
							)
						],
					);
				})();
			default:
				return null;
		}
	}
}
