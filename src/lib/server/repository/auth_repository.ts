import { prismaClient } from '$lib/server/database';
import type { PrismaClient, Session } from '@prisma/client';
import { hash, verify } from '@node-rs/argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

type CookieType = {
	name: string;
	value: string;
	attributes: {
		httpOnly?: boolean;
		secure?: boolean;
		path: string;
		expires?: Date;
		sameSite?: 'strict' | 'lax' | 'none';
	};
};

class AuthRepository {
	prismaClient: PrismaClient;
	sessionCookieName = 'session';
	sessionBlankCookieValue = 'blank';
	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}
	createValidityDate() {
		const validityDate = new Date();
		validityDate.setDate(validityDate.getDate() + 7);
		return validityDate;
	}
	checkValidityDate(validityDate: Date) {
		const currentDate = new Date();
		if (validityDate < currentDate) {
			return false;
		}
		return true;
	}
	async getSession(id: string): Promise<Session | null> {
		const session = await this.prismaClient.session.findUnique({
			where: {
				id
			}
		});
		return session;
	}
	async getSessionsByUser(userId: string): Promise<Session[]> {
		const sessions = await this.prismaClient.session.findMany({
			where: {
				userId
			}
		});
		return sessions;
	}
	async createSession(userId: string): Promise<Session> {
		try {
			const session = await this.prismaClient.session.create({
				data: {
					userId,
					validity: this.createValidityDate()
				}
			});
			return session;
		} catch (e) {
			console.log(e);
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2003') {
					throw new Error('User not found');
				}
			}
			throw new Error('Error creating session');
		}
	}
	async validateSession(id: string): Promise<{
		isValid: boolean;
		session?: Session;
	}> {
		const session = await this.getSession(id);
		if (!session) {
			return {
				isValid: false
			};
		}
		const isValid = this.checkValidityDate(session.validity);
		if (!isValid) {
			await this.deleteSession(id);
			return {
				isValid: false
			};
		}
		return {
			isValid: true,
			session
		};
	}
	async updateSession() {}
	async deleteSession(id: string): Promise<Session> {
		const session = await this.prismaClient.session.delete({
			where: {
				id
			}
		});
		return session;
	}
	async hashPassword(password: string): Promise<string> {
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		return passwordHash;
	}
	async verifyPassword({
		password,
		passwordHash
	}: {
		password: string;
		passwordHash: string;
	}): Promise<boolean> {
		const isValid = await verify(passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		return isValid;
	}
	createSessionCookie(sessionId: string): CookieType {
		return {
			name: this.sessionCookieName,
			value: sessionId,
			attributes: {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: true,
				expires: this.createValidityDate()
			}
		};
	}
	createBlankSessionCookie(): CookieType {
		return {
			name: this.sessionCookieName,
			value: this.sessionBlankCookieValue,
			attributes: {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: true,
				expires: new Date()
			}
		};
	}
}

export const authRepository = new AuthRepository(prismaClient);
