<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Router from 'svelte-spa-router';
	import SmoothScroll from 'smoothscroll-for-websites';
	import { navigatorAppBarScrolledHeight, navigatorAppBarExpandedHeight, navigatorAppBarBaseHeight } from './resources/stores';
	import LandingScene from './ui/scenes/LandingScene.svelte';
	import strings from './resources/strings';
	import { Compatibler } from './core/compatibler';
	import { LogUtility, ScrollUtility } from './resources/utilities';
	import NavigatorAppBar from './ui/blocks/appBars/NavigatorAppBar.svelte';
	import ContactScene from './ui/scenes/ContactScene.svelte';
	import AboutScene from './ui/scenes/AboutScene.svelte';
	import PortfolioScene from './ui/scenes/PortfolioScene.svelte';

	Compatibler.throw(Compatibler.test());

	LogUtility.addToContext(window);
	SmoothScroll({
		animationTime: 500,
		touchpadSupport: false,
		pulseScale: 6,
	});

	let mainDomContent = null;
	let scrolledHeightWritable = writable(0);
	let expandedHeightWritable = writable(0);
	let baseHeightWritable = writable(0);

	$: navigatorAppBarScrolledHeight.set($scrolledHeightWritable);
	$: navigatorAppBarExpandedHeight.set($expandedHeightWritable);
	$: navigatorAppBarBaseHeight.set($baseHeightWritable);

	// const GlobalProps = {
	// 	appBarScrolledHeightWritable,
	// 	appBarBaseHeightWritable,
	// };
	const Paths = [
		'/',
		'/portfolio',
		'/about',
		'/contact',
		'/portfolio/*',
	];
	const Routes = {
		[Paths[0]]: LandingScene,
		[Paths[1]]: PortfolioScene,
		[Paths[2]]: AboutScene,
		[Paths[3]]: ContactScene,
		[Paths[4]]: PortfolioScene,
	};
	window.RouteNames = {
		[Paths[0]]: strings.common.routes.info.HOME,
		[Paths[1]]: strings.common.routes.info.PORTFOLIO,
		[Paths[2]]: strings.common.routes.info.ABOUT,
		[Paths[3]]: strings.common.routes.info.CONTACT,
	};
	const { RouteNames } = window;

	onMount(() => {
		ScrollUtility.target = mainDomContent;
	});
</script>

<main
	bind:this={mainDomContent}
>
	<NavigatorAppBar
		bind:scrolledHeightWritable
		bind:expandedHeightWritable
		bind:baseHeightWritable
		routes={RouteNames}
		backgroundColour='--colour-background-primary'
		hoverColour='--colour-background-secondary'
	/>
	<Router
		routes={Routes}
	/>
</main>

<style>
	main {
		height: 100%;
		background: var(--colour-background-primary);

		transition: var(--transition-background-colour);
	}
</style>