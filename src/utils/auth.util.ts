import bcrypt from "bcrypt";

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
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
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
  return bcrypt.compare(password, hashedPassword);
};
