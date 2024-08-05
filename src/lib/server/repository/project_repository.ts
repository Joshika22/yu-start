import type { PrismaClient, Project } from '@prisma/client';
import { prismaClient } from '../database';

class ProjectRepository {
	prismaClient: PrismaClient;
	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}
	async createProject(projectName: string, userId: string): Promise<Project> {
		return await this.prismaClient.project.create({
			data: {
				name: projectName,
				userId: userId
			}
		});
	}
}

export const projectRepository = new ProjectRepository(prismaClient);