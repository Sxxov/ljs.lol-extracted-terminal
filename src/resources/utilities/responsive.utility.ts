import { Store } from '../../core/store';

enum ResponsiveClasses {
	MOBILE = 'mobile',
	TABLET = 'tablet',
	POTATO = 'potato',
	DESKTOP = 'desktop',
}

enum ResponsiveBreakpoints {
	MOBILE = 0,
	TABLET = 560,
	POTATO = 1024,
	DESKTOP = 1280,
}

enum ResponsiveStagess {
	MOBILE,
	TABLET,
	POTATO,
	DESKTOP,
}

export class ResponsiveUtility {
	private static nodes = [];
	public static isListenerActive = false;
	private static classes = Object.values(ResponsiveClasses).join(' ');
	private static Breakpoints = ResponsiveBreakpoints;
	private static Classes = ResponsiveClasses;
	private static Stages = ResponsiveStagess;
	public static currentBreakpointKeyWritable = new Store(null);
	public static currentBreakpointWritable = new Store(null);

	public static apply(node: HTMLBaseElement): void {
		this.nodes.push(node);

		this.refresh(this.nodes.length - 1);
	}

	private static refresh(index?: number): void {
		const nodesToRefresh = (() => {
			if (index) {
				return [this.nodes[index]];
			}

			return this.nodes;
		})();

		nodesToRefresh.forEach((node) => {
			this.setCurrentBreakpointClass(node);
		});
	}

	private static setCurrentBreakpointClass(node: HTMLBaseElement): void {
		this.setClass(ResponsiveClasses[this.currentBreakpointKeyWritable.value], node);
	}

	private static setClass(className: ResponsiveClasses, node: HTMLBaseElement): void {
		node.classList.remove(...Object.values(ResponsiveClasses));
		node.classList.add(className);
	}

	public static onResize(): void {
		let result = null;

		Object.keys(ResponsiveBreakpoints).forEach((responsiveBreakpointKey) => {
			if (window.innerWidth / devicePixelRatio > ResponsiveBreakpoints[responsiveBreakpointKey]) {
				result = responsiveBreakpointKey;
			}
		});

		if (result === ResponsiveUtility.currentBreakpointKeyWritable.value) {
			return;
		}

		ResponsiveUtility.currentBreakpointKeyWritable.set(result);
		ResponsiveUtility.currentBreakpointWritable.set(ResponsiveBreakpoints[result]);
		ResponsiveUtility.refresh();
	}
}

if (!ResponsiveUtility.isListenerActive) {
	ResponsiveUtility.onResize();
	window.addEventListener('resize', ResponsiveUtility.onResize);

	ResponsiveUtility.isListenerActive = true;
}
