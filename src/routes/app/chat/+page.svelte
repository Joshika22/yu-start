<script lang="ts">
	import ChatCard from '$lib/components/custom/chat/chat_card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { chatApiService, chatStore } from '$lib/stores/chat_store';
	import Icon from '@iconify/svelte';
	let chatInput = '';
	let loading = false;
	async function handleSubmit() {
		loading = true
		await chatApiService.sendMessage(chatInput);
		chatInput = ''; 
		loading = false;
	}
</script>

<div class="flex h-[90vh] w-full flex-col space-y-4 p-8">
	<ScrollArea class="h-[80vh]">
		<div class="mx-4 flex flex-col space-y-4">
			{#each $chatStore as chat}
				<ChatCard props={chat} />
			{/each}
		</div>
	</ScrollArea>
	<form on:submit|preventDefault={handleSubmit} class="flex flex-row space-x-4">
		<Input autocomplete="false" placeholder="Chat here..." name="chatInput" bind:value={chatInput} />
		<Button type="submit" disabled={loading}>
			{#if loading}
				<Icon icon="tabler:loader-2" class="animate-spin" />
			{/if}
			Send
		</Button>
	</form>
</div>
