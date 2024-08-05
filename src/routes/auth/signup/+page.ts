import { superValidate } from 'sveltekit-superforms';
import type { PageLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { signupFormSchema } from './schema';

export const load: PageLoad = async () => {
	const form = await superValidate(zod(signupFormSchema));
	return {
		form
	};
};
