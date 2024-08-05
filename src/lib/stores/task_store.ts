import type { TaskClientType } from '$lib/types/client_types';
import type { TaskPostRequestType } from '$lib/types/request_types';
import type { $Enums, Task } from '@prisma/client';
import type { LoadEvent } from '@sveltejs/kit';
import { derived, get, writable, type Writable } from 'svelte/store';

export const taskStore = writable<Task[] | undefined>(undefined);

export const taskCompletedStore = derived(taskStore, ($taskStore) => {
	if ($taskStore) {
		return $taskStore.filter((task) => task.completed);
	}
	return [];
});

export const taskService = {
	toggleTask: async (taskId: string) => {
		taskStoreService.toggleTask(taskId);
		const task = taskStoreService.getTask(taskId);
		if (task) {
			await taskApiService.updateTask(task);
		}
	}
};

export const taskStoreService = {
	getTask: (taskId: string) => {
		const tasks = get(taskStore);
		if (tasks) {
			return tasks.find((task) => task.id === taskId);
		}
		return null;
	},
	toggleTask: (taskId: string) => {
		taskStore.update((tasks) => {
			if (tasks) {
				const task = tasks.find((task) => task.id === taskId);
				if (task) {
					task.completed = !task.completed;
				}
				return [...tasks];
			}
			return [];
		});
	}
};

export const taskApiService = {
	getTasks: async (event?: LoadEvent) => {
		let response;
		if (event) {
			response = await event.fetch('/api/task');
		} else {
			response = await fetch('/api/task');
		}
		const responseJson: Task[] | null = await response.json();
		if (responseJson) {
			taskStore.set(responseJson);
		} else {
			console.error('Failed to get tasks');
		}
		return responseJson;
	},
	createTask: async (taskData: TaskPostRequestType) => {
		const response = await fetch('/api/task', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(taskData)
		});
		const responseJson: Task | null = await response.json();
		// TODO: Add Sonner
		if (responseJson) {
			taskStore.update((tasks) => {
				if (tasks) {
					return [...tasks, responseJson];
				}
				return [responseJson];
			});
		} else {
			console.error('Failed to create task');
		}
	},
	updateTask: async (taskData: Task) => {
		const response = await fetch(`/api/task`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(taskData)
		});
		const responseJson: Task | null = await response.json();
	}
};
