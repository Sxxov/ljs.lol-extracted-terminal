<script>
	import { writable } from 'svelte/store';
	import { navigatorAppBarExpandedHeight } from '../../resources/stores';
	import { CSSUtility, WindowUtility } from '../../resources/utilities';

	import Image from '../blocks/Image.svelte';
	import Scene from '../blocks/Scene.svelte';
	import CallToAction from '../components/CallToAction.svelte';
	import Collage from '../components/Collage.svelte';
	import Footer from '../components/Footer.svelte';

	const { innerWritable } = WindowUtility;
	$: inner = $innerWritable;
	const meImageHeightWritable = writable(0);
	$: meImageHeightWritable.set(inner.height - $navigatorAppBarExpandedHeight);
</script>

<Scene
	isInAnimated={true}
	isOutAnimated={true}
	isPadded={false}
	align='center'
	justify='center'
>
	<container
		class='me image'
		style='
			--height: {CSSUtility.parse($meImageHeightWritable)}
		'
	>
		<Image
			heightWritable={meImageHeightWritable}
			src={import('../../raw/img/about/me.jpg')}
		/>
	</container>
	<container
		class='content'
	>
		<container
			class='text'
		>
			<heading>
				hello!
			</heading>
			<string>
				<br>
				it is me, <i>lim jia sheng.</i>
	
				i was born in KL with an ineptitude for self introductions.
				
				the last paragraph i wrote on myself was so brain dead, that it managed to gain sentience just to end the sentence.
				
				so, starting from the top, 
				i like many things.
	
				<quote>
					what things?
				</quote> 
				...you ask.
				— wait wait i'm getting to it
	
				i'm currently doing foundation in design, so that's a clue. 
				all this started when i discovered the stark world of motion design... by motion design i mean spinning text in Cinema 4D.
				i just kept doing it and it kept working, what can i say-?
	
				a slight problem though
				<b>i never wanted to do design.</b>
	
				technology was always the road that i wanted to swim in instead of the "russian air space"-esque design path.
	
				<quote>
					why not combine them?
				</quote> 
				...you ask.
				— ayo chill bro; patience my man
	
				i did, and they converge at a point — front end design/development
	
				as you can see i designed and developed this website, using svelte, typescript, and good old pain.
				actually basically 100% pain. f*ck rollup.
	
				<quote>
					why'd you censor that?
				</quote> 
				...you ask.
				because i'm tryna be edgy while having an audience with the sharpness of a UV sphere.
				
				thus in conclusion, f*ck you, and therefore your kids.
	
				now shoo go look at my portfolio or something more productive, eg. a wall.
			</string>
		</container>
		<Collage
			isImageExcluded={true}
		/>
	</container>
	<CallToAction />
	<Footer />
</Scene>

<style>
	container.me.image {
		width: 100%;
		height: 100%;
		padding: var(--padding);
		box-sizing: border-box;
	}

	container.content {
		width: 100%;
		display: grid;
		
		grid-template-columns: min(100%, 512px) 1fr;
		grid-auto-rows: min-content;
		gap: var(--padding);

		padding: 0 var(--padding) var(--padding) var(--padding);
		box-sizing: border-box;
	}

	container.content > container.text {
		width: 100%;
	}

	container.content > container.text string {
		line-height: 2em;

		white-space: pre-line;
	}
</style>