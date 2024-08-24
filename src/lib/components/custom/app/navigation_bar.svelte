<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import ThemeToggle from './theme_toggle.svelte';
	import { projectStore } from '$lib/stores/project_store';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { userApiService } from '$lib/stores/user_store';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	const navigationButtons = [
		{
			icon: 'material-symbols:inbox-outline',
			text: 'Tasks',
			route: '/app'
		},
		{
			icon: 'tabler:tags',
			text: 'Labels',
			route: '/app/label'
		},
		{
			icon: 'lucide:brain-circuit',
			text: 'Chat',
			route: '/app/chat'
		}
	];
</script>

<div class="flex basis-1/5 flex-col border-r">
	<ScrollArea class="h-[90vh]">
		<div class="flex flex-col space-y-2 p-4">
			<div class="flex flex-row items-center justify-between">
				<div class="font-bold text-primary">Yu-Start</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Avatar.Root>
							<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
							<Avatar.Fallback>CN</Avatar.Fallback>
						</Avatar.Root>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>My Account</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item
								on:click={async () => {
									toast.info('Logging out...');
									await userApiService.logout();
									goto('/auth/login');
								}}>Logout</DropdownMenu.Item
							>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<Separator orientation="horizontal" />
			{#each navigationButtons as navButton}
				<Button href={navButton.route} variant="ghost" class="w-full items-center justify-start">
					<Icon icon={navButton.icon} class="mr-2 text-xl" />
					{navButton.text}
				</Button>
			{/each}
			<!-- Theme Mode  -->
			<ThemeToggle />
			<Separator orientation="horizontal" />
			<div class="font-bold">Projects</div>
			{#each $projectStore as project}
				<Button variant="ghost" href={`/app/project/${project.id}`} class="justify-start">
					{project.name}
				</Button>
			{/each}
		</div>
	</ScrollArea>
	<div class="flex flex-col space-y-2 p-4">
		<div class="">Made by</div>

		<Button
			class="justify-start  bg-[#ECB] text-lg italic text-black hover:bg-white hover:text-[#ECB] hover:shadow-lg dark:hover:bg-black dark:shadow-muted"
			href="https://www.linkedin.com/in/joshika-sathishkumar/"
			target="_blank"
			variant="default">Joshika</Button
		>
	</div>
</div>
