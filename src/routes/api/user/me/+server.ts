import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userRepository } from '$lib/server/repository/user_repository';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}
	const user = await userRepository.getUserWithAllRelations(locals.user.id);	
	return json(user, { status: 200 });
};
