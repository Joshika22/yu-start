import { FunctionDeclarationSchemaType, VertexAI, type Tool } from '@google-cloud/vertexai';
import { taskRepository } from '../repository/task_repository';
import type { TaskPostRequestType } from '$lib/types/request_types';
import { env } from '$env/dynamic/private';

export const vertexAI = new VertexAI({
	location: env.LOCATION,
	project: env.PROJECT_ID
});

const modelName = 'gemini-1.0-pro-001';

export const functionDeclarations: Tool[] = [
	{
		functionDeclarations: [
			{
				name: 'getTasks',
				description: 'Get all tasks of a user'
			},
			{
				name: 'getTasksToday',
				description: 'Get all tasks of a user that are due today'
			},
			{
				name: 'createTask',
				description:
					'Create a task. It can be used to create multiple tasks as well by calling it multiple times',
				parameters: {
					required: ['title'],
					type: FunctionDeclarationSchemaType.OBJECT,
					description:
						'Task object which needs to be created. It contains Title, Priority, Due Date, Description, and Status. But title is the only required parameter to create',
					properties: {
						title: {
							type: FunctionDeclarationSchemaType.STRING,
							description: 'Title of the task'
						},
						priority: {
							type: FunctionDeclarationSchemaType.STRING,
							description:
								'Priority of the task. It must be one of the following: "LOW", "MEDIUM", "HIGH". It is not required parameter'
						},
						dueDate: {
							type: FunctionDeclarationSchemaType.STRING,
							description:
								'Due date of the task. It must be in the format "YYYY-MM-DD". It is not required parameter'
						}
					}
				}
			}
			// {
			// 	name: 'createTasks',
			// 	description: 'Create a set of tasks or many tasks',
			// 	parameters: {
			// 		type: FunctionDeclarationSchemaType.OBJECT,
			// 		description:
			// 			'Array of task objects which needs to be created. It contains Title, Priority, Due Date, Description, and Status. But title is the only required parameter to create',

			// 		properties: {
			// 			title: {
			// 				type: FunctionDeclarationSchemaType.STRING,
			// 				description: 'Title of the task'
			// 			},
			// 			priority: {
			// 				type: FunctionDeclarationSchemaType.STRING,
			// 				description:
			// 					'Priority of the task. It must be one of the following: "LOW", "MEDIUM", "HIGH". It is not required parameter'
			// 			},
			// 			dueDate: {
			// 				type: FunctionDeclarationSchemaType.STRING,
			// 				description:
			// 					'Due date of the task. It must be in the format "YYYY-MM-DD". It is not required parameter'
			// 			}
			// 		}
			// 	}
			// }
		]
	}
];

export const model = vertexAI.getGenerativeModel({
	model: modelName
});

export const getFunctions = (userId: string): Record<string, Function> => {
	return {
		getTasks: async () => {
			const response = await taskRepository.getTasksWithAllRelationsByUserId(userId);
			return response;
		},
		getTasksToday: async () => {
			const response = await taskRepository.getTasksWithAllRelationsByUserId(userId);
			const today = new Date();

			const tasksToday = response.filter((task) => {
				if (task.dueDate === null || task.completed) {
					return false;
				}
				const taskDueDate = task.dueDate as Date;
				return (
					taskDueDate.getFullYear() === today.getFullYear() &&
					taskDueDate.getMonth() === today.getMonth() + 1 &&
					taskDueDate.getDate() === today.getDate()
				);
			});
			return tasksToday;
		},
		createTask: async (task: TaskPostRequestType & { dueDate: string }) => {
			let dateObject: Date | undefined = undefined;
			if (task.dueDate !== undefined && task.dueDate !== '' && task.dueDate !== null) {
				const [year, month, day] = task.dueDate.split('-').map(Number);
				dateObject = new Date(year, month - 1, day);
			}
			return await taskRepository.createTask({
				...task,
				dueDate: dateObject,
				userId
			});
		},
		createTasks: async (tasks: (TaskPostRequestType & { dueDate: string })[]) => {
			const response = await Promise.all(
				tasks.map(async (task) => {
					let dateObject: Date | undefined = undefined;
					if (task.dueDate !== undefined && task.dueDate !== '' && task.dueDate !== null) {
						const [year, month, day] = task.dueDate.split('-').map(Number);
						dateObject = new Date(year, month - 1, day);
					}
					return await taskRepository.createTask({
						...task,
						dueDate: dateObject,
						userId
					});
				})
			);
			return response;
		}
	};
};
