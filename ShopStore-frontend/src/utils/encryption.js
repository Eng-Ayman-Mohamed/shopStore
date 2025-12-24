import bcrypt from "bcryptjs";

// Hash a plain text password
export const hashPassword = async (plainPassword) => {
  try {
    const saltRounds = 12; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
};

// Compare a plain text password with a hashed password
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Failed to compare password");
  }
};

// Check if a string is a valid bcrypt hash
export const isHashedPassword = (password) => {
  // bcrypt hashes start with $2a$, $2b$, $2y$ etc.
  const bcryptHashRegex = /^\$2[aby]?\$\d{2}\$/;
  return bcryptHashRegex.test(password);
};

// Generate a random salt (for advanced use cases)
export const generateSalt = async (rounds = 12) => {
  try {
    const salt = await bcrypt.genSalt(rounds);
    return salt;
  } catch (error) {
    console.error("Error generating salt:", error);
    throw new Error("Failed to generate salt");
  }
};
