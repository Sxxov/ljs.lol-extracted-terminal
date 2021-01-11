<script>
	import { writable } from 'svelte/store';
	import { navigatorAppBarExpandedHeight } from '../../resources/stores';
	import { CSSUtility, WindowUtility } from '../../resources/utilities';
	import { dropIn } from '../../core/transitioner';
	import Button from '../blocks/Button.svelte';

	import Scene from '../blocks/Scene.svelte';
	import Footer from '../components/Footer.svelte';

	const IS_WORTHY_KEY = 'isWorthy';
	const ENEMY_STATE_BY_DAMAGE_ACCUMULATED = [
		'👿',
		'💀',
		'🌟',
		'💔',
	];
	let isGameOver = null;
	let damageAccumulated = null;
	let currentEnemyState = null;

	if (localStorage.getItem(IS_WORTHY_KEY) === 'true') {
		isGameOver = true;
	} else {
		reset();
	}
	// const totalEnemyNumber = GAME_ENEMY_NUMBERS.reduce(
	// 	(accumulated, enemyNumber) => accumulated + enemyNumber,
	// );
	// let isGameOver = false;
	// const currentLevelIndexWritable = writable(-1);
	// const currentLevelKilledEnemiesWritable = writable(0);
	// const currentLevelContentWritable = writable('');
	
	const { innerWritable } = WindowUtility;
	$: inner = $innerWritable;
	const emailHeadingHeightWritable = writable(0);
	$: emailHeadingHeightWritable.set(inner.height - $navigatorAppBarExpandedHeight);

	// $: $currentLevelKilledEnemiesWritable >= GAME_ENEMY_NUMBERS[$currentLevelIndexWritable]
	// 	&& nextLevel();

	// nextLevel();

	// function nextLevel() {
	// 	currentLevelKilledEnemiesWritable.set(0);
	// 	currentLevelIndexWritable.update((value) => value + 1);
	// 	currentLevelContentWritable.set(
	// new Array(GAME_ENEMY_NUMBERS[$currentLevelIndexWritable])
	// 	.fill('💀')
	// );
	// 	if ($currentLevelIndexWritable > GAME_ENEMY_NUMBERS.length - 1) {
	// 		isGameOver = true;
	// 	}
	// }

	function damage() {
		++damageAccumulated;

		if (damageAccumulated > ENEMY_STATE_BY_DAMAGE_ACCUMULATED.length - 1) {
			isGameOver = true;
			localStorage.setItem(IS_WORTHY_KEY, 'true');
		}

		currentEnemyState = ENEMY_STATE_BY_DAMAGE_ACCUMULATED[damageAccumulated];
	}

	function reset() {
		localStorage.setItem(IS_WORTHY_KEY, 'false');
	
		isGameOver = false;
		damageAccumulated = -1;
		currentEnemyState = '';

		damage();
	}
</script>

<Scene
	isInAnimated={true}
	isOutAnimated={true}
	isPadded={false}
>
	<container
		class='email'
		style='
			--height: {CSSUtility.parse($emailHeadingHeightWritable)}
		'
	>
		{#if isGameOver} 
			<a 
				class='email'
				href='mailto://HELLO@ljs.lol'
				in:dropIn
			>
				<heading>
					HELLO@ljs.lol
				</heading>
			</a>
			<container
				class='minigame over'
				in:dropIn
			>
				<!-- <string
					class='worthy'
				>
					well played.
				</string> -->
				<container
					class='reset'
				>
					<Button
						on:click={reset}
					>
						reset worth
					</Button>
				</container>
			</container>
		{:else}
			<heading
				in:dropIn
				class='minigame'
				on:click={damage}
			>
				{currentEnemyState}
			</heading>
			<container
				class='minigame'
				in:dropIn
			>
				<!-- {#each $currentLevelContentWritable as content, i}
					<heading
						class='minigame'
						on:click={() => {
							$currentLevelContentWritable[i] = ' ';
							currentLevelKilledEnemiesWritable.update((value) => value + 1);
						}}
					>
						{content}
					</heading>
				{/each} -->
				<string
					class='worthy'
				>
					wanna talk?
					defeat me, prove thy worthiness.
				</string>
			</container>
		{/if}
	</container>
	<Footer />
</Scene>

<style>
	container.email {
		display: grid;
		justify-items: center;
		align-items: center;
		grid-template-rows: 1fr 1fr 1fr;

		width: 100%;
		height: var(--height);
	}

	container.email > a {
		grid-row: 2;

		text-decoration-color: var(--colour-text-primary);
	}

	container.email > a > heading {
		cursor: pointer;
		user-select: none;

		transform: scale(1);

		transition: all 0.3s var(--ease-fast-slow);
	}

	container.email > a > heading:hover {
		color: var(--colour-text-secondary);
		transform: scale(1.1);
	}

	container.email > a:hover {
		text-decoration-color: var(--colour-background-primary);
	}

	container.email string.worthy {
		grid-row: 1;
		grid-column: 1;
		/* margin-block-start: 0; */

		white-space: pre-line;
		text-align: center;

		user-select: none;

		line-height: 1.2rem;
	}

	/* container.email > container.minigame:not(.over) {
		grid-row: 2;
		grid-column: 1;
	} */

	container.email > heading.minigame {
		grid-row: 2;
		grid-column: 1;

		cursor: crosshair;
		user-select: none;

		transform: scale(1);

		transition: all 0.3s var(--ease-fast-slow);
	}

	container.email > heading.minigame:active {
		filter: invert(1);
		transform: scale(0.9);
	}

	container.email > container.minigame > container.reset {
		/* grid-row: 2;
		grid-column: 1; */
		grid-row: 1;
		grid-column: 1;

		/* padding-bottom: var(--padding);
		box-sizing: border-box; */

		/* align-self: flex-start; */
		/* min-height: 100px; */

		justify-self: flex-end;
	}

	container.email > container.minigame {
		display: grid;
		justify-items: center;
		align-items: center;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;

		height: 100%;

		

		grid-row: 3;
		grid-column: 1;
	}
</style>