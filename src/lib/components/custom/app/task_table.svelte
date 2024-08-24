<script lang="ts">
	import { formatDate } from '$lib/client_utils';
	import { Badge } from '$lib/components/ui/badge';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Table from '$lib/components/ui/table';
	import { labelStoreService } from '$lib/stores/label_store';
	import { projectStoreService } from '$lib/stores/project_store';
	import { taskService } from '$lib/stores/task_store';
	import type { Task } from '@prisma/client';
	export let taskData: Task[];
	export let projectId: string | null = null;
</script>

<Table.Root>
	<Table.Caption></Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]"></Table.Head>
			<Table.Head>Title</Table.Head>
			<Table.Head>Priority</Table.Head>
			<Table.Head>Project</Table.Head>
			<Table.Head>Due Date</Table.Head>
			<Table.Head>Labels</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each taskData as task}
			{#if !task.completed && (!projectId || projectId === task.projectId)}
				<Table.Row>
					<Table.Cell class="font-medium">
						<Checkbox
							checked={task.completed}
							on:click={() => {
								taskService.toggleTask(task.id);
							}}
						/>
					</Table.Cell>
					<Table.Cell class="font-medium">{task.title}</Table.Cell>
					<Table.Cell>
						{#if task.priority}
							<Badge
								variant="default"
								class={task.priority === 'HIGH'
									? 'bg-red-500'
									: task.priority === 'MEDIUM'
										? 'bg-yellow-400'
										: 'bg-green-500'}
							>
								{task.priority}
							</Badge>
						{/if}
					</Table.Cell>
					<Table.Cell>{projectStoreService.getProjectWithId(task.projectId)?.name ?? ''}</Table.Cell
					>
					<Table.Cell>{formatDate(task.dueDate)}</Table.Cell>
					<Table.Cell class="grid grid-cols-2 gap-1">
						{#each labelStoreService.getLabelWithIds(task.labelIds) as label}
							<Badge variant="secondary">
								{label.name}
							</Badge>
						{/each}
					</Table.Cell>
				</Table.Row>
			{/if}
		{/each}
	</Table.Body>
</Table.Root>
