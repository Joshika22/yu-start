import type { Priority } from '@prisma/client';

export type TaskClientType = {
	id: string;
	title: string;
	description?: string;
	dueDate?: Date;
	projectId?: string;
	labelIds: string[];
	priority?: Priority;
	completed?: boolean;
};

export type LabelClientType = {
	id: string;
	name: string;
};

export type ProjectClientType = {
	id: string;
	name: string;
};
