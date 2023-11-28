import jwt, { Secret } from "jsonwebtoken";

const createToken = async (payload: { userId: number }, secret: Secret) => {
  const token = await jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
  return token;
};

const verifyToken = async (payload: string, secret: Secret) => {
  try {
    const token = await jwt.verify(payload, secret);
    console.log(token);
    return token;
  } catch (error) {
    return null;
  }
};

export const jwtHelper = {
  createToken,
  verifyToken,
};
