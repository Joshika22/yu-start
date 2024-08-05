import { authRepository } from '$lib/server/repository/auth_repository';
import { userRepository } from '$lib/server/repository/user_repository';
import { json, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authHandler: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(authRepository.sessionCookieName);
	if (!sessionId || sessionId === authRepository.sessionBlankCookieValue) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
		// return json({ message: 'Unauthorized: Session Invalid' }, { status: 401 });
	}
	const session = await authRepository.validateSession(sessionId);
	if (!session.isValid || !session.session) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	const user = await userRepository.getUser(session.session.userId);
	if (!user) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	event.locals.user = user;
	event.locals.session = session.session;
	return resolve(event);
};

const routeHandler: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/auth') && event.locals.session) {
		return redirect(302, '/app');
	}
	if (event.url.pathname.startsWith('/app') && !event.locals.session) {
		return redirect(302, '/auth/login');
	}
	if (event.url.pathname.startsWith('/api') && !event.locals.user) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}
	if (event.url.pathname === '/') {
		if (event.locals.session) {
			return redirect(302, '/app');
		}
		return redirect(302, '/auth/login');
	}
	return resolve(event);
};

export const handle: Handle = sequence(authHandler, routeHandler);
