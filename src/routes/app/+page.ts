import { taskApiService } from '$lib/stores/task_store';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	await taskApiService.getTasks(event);
	return {};
};
