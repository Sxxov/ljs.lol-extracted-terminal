import { $ } from './$.utility';
export class ScrollUtility {
    static disable() {
        if (ScrollUtility.isDisabled) {
            return;
        }
        $(document.body).css({
            overflow: 'hidden',
            width: '100vw',
        });
        ScrollUtility.isDisabled = true;
    }
    static enable() {
        if (!ScrollUtility.isDisabled) {
            return;
        }
        $(document.body).css({
            overflow: 'unset',
            width: '100%',
        });
        ScrollUtility.isDisabled = false;
    }
    static toY(px) {
        window.scrollTo({
            top: px,
            left: 0,
            behavior: 'smooth',
        });
    }
    static toX(px) {
        window.scrollTo({
            top: 0,
            left: px,
            behavior: 'smooth',
        });
    }
}
ScrollUtility.isDisabled = false;
ScrollUtility.target = document.body;
//# sourceMappingURL=scroll.utility.js.map