<script lang="ts">
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { taskStore } from '$lib/stores/task_store';
	import TaskTable from '$lib/components/custom/app/task_table.svelte';
</script>

<ScrollArea class="h-screen">
	<div class="flex w-full flex-col">
		{#if $taskStore}
			<TaskTable bind:taskData={$taskStore} />
		{/if}
	</div>
</ScrollArea>
