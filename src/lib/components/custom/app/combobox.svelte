<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import { createEventDispatcher, tick } from 'svelte';

	export let dataList: { value: string; label: string }[];
	export let value: string | undefined;
	export let commandPlaceholder: string;
	export let tickMark: boolean;
	let open = false;
	$: selectedValue = dataList.find((f) => f.value === value)?.label ?? commandPlaceholder;
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
	const dispatch = createEventDispatcher();
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-[200px] justify-between"
		>
			{selectedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input placeholder={commandPlaceholder} />
			<Command.Empty>Not found.</Command.Empty>
			<Command.Group>
				{#each dataList as framework}
					<Command.Item
						value={framework.value}
						onSelect={(currentValue) => {
							value = currentValue;

							dispatch('change', { value });
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						{#if tickMark}
							<Check class={cn('mr-2 h-4 w-4', value !== framework.value && 'text-transparent')} />
						{/if}
						{framework.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
