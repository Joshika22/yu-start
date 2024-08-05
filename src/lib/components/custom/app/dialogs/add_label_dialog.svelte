<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import { labelApiService } from '$lib/stores/label_store';
	let labelName = '';
	let open = false;
	async function handleSubmit() {
		if (labelName === '') {
			return;
		}
		labelApiService.createLabel(labelName);
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'secondary' })}>Add Label</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Label</Dialog.Title>
		</Dialog.Header>
		<form on:submit|preventDefault={handleSubmit} class="flex flex-col space-y-4 p-4">
			<Label for="label">Label</Label>
			<Input required id="label" bind:value={labelName} />
			<Button type="submit" class="w-fit">Add</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
