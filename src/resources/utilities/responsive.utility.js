import { Store } from '../../core/store';
var ResponsiveClasses;
(function (ResponsiveClasses) {
    ResponsiveClasses["MOBILE"] = "mobile";
    ResponsiveClasses["TABLET"] = "tablet";
    ResponsiveClasses["POTATO"] = "potato";
    ResponsiveClasses["DESKTOP"] = "desktop";
})(ResponsiveClasses || (ResponsiveClasses = {}));
var ResponsiveBreakpoints;
(function (ResponsiveBreakpoints) {
    ResponsiveBreakpoints[ResponsiveBreakpoints["MOBILE"] = 0] = "MOBILE";
    ResponsiveBreakpoints[ResponsiveBreakpoints["TABLET"] = 560] = "TABLET";
    ResponsiveBreakpoints[ResponsiveBreakpoints["POTATO"] = 1024] = "POTATO";
    ResponsiveBreakpoints[ResponsiveBreakpoints["DESKTOP"] = 1280] = "DESKTOP";
})(ResponsiveBreakpoints || (ResponsiveBreakpoints = {}));
var ResponsiveStagess;
(function (ResponsiveStagess) {
    ResponsiveStagess[ResponsiveStagess["MOBILE"] = 0] = "MOBILE";
    ResponsiveStagess[ResponsiveStagess["TABLET"] = 1] = "TABLET";
    ResponsiveStagess[ResponsiveStagess["POTATO"] = 2] = "POTATO";
    ResponsiveStagess[ResponsiveStagess["DESKTOP"] = 3] = "DESKTOP";
})(ResponsiveStagess || (ResponsiveStagess = {}));
export class ResponsiveUtility {
    static apply(node) {
        this.nodes.push(node);
        this.refresh(this.nodes.length - 1);
    }
    static refresh(index) {
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
    static setCurrentBreakpointClass(node) {
        this.setClass(ResponsiveClasses[this.currentBreakpointKeyWritable.value], node);
    }
    static setClass(className, node) {
        node.classList.remove(...Object.values(ResponsiveClasses));
        node.classList.add(className);
    }
    static onResize() {
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
ResponsiveUtility.nodes = [];
ResponsiveUtility.isListenerActive = false;
ResponsiveUtility.classes = Object.values(ResponsiveClasses).join(' ');
ResponsiveUtility.Breakpoints = ResponsiveBreakpoints;
ResponsiveUtility.Classes = ResponsiveClasses;
ResponsiveUtility.Stages = ResponsiveStagess;
ResponsiveUtility.currentBreakpointKeyWritable = new Store(null);
ResponsiveUtility.currentBreakpointWritable = new Store(null);
if (!ResponsiveUtility.isListenerActive) {
    ResponsiveUtility.onResize();
    window.addEventListener('resize', ResponsiveUtility.onResize);
    ResponsiveUtility.isListenerActive = true;
}
//# sourceMappingURL=responsive.utility.js.map