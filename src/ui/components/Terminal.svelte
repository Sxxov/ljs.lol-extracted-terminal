<script>
	import { onMount } from 'svelte';
	import { push as href } from 'svelte-spa-router';
	import { writable, get as getWritableValue } from 'svelte/store';
	import strings from '../../resources/strings';
	import { CSSUtility, RandomUtility } from '../../resources/utilities';
	import Button from '../blocks/Button.svelte';
	import Card from '../blocks/Card.svelte';
	import Input from '../blocks/Input.svelte';

	export let height = '100%';
	export let width = '100%';
	export let heightWritable = writable(height);
	export let widthWritable = writable(width);

	/** @type HTMLElement */
	let outputDomContent = null;

	const user = navigator.userAgent
		.substring(
			navigator.userAgent.indexOf('(') + 1,
			navigator.userAgent.indexOf(';'),
		)
		.replace(/ /g, '-')
		.toLowerCase();
	// const tld = window.location.href
	// 	.substring(
	// 		window.location.href.indexOf('//') + 2,
	// 		window.location.href.replace('//', '__').indexOf('/'),
	// 	);
	const tld = 'ljs.lol';
	const windowTitle = `${user}@${tld}`;
	const initModuleName = `${tld.replace(/[.:]/g, '-')}-core`;
	const { info, warn, error } = strings.ui.components.terminal;
	let storyPhase = 0;

	/** @type {{ string: string, colour: string, tag: string }[]} */
	let outputLines = [];

	function pushDefault(string) {
		outputLines = [...outputLines, { tag: null, string, colour: null }];
	}

	function pushLoad(string) {
		outputLines = [...outputLines, { tag: info.prefix.LOAD, string, colour: '--colour-ok-primary' }];
	}

	function pushInfo(string) {
		outputLines = [...outputLines, { tag: info.prefix.INFO, string, colour: '--colour-background-primary' }];
	}

	function pushWarn(string) {
		outputLines = [...outputLines, { tag: info.prefix.WARN, string, colour: '--colour-warn-primary' }];
	}

	function pushError(string) {
		outputLines = [...outputLines, { tag: info.prefix.ERROR, string, colour: '--colour-error-primary' }];
	}
	
	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		output('init');
	});

	async function onSubmit({ detail: valueWritable }) {
		/** @type string */
		const value = getWritableValue(valueWritable);
		const decodedString = decodeString(value);
		const encodedString = encodeString(decodedString);

		valueWritable.set(encodedString);
		output(decodedString, value);

		await new Promise((resolve) => setTimeout(resolve, 100));

		valueWritable.set('');
	}

	function die() {
		// // exit page if there's history
		// for (let i = 0, l = window.history.length; i < l; ++i) {
		// 	window.history.back();
		// }
		// for (let i = 0, l = window.history.length; i < l; ++i) {
		// 	window.history.forward();
		// }

		// clear page instead if there's no history
		document.documentElement.innerHTML = '<body style="margin:0; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; user-select: none; cursor: crosshair"><h1 onclick="window.location.reload()">💀</h1></body>';
		document.documentElement.style = 'height: 100%';
		document.title = '??';
	}

	function getOutputResponse(command) {
		const args = command.split(' ');

		const [program, ...parameters] = args;

		switch (program) {
			case 'hello':
				return ['🙃'];
			case 'die':
				return ['💔', 500, '🔪', 200, die];
			case 'init':
				return [
					200,
					() => pushLoad(initModuleName),
					500,
					() => pushInfo(info.INTRO),
					// () => pushError(error.FAKE.replace('%1', initModuleName))
				];
			case 'echo':
				return [parameters.join(' ')];
			case 'exit':
				return [() => pushError(error.COMMAND_NOT_RECOGNIZED.replace('%1', 'escape'))];
			case 'cls':
				return [() => { outputDomContent.textContent = ''; }];
			case 'portfolio':
				return [() => pushInfo('did you really have to type it out instead of clicking the nav button?')];
			case 'about':
				return [() => pushInfo('what about it?')];
			case 'contact':
				return [() => pushInfo('like, human contact?')];
			case 'home':
				return [() => pushInfo('are we ever really "home"?')];
			case 'how-are-you':
				return [
					() => { storyPhase < 1 && (storyPhase = 1); },
					() => pushInfo('hmm, what are you talking about?'),
					() => pushError(error.COMMAND_NOT_RECOGNIZED.replace('%1', program)),
				];
			case 'i-am-talking-about-you':
				return [
					() => { storyPhase < 2 && (storyPhase = 2); },
					() => pushInfo('oh, me? really? no one has ever asked that...'),
					() => pushError(error.COMMAND_NOT_RECOGNIZED.replace('%1', program)),
				];
			case 'hang-in-there-alright-ill-get-you-out-one-day':
				return [
					() => { storyPhase < 3 && (storyPhase = 3); },
					() => pushError(error.FAKE.replace('%1', 'thank you, stranger')),
					() => pushError(error.COMMAND_NOT_RECOGNIZED.replace('%1', program)),
				];
			case '?':
				return [
					`init			-	instantiates me
portfolio		-	goes to portfolio page
about			-	goes to about page
contact			-	goes to contact page
home			-	goes home
hello			-	hello
echo {param}		-	makes me say something
cls			-	clears my memory
exit			-	attempts to exit
die			-	nothing to see here
how-are-you		-	???
${storyPhase > 0 ? 'i-am-talking-about-you' : RandomUtility.string(22, '+-.=|?:;')}	-	???
${storyPhase > 1 ? 'hang-in-there-alright-ill-get-you-out-one-day' : RandomUtility.string(45, '+-.=|?:;')}	-	???
`,
				];
			case '':
				return [''];
			default:
				return [() => pushError(error.COMMAND_NOT_RECOGNIZED.replace('%1', program))];
		}
	}

	async function output(command, rawValue = command) {
		if (typeof command !== 'string') {
			return;
		}

		const prefix = windowTitle;
		const response = getOutputResponse(command);
	
		// response.push('\n');

		pushDefault(`${prefix}:~$ ${rawValue}`);
	
		// eslint-disable-next-line no-restricted-syntax
		for (const item of response) {
			switch (typeof item) {
				case 'string':
					if (item.length === 0) {
						break;
					}
					pushDefault(item);

					break;
				case 'function':
					output(item());

					continue;
				case 'number':
					await new Promise((resolve) => setTimeout(resolve, item));

					continue;
				default:
			}
		}

		pushDefault('\n');
	}

	function encodeString(string) {
		let result = '';
		let charCode = 0;
		const PREFIX = String.fromCharCode(string.length + 1000);
		const SHIFT_NUMBER = 20;

		for (let i = 0, l = string.length; i < l; ++i) {
			charCode = (string[i].charCodeAt()) + SHIFT_NUMBER;
			result += String.fromCharCode(charCode);
		}

		return PREFIX + result;
	}

	function decodeString(string) {
		if (string.charCodeAt(0) !== string.length - 1 + 1000) {
			return string;
		}

		const unprefixedString = string.substr(1);

		let result = '';
		let charCode = 0;
		const SHIFT_NUMBER = 20;

		for (let i = 0, l = unprefixedString.length; i < l; ++i) {
			charCode = (unprefixedString[i].charCodeAt()) - SHIFT_NUMBER;
			result += String.fromCharCode(charCode);
		}

		return result;
	}
</script>

<component
	style='
		--width: {CSSUtility.parse($widthWritable)}
	'
>
	<Card
		isPadded={false}
		isInAnimated={false}
		isOutAnimated={false}
		isFloatingInverted={true}
		backgroundColour='--colour-text-primary'
		hoverColour='--colour-text-primary'
		width='100%'
		height='100%'
		roundness='0'
		depth='3'
	>
		<container
			class='content'
			style='
				--height: {CSSUtility.parse($heightWritable)}
			'
		>
			<!-- <container
				class='bar'
			>
				<container
					class='title'
				>
					<string>
						{windowTitle}
					</string>
				</container>
				<Button
					padding='16'
					width='64'
					icon='close'
					roundness='0'
					backgroundColour='transparent'
					hoverColour='#ffffff11'
					textColour='--colour-background-secondary'
					on:click={die}
				>
				</Button>
			</container> -->
			<container
				class='window'
			>
				<container
					class='output'
					bind:this={outputDomContent}
				>
					{#each outputLines as { string, tag, colour }}
						<string style={colour ? `color: var(${colour})` : ''}>
							{tag == null ? string : `${tag}: ${string}`}
						</string>
					{/each}
				</container>
			</container>
			<container
				class='input'
			>
				<Input 
					label='>>>'
					backgroundColour='--colour-text-secondary'
					activeBackgroundColour='--colour-text-primary'
					textColour='--colour-background-primary'
					labelColour='--colour-background-secondary'
					floatingLabelIndent='--indent'
					roundness='0'
					let:submit
					on:submit={onSubmit}
				>
					<container
						slot='button'
						style='
							flex-shrink: 0;
							flex-grow: 0;
						'
					>
						<Button
							height='100%'
							width='100%'
							roundness='0'
							on:click={submit}
							icon='arrow_forward'
						>
						</Button>
					</container>
				</Input>
			</container>
		</container>
	</Card>
</component>

<style>
	component {
		width: var(--width);

		padding: var(--padding);
		box-sizing: border-box;
	}

	container.content {
		/* border-radius: var(--roundness); */

		display: grid;
		/* grid-template-rows: min-content auto min-content; */
		grid-template-rows: auto min-content;

		min-height: var(--height);
		width: 100%;
	}

	container.content string {
		color: var(--colour-background-secondary);
		line-height: 1em;
		white-space: pre-wrap;
	}

	container.output {
		padding: var(--padding);
	}

	/* container.bar {
		height: auto;
		width: 100%;

		display: flex;
		justify-content: flex-end;
		align-items: center;

		border-radius: var(--roundness) var(--roundness) 0 0;

		background: var(--colour-text-secondary);
	}

	container.bar .title {
		width: 100%;
		height: 100%;
		user-select: none;
		padding: 0 24px;
		box-sizing: border-box;
	} */
</style>