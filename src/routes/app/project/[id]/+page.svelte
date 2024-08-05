<script lang="ts">
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { taskStore } from '$lib/stores/task_store';
	import TaskTable from '$lib/components/custom/app/task_table.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<ScrollArea class="h-screen">
	<div class="flex w-full flex-col">
		{#if $taskStore}
			<TaskTable projectId={data.projectId} bind:taskData={$taskStore} />
		{/if}
	</div>
</ScrollArea>
