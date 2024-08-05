import type { Prisma, PrismaClient, Task } from '@prisma/client';
import { prismaClient } from '../database';
import type { TaskPostRequestType } from '$lib/types/request_types';

type TaskWithAllRelations = Prisma.TaskGetPayload<{
	include: {
		project: true;
		labelOnTask: {
			include: {
				label: true;
			};
		};
	};
}>;

class TaskRepository {
	prismaClient: PrismaClient;
	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}
	async getTask() {}
	async getTasksByUserId(userId: string) {
		const tasks = await this.prismaClient.task.findMany({
			where: {
				userId
			}
		});
		return tasks;
	}
	async getTasksWithAllRelationsByUserId(userId: string): Promise<TaskWithAllRelations[]> {
		const tasks = await this.prismaClient.task.findMany({
			where: {
				userId
			},
			include: {
				project: true,
				labelOnTask: {
					include: {
						label: true
					}
				}
			}
		});
		return tasks;
	}
	async createTask(taskData: TaskPostRequestType & { userId: string }) {
		const task = await this.prismaClient.task.create({
			data: {
				completed: false,
				userId: taskData.userId,
				title: taskData.title,
				dueDate: taskData.dueDate,
				projectId: taskData.projectId,
				labelIds: taskData.labelIds,
				priority: taskData.priority
			}
		});
		return task;
	}
	async updateTask(taskData: Task) {
		const task = await this.prismaClient.task.update({
			where: {
				id: taskData.id
			},
			data: {
				completed: taskData.completed,
				title: taskData.title,
				dueDate: taskData.dueDate,
				projectId: taskData.projectId,
				labelIds: taskData.labelIds,
				priority: taskData.priority
			}
		});
		return task;
	}
	
}

export const taskRepository = new TaskRepository(prismaClient);
