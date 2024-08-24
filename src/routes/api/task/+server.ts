import type { RequestHandler } from './$types';
import { taskRepository } from '$lib/server/repository/task_repository';
import { json } from '@sveltejs/kit';
import type { TaskPostRequestType } from '$lib/types/request_types';
import type { Task } from '@prisma/client';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}
	const body: TaskPostRequestType = await request.json();

	const task = await taskRepository.createTask({
		...body,
		userId: locals.user!.id
	});
	return json(task, { status: 201 });
};

export const GET: RequestHandler = async ({ locals }) => {
	const tasks : Task[] = await taskRepository.getTasksByUserId(locals.user!.id);
	return json(tasks, { status: 200 });
};

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}
	const body: Task = await request.json();

	const task = await taskRepository.updateTask({
		...body,
		userId: locals.user!.id
	});
	return json(task, { status: 200 });
}

