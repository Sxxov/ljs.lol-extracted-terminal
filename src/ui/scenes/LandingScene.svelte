<script>
	import { writable } from 'svelte/store';
	import Scene from '../blocks/Scene.svelte';
	import { SMS } from '../../core/sms';
	import contacts from '../../resources/contacts';
	import Lottie from '../blocks/Lottie.svelte';
	import Terminal from '../components/Terminal.svelte';
	import { CSSUtility, RandomUtility, WindowUtility } from '../../resources/utilities';
	import { navigatorAppBarExpandedHeight } from '../../resources/stores';
	import Collage from '../components/Collage.svelte';
	import CallToAction from '../components/CallToAction.svelte';
	import Footer from '../components/Footer.svelte';
	import BackgroundHeading from '../components/BackgroundHeading.svelte';

	const HEADING_CHARSET = '+-.=|?:;';

	const { innerWritable } = WindowUtility;
	$: inner = $innerWritable;

	const sms = new SMS(contacts.DebugScene);
	sms.send(contacts.RenderScene, 'hello!');

	const terminalHeightWritable = writable(0);
	$: terminalHeightWritable.set(inner.height - $navigatorAppBarExpandedHeight);

	let collageHeight = 0;
	let backgroundHeadingDomContent = null;
	let backgroundHeadingHeight = 0;
	$: backgroundHeadingHeight = Number(backgroundHeadingDomContent != null)
		&& window.getComputedStyle(
			backgroundHeadingDomContent,
		).height;

	let animationCurrentFrameWritable = writable(0);
	let animation = null;
	let lottieContainerDomContent = null;

	let scrollY = 0;

	$: onScroll(scrollY);

	function onScroll(y) {
		if (!lottieContainerDomContent) {
			return;
		}

		const { top } = lottieContainerDomContent.getBoundingClientRect();

		const currentFrame = Math.max(
			animation?.totalFrames
			- (
				y / 8
				- top
			),
			-1,
		);
	
		animationCurrentFrameWritable.set(currentFrame);
	}

	function randomize(string) {
		return RandomUtility.string(string.length, HEADING_CHARSET);
	}

	// $: console.log($animationCurrentFrameWritable);
</script>

<svelte:window bind:scrollY />

<Scene
	isPadded={false}
	isInAnimated={true}
	isOutAnimated={true}
>
	<container
		bind:this={backgroundHeadingDomContent}
		class='background-heading'
		style='
			--height: calc({CSSUtility.parse(collageHeight + inner.height)} - var(--padding));
			--height-client: {backgroundHeadingHeight};
		'
	>
		<container>
			<BackgroundHeading
				textAlign='left'
				index=0
			>
				<span slot='fill'>
					<!-- hell -->
					{randomize('hell')}
					<!-- o, -->
					{randomize('o,')}
				</span>
				<span slot='outline'>
					<!-- hey... -->
					{randomize('hey...')}
					<!-- yo! -->
					{randomize('yo!')}
				</span>
			</BackgroundHeading>
		</container>
		<container>
			<BackgroundHeading
				textAlign='right'
				index=1
			>
				<span slot='fill'>
					<!-- what -->
					{randomize('what')}
					<!-- up? -->
					{randomize('up?')}
				</span>
				<span slot='outline'>
					<!-- yeah, -->
					{randomize('yeah,')}
					<!-- you! -->
					{randomize('you!')}
				</span>
			</BackgroundHeading>
		</container>
		<container>
			<BackgroundHeading
				textAlign='left'
				index=2
			>
				<span slot='fill'>
					{randomize('.')}
					<!-- {@html '&nbsp; \n'} -->
					<!-- how -->
					{randomize('how')}
					<!-- does -->
					{randomize('does')}
					<!-- the -->
					{randomize('the')}
					<!-- website -->
					{randomize('website')}
					<!-- look -->
					{randomize('look')}
					<!-- ? -->
					{randomize('?')}
				</span>
			</BackgroundHeading>
		</container>
		<container>
			<BackgroundHeading
				textAlign='right'
				index=3
			>
				<span slot='outline'>
					<!-- this -->
					{randomize('this')}
					<!-- took -->
					{randomize('took')}
					<!-- me -->
					{randomize('me')}
					<!-- way -->
					{randomize('way')}
					<!-- too -->
					{randomize('too')}
					<!-- long -->
					{randomize('long')}
					:*
				</span>
			</BackgroundHeading>
		</container>
	</container>
	
	<container
		class='terminal'
	>
		<Terminal
			heightWritable={terminalHeightWritable}
		/>
	</container>

	<container
		bind:clientHeight={collageHeight}
		class='collage'
	>
		<container 
			class='lottie'
			bind:this={lottieContainerDomContent}
		>
			<Lottie 
				bind:animationCurrentFrameWritable
				bind:animation
				overrideColour='--colour-background-primary'
				animationData={import('../../raw/lottie/blocks.json')}
			/>
		</container>

		<Collage
			minimumColumns='3'
		/>
	</container>

	<CallToAction />

	<Footer />
</Scene>

<style>
	container.lottie {
		width: 100%;
		height: 100vh;
		position: absolute;
		/* top: 0; */

		/* to be above collage, not sure why it's 21 though (collage goes up to 40) */
		z-index: 21;
		/* transform: rotate(180deg); */
	}

	container.collage {
		width: 100%;

		z-index: 0;
	}

	container.terminal {
		height: 100%;
		width: 100%;

		z-index: 2;
	}
	/* container.dialog {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	container.dialog > icon {
		display: block;
		flex-shrink: 0;
		font-size: 1.5rem;
		width: 3rem;
	} */

	container.background-heading {
		z-index: 1;
		/* top: 0; */

		/* height: var(--height); */

		display: flex;
		flex-direction: column;
		justify-content: flex-start;

		position: absolute;

		width: 100%;

		mix-blend-mode: difference;
	}

	/* container.background-heading > container {
		margin-bottom: calc((-1 * ((var(--height-client) - var(--height)) / 4)) * 2);
	} */
</style>