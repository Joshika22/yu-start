<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import { mode, toggleMode } from 'mode-watcher';
</script>

<Button on:click={toggleMode} variant="ghost" class="items-center justify-start">
	{#if $mode === 'light'}
		<Icon icon="material-symbols:dark-mode" class="mr-2 text-xl" />
		Dark
	{:else}
		<Icon icon="material-symbols:light-mode" class="mr-2 text-xl" />
		Light
	{/if}
</Button>
