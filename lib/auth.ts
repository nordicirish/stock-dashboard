import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // You can adjust this, but 10 is a good default for security
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}
