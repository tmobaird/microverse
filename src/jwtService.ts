const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY || "default-secret-key";

export const generateToken = (userId: string): string => {
  const expirationDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days

  const token = jwt.sign({ userId, exp: expirationDate }, secretKey);
  return token;
};

export const decodeToken = (token: string): any => {
  const decoded = jwt.verify(token, secretKey);
  return decoded;
};
