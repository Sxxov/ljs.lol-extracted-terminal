// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// import pace from 'pace-js';
// import './style/core/pace.css';

// pace.start();

// import App from './App.svelte';
import Terminal from './ui/components/Terminal.svelte';
import './global.css';

const app = new Terminal({
	target: document.body,
	props: {},
});

export default app;
