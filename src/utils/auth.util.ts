import { Role } from "@prisma/client";
import bcryptjs from "bcryptjs";
import type { Session, User } from "next-auth";

const SALT_ROUNDS = 10;

/**
 * Hashes a password using bcrypt
 * @param password - The plaintext password to hash
 * @returns A promise that resolves to an object of hashed password string and salt
 */
export const hashPassword = async (
  password: string,
): Promise<{
  hashedPassword: string;
}> => {
  const salt = await bcryptjs.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcryptjs.hash(password, salt);
  return { hashedPassword };
};

/**
 * Verifies if a given password matches the stored hashed password
 * @param password - The plaintext password
 * @param hashedPassword - The hashed password to compare against
 * @returns A promise that resolves to true if the password matches, false otherwise
 */
export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcryptjs.compare(password, hashedPassword);
};


export const isAdmin = (sessionOrUser: Session | User) => {
  const role = "role" in sessionOrUser ? sessionOrUser.role : sessionOrUser.user.role
  return role === Role.SUPER_ADMIN || role === Role.ADMIN
}
