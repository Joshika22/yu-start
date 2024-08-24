<script lang="ts">
	import { formatDate } from '$lib/client_utils';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { labelStore } from '$lib/stores/label_store';
	import { projectService } from '$lib/stores/project_store';
	import { taskService } from '$lib/stores/task_store';
	import type { TaskClientType } from '$lib/types/client_types';

	export let task: TaskClientType;
	$: labels = $labelStore!.filter((label) => task.labelIds.includes(label.id));
</script>

<button class="flex flex-row items-center justify-between rounded-lg bg-secondary p-3">
	<div class="flex flex-row items-center justify-center space-x-4">
		<div>
			<Checkbox
				checked={task.completed ?? false}
				on:click={() => {
					taskService.toggleTask(task.id);
				}}
			/>
		</div>
		<div>
			{task.title}
		</div>
		{#if task.projectId}
			<Button variant="link">
				{projectService.getProjectById(task.projectId)?.name}
			</Button>
		{/if}
	</div>
	<div class="flex flex-row items-center space-x-4">
		<div class="flex flex-row items-center space-x-1">
			{#each labels as label}
				<Badge variant="default">{label.name}</Badge>
			{/each}
		</div>
		{#if task.dueDate}
			<div class="text-red-500">
				{formatDate(task.dueDate)}
			</div>
		{/if}
	</div>
</button>
