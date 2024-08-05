import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { labelRepository } from '$lib/server/repository/label_repository';

export const POST: RequestHandler = async ({ locals, request }) => {
	const user = locals.user;
	if (!user) {
		return json('Unauthorized', { status: 401 });
	}
	const body: {
		labelName: string;
	} = await request.json();
    const label = await labelRepository.createLabel(body.labelName, user.id);
    return json(label, { status: 201 });
};

export const DELETE: RequestHandler = async ({ locals, url, request }) => {
	const user = locals.user;
	if (!user) {
		return json('Unauthorized', { status: 401 });
	}
	const body : {
		id: string;
	} = await request.json();
	const labelId = body.id;
	const label = await labelRepository.deleteLabel(labelId, user.id);
	return json(label, { status: 200 });
}