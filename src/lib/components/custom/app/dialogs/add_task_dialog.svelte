<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { DateValue } from '@internationalized/date';
	import DatePicker from '../date_picker.svelte';
	import LabelPicker from '../label_picker.svelte';
	import ProjectPicker from '../project_picker.svelte';
	import type { Priority } from '@prisma/client';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { labelService } from '$lib/stores/label_store';
	import { projectService } from '$lib/stores/project_store';
	import { taskApiService } from '$lib/stores/task_store';
	import Icon from '@iconify/svelte';
	import Combobox from '../combobox.svelte';

	let dueDate: DateValue | undefined = undefined;
	let title: string = '';
	let projectId: string | undefined = undefined;
	let labelIds: string[] = [];
	let priority: Priority | undefined = undefined;
	let open = false;
	let loading = false;
	function dateValueToDate(dueDate: DateValue): Date {
		return new Date(dueDate.year, dueDate.month, dueDate.day);
	}

	async function handleSubmit(event: Event) {
		await taskApiService.createTask({
			title,
			dueDate: dueDate ? dateValueToDate(dueDate) : undefined,
			projectId,
			labelIds,
			priority
		});
		title = '';
		dueDate = undefined;
		projectId = undefined;
		labelIds = [];
		priority = undefined;
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Add Task</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add New Task</Dialog.Title>
		</Dialog.Header>
		<ScrollArea class="h-[90vh]">
			<form on:submit|preventDefault={handleSubmit} class="flex flex-col space-y-4 p-4">
				<Label for="title">Title</Label>
				<Input required bind:value={title} type="text" name="title" placeholder="Enter Task" />
				<Label for="date">Due Date</Label>
				<DatePicker bind:value={dueDate} />
				<Label for="labels">Priority</Label>
				<Combobox
					dataList={[
						{
							label: 'High',
							value: 'HIGH'
						},
						{
							label: 'Medium',
							value: 'MEDIUM'
						},
						{
							label: 'Low',
							value: 'LOW'
						}
					]}
					tickMark
					commandPlaceholder="Select Priority..."
					bind:value={priority}
				/>
				<Label for="labels">Labels</Label>
				<LabelPicker bind:selectedLabels={labelIds} labels={labelService.getLabels()} />
				<Label for="project">Project</Label>
				<ProjectPicker bind:projectId projects={projectService.getProjects()} />
				<Button disabled={loading} type="submit">
					{#if loading}
						<Icon icon="tabler:loader-2" class="mr-2 animate-spin text-xl" />
					{/if}
					Add
				</Button>
			</form>
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
