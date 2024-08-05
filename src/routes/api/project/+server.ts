import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { projectRepository } from '$lib/server/repository/project_repository';

export const POST: RequestHandler = async ({ locals, request }) => {
	const user = locals.user;
	if (!user) {
		return json('Unauthorized', { status: 401 });
	}
	const body: {
		projectName: string;
	} = await request.json();
	const project = await projectRepository.createProject(body.projectName, user.id);
	return json(project, { status: 201 });
};
