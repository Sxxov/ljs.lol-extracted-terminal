export var Modes;
(function (Modes) {
    Modes["START"] = "start";
    Modes["BISECT"] = "bisect";
    Modes["END"] = "end";
})(Modes || (Modes = {}));
export class StringUtility {
    constructor(ctx) {
        this.ctx = ctx;
        this.baseCtx = null;
        this.baseCtx = ctx;
    }
    static bisectBr(string) {
        return new StringUtility(string)
            .br(StringUtility.Modes.BISECT)
            .build();
    }
    build() {
        return this.ctx;
    }
    newLine(position) {
        return this.insertAt('\n', position);
    }
    br(position) {
        return this.insertAt('<br>', position);
    }
    CRLF(position) {
        return this.insertAt('&#13;&#10;', position);
    }
    insertAt(substr, position) {
        this.ctx = `${this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position))}${substr}${this.ctx.substring(this.getPosition(position), this.getModePosition(Modes.END))}`;
        return this;
    }
    getPosition(position) {
        switch (typeof position) {
            case 'string':
                return this.getModePosition(position);
            case 'number':
                return position;
            default:
                return null;
        }
    }
    getModePosition(mode) {
        switch (mode) {
            case Modes.START:
                return 0;
            case Modes.END:
                return this.ctx.length;
            case Modes.BISECT:
                return (() => {
                    const ctxParts = this.baseCtx.split(' ');
                    return this.baseCtx.indexOf(ctxParts[Math.floor(ctxParts.length / 2)]);
                })();
            default:
                return null;
        }
    }
}
StringUtility.Modes = Modes;
//# sourceMappingURL=string.utility.js.map