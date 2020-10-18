import hash from "object-hash";
import { v4 as uuidv4 } from "uuid";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { IUserJWT } from "../interfaces";

export const generateId = () => {
  return uuidv4();
};

export const hashPassword = (str: string) => {
  return hash({ password: str });
};



export const getDateNow = () => {
  return new Date().toISOString();
};

export const getToken = (data: IUserJWT) => {
  const expiredDate = new Date().getTime() + 24 * 60 * 60 * 1000;
  return jwt.sign(
    {
      exp: expiredDate,
      data,
    },
    process.env.SECRET_TOKEN as string
  );
};

export const verifyToken = (
  token: string,
  callback: (err: VerifyErrors | null, decoded: any) => void
) => {
  return jwt.verify(token, process.env.SECRET_TOKEN as string, callback);
};
