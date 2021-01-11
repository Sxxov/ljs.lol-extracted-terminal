import { $ } from './$.utility';

export class ScrollUtility {
	public static isDisabled = false;

	public static target = document.body;

	public static disable(): void {
		if (ScrollUtility.isDisabled) {
			return;
		}

		$(document.body).css({
			overflow: 'hidden',
			width: '100vw',
		});

		ScrollUtility.isDisabled = true;
	}

	public static enable(): void {
		if (!ScrollUtility.isDisabled) {
			return;
		}

		$(document.body).css({
			overflow: 'unset',
			width: '100%',
		});

		ScrollUtility.isDisabled = false;
	}

	public static toY(px: number): void {
		window.scrollTo({
			top: px,
			left: 0,
			behavior: 'smooth',
		});
	}

	public static toX(px: number): void {
		window.scrollTo({
			top: 0,
			left: px,
			behavior: 'smooth',
		});
	}
}
