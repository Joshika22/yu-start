import { setError, superValidate } from 'sveltekit-superforms';
import type { Actions } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { signupFormSchema } from './schema';
import { userRepository } from '$lib/server/repository/user_repository';
import { authRepository } from '$lib/server/repository/auth_repository';
import { redirect, fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signupFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { firstName, lastName, email, password, confirmPassword } = form.data;
		if (password !== confirmPassword) {
			return setError(form, 'confirmPassword', 'Passwords do not match');
		}
		const userCheck = await userRepository.getUserByEmail(email);
		if (userCheck) {
			return setError(form, 'email', 'Email already in use');
		}
		const user = await userRepository.createUser({
			firstName,
			lastName,
			email,
			password
		});
		const session = await authRepository.createSession(user.id);
		const sessionCookie = authRepository.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			...sessionCookie.attributes
		});
		return redirect(302, '/app');
	}
};
