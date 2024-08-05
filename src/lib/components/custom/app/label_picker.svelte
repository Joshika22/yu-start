<script lang="ts">
	import type { Label } from '@prisma/client';
	import Combobox from './combobox.svelte';
	import type { LabelClientType } from '$lib/types/client_types';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	let labelValue = '';
	export let labels: LabelClientType[];
	export let selectedLabels: string[];
</script>

<div class="flex flex-col space-y-4">
	<Combobox
		on:change={(e) => {
			const value = e.detail.value;
			if (selectedLabels.includes(value)) {
				return;
			}
			selectedLabels = [...selectedLabels, value];
		}}
		tickMark={false}
		dataList={labels.map((label) => {
			return { value: label.id, label: label.name };
		})}
		value={labelValue}
		commandPlaceholder="Search for a label..."
	/>
	<div class="flex flex-row space-x-2">
		{#each selectedLabels as label}
			<Badge>{labels.find((e) => e.id === label)?.name}</Badge>
		{/each}
	</div>
</div>
