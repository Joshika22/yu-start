import type { Prisma, Task } from '@prisma/client';

export type UserWithAllRelations = Prisma.UserGetPayload<{
	include: {
		events: true;
		labels: true;
		projects: true;
		sessions: true;
		tasks: true;
	};
}>;



