<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Table from '$lib/components/ui/table';
	import { labelApiService, labelStore } from '$lib/stores/label_store';
	let loading = false;
	async function deleteLabel(labelId: string) {
		loading = true;
		await labelApiService.deleteLabel(labelId);
		loading = false;
	}
</script>

<ScrollArea class="h-screen">
	<div class="flex w-full flex-col">
		<Table.Root>
			<Table.Caption>A list of your recent invoices.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="">Name</Table.Head>
					<Table.Head class="">Delete</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each $labelStore as label}
					<Table.Row>
						<Table.Cell>{label.name}</Table.Cell>
						<Table.Cell class="">
							<Button
								disabled={loading}
								on:click={() => deleteLabel(label.id)}
								variant="destructive">Delete</Button
							>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</ScrollArea>
