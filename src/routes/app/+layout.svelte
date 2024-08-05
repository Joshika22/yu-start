<script lang="ts">
	import AddLabelDialog from '$lib/components/custom/app/dialogs/add_label_dialog.svelte';
	import AddProjectDialog from '$lib/components/custom/app/dialogs/add_project_dialog.svelte';
	import AddTaskDialog from '$lib/components/custom/app/dialogs/add_task_dialog.svelte';
	import NavigationBar from '$lib/components/custom/app/navigation_bar.svelte';
	import { userApiService } from '$lib/stores/user_store';
	import { onMount } from 'svelte';
	let loading = false;
	onMount(async () => {
		loading = true;
		await userApiService.getUser();
		loading = false;
	});
</script>

<main class="flex h-screen flex-row">
	<NavigationBar />
	<div class="flex h-full basis-4/5 flex-col">
		<div class="flex flex-row space-x-4 p-3">
			<AddTaskDialog />
			<AddLabelDialog />
			<AddProjectDialog />
		</div>
		{#if loading}
			<div class="flex h-full items-center justify-center">Loading...</div>
		{:else}
			<slot />
		{/if}
	</div>
</main>
