import { $Object } from '../../utilities.types.js';
import {
	LottieObject,
	SolidObject,
} from '../../animator.types.js';

export interface AnimationObject {
	type: string;
	index?: number;
	data?: unknown;
	items?: {
		__caller?: any;
		__container?: $Object | null;
		__framesBeforeCurrent?: number;
		uid?: string;
		domContent?: $Object | null;
		offset?: number;
		disabled?: boolean;
		object?: {
			lottie?: LottieObject;
			solid?: SolidObject;
		};
		respectDevicePixelRatio?: boolean;
		totalFrames?: number | null;
		invert?: boolean;
		bezier?: [number, number, number, number];
		height?: {
			maximum?: number | null;
			minimum?: number | null;
		};
		width?: {
			maximum?: number;
			minimum?: number;
		};
		onFrame?: (animationObject: AnimationObject, frame: number) => void;
		onVisible?: (animationObject: AnimationObject) => void;
		onHidden?: (animationObject: AnimationObject) => void;
		onRedraw?: (animationObject: AnimationObject) => void;
	};
}
