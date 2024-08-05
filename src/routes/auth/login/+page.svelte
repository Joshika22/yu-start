<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	export let data: PageData;
	const form = superForm(data.form, {
		onResult: ({ result }) => {
			if (result.type === 'redirect') {
				goto(result.location);
			}
		}
	});
	const { form: formData, enhance, delayed } = form;
</script>

<div class="flex h-full flex-col items-center justify-center">
	<div class="text-2xl font-bold">Login</div>
	<form use:enhance method="post" class="flex w-96 flex-col space-y-2">
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input
					required
					type="email"
					bind:value={$formData.email}
					placeholder="Enter Email"
					{...attrs}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input
					required
					type="password"
					placeholder="Enter Password"
					bind:value={$formData.password}
					{...attrs}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button type="submit">
			{#if $delayed}
				<Icon icon="tabler:loader-2" class="mr-2 animate-spin text-xl" />
			{/if}
			Login</Form.Button
		>
		<Button variant="link" href="/auth/signup">Don't have an account? Sign Up</Button>
	</form>
</div>
