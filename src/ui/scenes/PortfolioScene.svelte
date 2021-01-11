<script>
	import Router, { push } from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';

	import Scene from '../blocks/Scene.svelte';
	import Footer from '../components/Footer.svelte';
	import PortfolioBrowser from '../components/PortfolioBrowser.svelte';
	import PortfolioViewer from '../components/portfolioBrowser/PortfolioViewer.svelte';

	// get rid of warning (wtf)
	export let params = null; params;

	const PREFIX = '/portfolio';
	const CCTSRoutes = {
		'/school/ccts': wrap({
			component: PortfolioBrowser,
			props: {
				keyAndCallbackMap: {
					1: () => href('/school/ccts/1'),
					2: () => href('/school/ccts/2'),
					3: () => href('/school/ccts/3'),
				},
				keyAndPreviewImageMap: {
					1: import('../../raw/img/ccts/1/promo.jpg'),
					2: import('../../raw/img/ccts/2/promo.jpg'),
					3: import('../../raw/img/ccts/3/promo.jpg'),
				},
			},
		}),
		'/school/ccts/1': wrap({
			component: PortfolioViewer,
			props: {
				html: import('../../raw/mdx/ccts/1.mdx'),
			},
		}),
		'/school/ccts/2': wrap({
			component: PortfolioViewer,
			props: {
				html: import('../../raw/mdx/ccts/2.mdx'),
			},
		}),
		'/school/ccts/3': wrap({
			component: PortfolioViewer,
			props: {
				html: import('../../raw/mdx/ccts/3.mdx'),
			},
		}),
	};
	const PhotoRoutes = {
		'/school/photo': wrap({
			component: PortfolioBrowser,
			props: {
				keyAndCallbackMap: {
					1: () => href('/school/photo/1'),
					2: () => href('/school/photo/2'),
					3: () => href('/school/photo/3'),
					4: () => href('/school/photo/4'),
				},
				keyAndPreviewImageMap: {
					1: import('../../raw/img/photo/1/promo.jpg'),
					2: import('../../raw/img/photo/2/promo.jpg'),
					3: import('../../raw/img/photo/3/promo.jpg'),
					4: import('../../raw/img/photo/4/promo.jpg'),
				},
			},
		}),
		'/school/photo/1': wrap({
			component: PortfolioViewer,
			props: {
				html: import('../../raw/mdx/photo/1.mdx'),
			},
		}),
		'/school/photo/2': wrap({
			component: PortfolioViewer,
			props: {
				html: import('../../raw/mdx/photo/2.mdx'),
			},
		}),
		'/school/photo/3': wrap({
			component: PortfolioViewer,
			props: {
				html: import('../../raw/mdx/photo/3.mdx'),
			},
		}),
		'/school/photo/4': wrap({
			component: PortfolioViewer,
			props: {
				html: import('../../raw/mdx/photo/4.mdx'),
			},
		}),
	};
	const Routes = {
		'/': wrap({
			component: PortfolioBrowser,
			props: {
				keyAndCallbackMap: {
					'🏫': () => href('/school'),
					'🏠': () => window.open('https://www.youtube.com/sxxov'),
				},
			},
		}),
		'/school': wrap({
			component: PortfolioBrowser,
			props: {
				keyAndCallbackMap: {
					ccts: () => href('/school/ccts'),
					photo: () => href('/school/photo'),
				},
			},
		}),
		...CCTSRoutes,
		...PhotoRoutes,
	};

	function href(html) {
		push(`${PREFIX}${html}`);
	}
</script>

<Scene
	isInAnimated={true}
	isOutAnimated={true}
	isPadded={false}
	align='center'
	justify='center'
>
	<Router
		prefix={PREFIX}
		routes={Routes}
	/>
	<!-- <CallToAction /> -->
	<Footer />
</Scene>