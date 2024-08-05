import type { Project } from '@prisma/client';
import { get, writable } from 'svelte/store';

export const projectStore = writable<Project[]>([]);

export const projectService = {
	getProjects: () => {
		return get(projectStore);
	},
	getProjectById: (projectId: string) => {
		const projects = get(projectStore);
		return projects.find((project) => project.id === projectId);
	}
};

export const projectApiService = {
	createProject: async (projectName: string) => {
		const response = await fetch('/api/project', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				projectName
			})
		});
		const responseJson: Project | null | undefined = await response.json();
		if (responseJson) {
			projectStore.update((projects) => {
				if (projects) {
					return [...projects, responseJson];
				}
				return [responseJson];
			});
		} else {
			console.error('Failed to create project');
		}
	}
};

export const projectStoreService = {
	getProjectWithId: (projectId: string | null) => {
		if (!projectId) {
			return null;
		}
		return get(projectStore).find((project) => project.id === projectId);
	}
};
