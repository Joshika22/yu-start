import type { LabelClientType } from '$lib/types/client_types';
import type { Label } from '@prisma/client';
import { get, writable } from 'svelte/store';
export const labelStore = writable<LabelClientType[]>([]);

export const labelService = {
	getLabels: () => {
		return get(labelStore);
	}
};

export const labelStoreService = {
	getLabelWithIds: (labelIds: string[]) => {
		return get(labelStore).filter((label) => labelIds.includes(label.id));
	}
};

export const labelApiService = {
	createLabel: async (labelName: string) => {
		const response = await fetch('/api/label', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				labelName
			})
		});
		const responseJson: Label | null | undefined = await response.json();
		if (responseJson) {
			labelStore.update((labels) => {
				if (labels) {
					return [...labels, responseJson];
				}
				return [responseJson];
			});
		} else {
			console.error('Failed to create label');
		}
	},
	deleteLabel: async (labelId: string) => {
		const response = await fetch('/api/label', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: labelId
			})
		});
		const responseJson: Label | null | undefined = await response.json();
		if (responseJson) {
			labelStore.update((labels) => {
				if (labels) {
					return labels.filter((label) => label.id !== labelId);
				}
				return [];
			});
		} else {
			console.error('Failed to delete label');
		}
	}
};
