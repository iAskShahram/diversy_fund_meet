import { z } from "zod";

const groupNameSchema = z.string().min(1);

export const createGroupSchema = z.object({
  name: groupNameSchema,
  userIDs: z.array(z.string()).optional(),
});

export const paginationQuerySchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(10),
});

export const getGroupUsersSchema = z.object({
  groupId: z.string().cuid({ message: "Invalid group" }),
});

export const updateGroupSchema = z.object({
  groupId: z.string().cuid({ message: "Invalid group" }),
  name: groupNameSchema,
  userIDs: z.array(z.string()).optional(),
});
