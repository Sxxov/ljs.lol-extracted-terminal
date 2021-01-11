<script>
	import { push } from 'svelte-spa-router';
	import Scene from '../blocks/Scene.svelte';
	import { SMS } from '../../core/sms';
	import contacts from '../../resources/contacts';

	const sms = new SMS(contacts.RenderScene);
	const context = sms.fetch(contacts.DebugScene).map(({ content }) => content)[0] ?? '';

	// if (!context) {
	// 	push('/');
	// }
</script>

<Scene
	isInAnimated={true}
	isOutAnimated={true}
>
	<heading>{context}</heading>
</Scene>