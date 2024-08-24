import type { Priority } from "@prisma/client";

export type TaskPostRequestType = {
    title: string;
    dueDate?: Date;
    projectId?: string;
    labelIds?: string[];
    priority?: Priority;
};