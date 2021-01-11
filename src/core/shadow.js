export class Shadow {
    static apply(depth, node) {
        const processedBoxShadow = this.get(depth);
        node
            .style
            .setProperty('--shadow', processedBoxShadow.active);
        node
            .style
            .setProperty('--shadow-inactive', processedBoxShadow.inactive);
    }
    static get(depth) {
        const isDrop = depth > 0;
        const boxShadowProperty = isDrop
            ? '--box-shadow-drop'
            : '--box-shadow-inner';
        const boxShadow = getComputedStyle(document.documentElement)
            .getPropertyValue(boxShadowProperty)
            .trim();
        const boxShadowParts = boxShadow.includes('rgba(')
            ? boxShadow
                .replace(/\)\s*,/g, ')__delim__')
                .split('__delim__')
            : boxShadow
                .split(',');
        const blur = Math.abs(depth) * 20;
        const darkX = blur / 3;
        const darkY = darkX;
        const brightX = -darkX;
        const brightY = brightX;
        const rgba = boxShadowParts.map((boxShadowPart) => {
            const workingRgba = boxShadowPart
                .trim()
                .substr(boxShadowPart
                .trim()
                .indexOf('rgba('));
            const alpha = Number.parseFloat(workingRgba
                .substring(workingRgba.lastIndexOf(',') + 1, workingRgba.lastIndexOf(')'))
                .trim()) * (Math.abs(depth) / 3);
            return `${workingRgba.substr(0, workingRgba.lastIndexOf(',') + 1)} ${alpha})`;
        });
        const darkBoxShadowParts = this.getParts(darkX, darkY, blur, rgba[0]);
        const darkBoxShadowPartsInactive = this.getParts(0, 0, 0, rgba[0]);
        const brightBoxShadowParts = this.getParts(brightX, brightY, blur, rgba[1]);
        const brightBoxShadowPartsInactive = this.getParts(0, 0, 0, rgba[1]);
        const processedBoxShadow = {
            active: this.getProcessedBoxShadow(isDrop, darkBoxShadowParts, brightBoxShadowParts),
            inactive: this.getProcessedBoxShadow(isDrop, darkBoxShadowPartsInactive, brightBoxShadowPartsInactive),
        };
        return processedBoxShadow;
    }
    static getParts(x, y, blur, rgba) {
        return [
            `${x}px`,
            `${y}px`,
            `${blur}px`,
            rgba,
        ];
    }
    static getProcessedBoxShadow(isDrop, darkBoxShadowParts, brightBoxShadowParts) {
        return `${isDrop ? '' : 'inset'} ${darkBoxShadowParts.join(' ')}, ${isDrop ? '' : 'inset'} ${brightBoxShadowParts.join(' ')}`;
    }
}
//# sourceMappingURL=shadow.js.map