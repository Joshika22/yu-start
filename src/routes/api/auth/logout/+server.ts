import { authRepository } from '$lib/server/repository/auth_repository';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, cookies }) => {
	const session = locals.session;
	if (!session) {
		return json('Unauthorized', { status: 401 });
	}
	await authRepository.deleteSession(session.id);
	const sessionBlankCookie = authRepository.createBlankSessionCookie();
	cookies.set(sessionBlankCookie.name, sessionBlankCookie.value, {
		...sessionBlankCookie.attributes
	});
	return json({ body: 'Logged out' }, { status: 200 });
};
