<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
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
	<div class="text-2xl font-bold">Create an Account</div>
	<form use:enhance method="post" class="flex w-96 flex-col space-y-2">
		<Form.Field {form} name="firstName">
			<Form.Control let:attrs>
				<Form.Label>First Name</Form.Label>
				<Input bind:value={$formData.firstName} placeholder="Enter your First Name" {...attrs} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="lastName">
			<Form.Control let:attrs>
				<Form.Label>Last Name</Form.Label>
				<Input bind:value={$formData.lastName} placeholder="Enter your Last Name" {...attrs} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input bind:value={$formData.email} placeholder="Enter your Email" {...attrs} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input
					type="password"
					bind:value={$formData.password}
					placeholder="Enter your Password"
					{...attrs}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="confirmPassword">
			<Form.Control let:attrs>
				<Form.Label>Confirm Password</Form.Label>
				<Input
					type="password"
					bind:value={$formData.confirmPassword}
					placeholder="Confirm your Password"
					{...attrs}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button disabled={$delayed} type="submit">
			{#if $delayed}
				<Icon icon="tabler:loader-2" class="mr-2 animate-spin text-xl" />
			{/if}
			Sign Up
		</Form.Button>
		<Button variant="link" href="/auth/login">Already have an account? Login</Button>
	</form>
</div>
