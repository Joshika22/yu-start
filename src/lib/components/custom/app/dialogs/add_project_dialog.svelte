<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import { projectApiService } from '$lib/stores/project_store';
	let projectName = '';
	let open = false;
	async function handleSubmit() {
		if (projectName === '') {
			return;
		}
		await projectApiService.createProject(projectName);
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'secondary' })}>Add Project</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Project</Dialog.Title>
		</Dialog.Header>
		<form on:submit|preventDefault={handleSubmit} class="flex flex-col space-y-4 p-4">
			<Label for="project">Project</Label>
			<Input required name="project" bind:value={projectName} />
			<Button type="submit" class="w-fit">Add</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
