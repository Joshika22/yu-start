import type { UserWithAllRelations } from '$lib/types';
import type { User } from '@prisma/client';
import { writable } from 'svelte/store';
import { labelStore } from './label_store';
import { projectStore } from './project_store';
import { taskStore } from './task_store';

export const userStore = writable<User | undefined>(undefined);

export const userApiService = {
	getUser: async () => {
		const response = await fetch('/api/user/me');
		const responseJson: UserWithAllRelations = await response.json();
		userStore.set({ ...responseJson });
		labelStore.set(responseJson.labels);
		projectStore.set(responseJson.projects);
		taskStore.set(responseJson.tasks);
		return responseJson;
	},
	logout: async () => {
		const response = await fetch('/api/auth/logout');
		const responseJson = await response.json();
		userStore.set(undefined);
		labelStore.set([]);
		projectStore.set([]);
		taskStore.set([]);
		return responseJson;
	}
};

// export const userStoreService = {
// 	getUser: () => {
// 		return get(userStore)!;
// 	}
// };
