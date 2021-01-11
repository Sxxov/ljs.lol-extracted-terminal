<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let levelWritable = writable(0);

	export const Levels = {
		INFO: 0,
		WARN: 1,
		ERROR: 2,
		OK: 3,
		NONE: 4,
	};

	const LevelClasses = [
		'info',
		'warn',
		'error',
		'ok',
		'none',
	];

	const LevelIcons = [
		'error_outline',
		'warning',
		'error',
		'done',
	];

	let contentDomContent = null;
	const icon = writable(LevelIcons[0]);

	levelWritable.subscribe((level) => {
		if (!contentDomContent) {
			return;
		}

		clearLevelClasses(contentDomContent);

		contentDomContent.classList.add(LevelClasses[level]);
		if (LevelIcons[level] != null) {
			icon.set(LevelIcons[level]);
		}
	});

	onMount(() => {
		clearLevelClasses(contentDomContent);
	});

	function clearLevelClasses(node) {
		const classesToBeRemoved = [];

		node
			.classList
			.forEach((className) => {
				if (!LevelClasses.includes(className)) {
					return;
				}

				classesToBeRemoved.push(className);
			});
	
		node
			.classList
			.remove(...classesToBeRemoved);
	}
</script>

<component>
	<span
		class='content error warn info ok none'
		bind:this={contentDomContent}
	>
		<icon>
			{$icon}
		</icon>
		<string class='text'>
			<slot>Hint</slot>
		</string>
	</span>
</component>

<style>
	.content.none {
		opacity: 0;
		height: 0;
	}

	.content.ok,
	.content.ok * {
		color: var(--colour-ok-primary);
	}

	.content.warn,
	.content.warn * {
		color: var(--colour-warn-primary);
	}

	.content.error, 
	.content.error * {
		color: var(--colour-error-primary);
	}

	.content, 
	.content.info {
		display: flex;
		align-items: center;
		
		color: var(--colour-text-secondary);

		overflow: hidden;

		/* height for '.none' */
		opacity: 1;
		height: calc(1rem + 2em);
	}

	.content,
	.content * {
		transition: 0.2s var(--ease-slow-slow)
	}

	string {
		font-size: 1rem;
		padding-left: 8px;
	}
</style>