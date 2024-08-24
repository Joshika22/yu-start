import { prismaClient } from '$lib/server/database';
import type { Prisma, PrismaClient, User } from '@prisma/client';
import { authRepository } from './auth_repository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import type { UserWithAllRelations } from '$lib/types';

class UserRepository {
	prismaClient: PrismaClient;
	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}
	async getUser(id: string): Promise<User | null> {
		return await this.prismaClient.user.findUnique({
			where: {
				id: id
			}
		});
	}
	async getUserWithAllRelations(id: string): Promise<UserWithAllRelations | null> {
		const user = await this.prismaClient.user.findUnique({
			where: {
				id
			},
			include: {
				tasks: true,
				labels: true,
				sessions: true,
				projects: true,
				
			}
		});

		return user;
	}
	async getUserByEmail(email: string): Promise<User | null> {
		return await this.prismaClient.user.findUnique({
			where: {
				email: email
			}
		});
	}
	async createUser({
		firstName,
		lastName,
		email,
		password
	}: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	}): Promise<User> {
		const passwordHash = await authRepository.hashPassword(password);
		try {
			const user = await this.prismaClient.user.create({
				data: {
					email,
					firstName,
					lastName,
					passwordHash
				}
			});
			return user;
		} catch (e) {
			console.log(e);
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					throw new Error('Email already exists');
				}
			}
			throw new Error('Error creating user');
		}
	}
	async updateUser() {}
	async updateUserByEmail() {}
	async deleteUser() {}
	async deleteUserByEmail() {}
}

export const userRepository = new UserRepository(prismaClient);
