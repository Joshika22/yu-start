import { setError, superValidate } from 'sveltekit-superforms';
import type { Actions } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { loginFormSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';
import { userRepository } from '$lib/server/repository/user_repository';
import { authRepository } from '$lib/server/repository/auth_repository';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { email, password } = form.data;
		const user = await userRepository.getUserByEmail(email);
		if (!user) {
			return setError(form, 'email', 'User not found');
		}
		const isValid = await authRepository.verifyPassword({
			password,
			passwordHash: user.passwordHash
		});
		if (!isValid) {
			return setError(form, 'password', 'Invalid password');
		}
		const session = await authRepository.createSession(user.id);
		const sessionCookie = authRepository.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			...sessionCookie.attributes
		});
		return redirect(302, '/app');
	}
};
