import type { Label, PrismaClient } from '@prisma/client';
import { prismaClient } from '../database';

class LabelRepository {
	prismaClient: PrismaClient;
	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}
	async createLabel(labelName: string, userId: string): Promise<Label> {
		return await this.prismaClient.label.create({
			data: {
				name: labelName,
				userId: userId,
			},
		});
	}
	async deleteLabel(labelId: string, userId: string): Promise<Label> {
		return await this.prismaClient.label.delete({
			where: {
				id: labelId,
				userId: userId
			}
		});
	}
}

export const labelRepository = new LabelRepository(prismaClient);
