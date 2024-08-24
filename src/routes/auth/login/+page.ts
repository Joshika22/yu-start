import { superValidate } from 'sveltekit-superforms';
import type { PageLoad } from './$types';
import { loginFormSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageLoad = async () => {
	const form = await superValidate(zod(loginFormSchema));
	return {
		form
	};
};
