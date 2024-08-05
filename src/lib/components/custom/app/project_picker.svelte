<script lang="ts">
	import Combobox from './combobox.svelte';
	import type { ProjectClientType } from '$lib/types/client_types';
	export let projectId: string | undefined;
	export let projects: ProjectClientType[];
</script>

<Combobox
	dataList={projects.map((e) => {
		return {
			value: e.id,
			label: e.name
		};
	})}
	tickMark
	commandPlaceholder="Select Project..."
	bind:value={projectId}
/>
