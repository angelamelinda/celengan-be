import { VerifyErrors } from "jsonwebtoken";
import { verifyToken } from "./helper";

export const authenticate = async (req: any, res: any, next: any) => {
  let token: string =
    req.headers["x-access-token"] || req.headers["authorization"];

  if (!token || token == undefined) {
    res.status(401).json({
      message: "unauthorized",
    });
    next({
      message: "no valid token",
      name: "missing token",
    });
    return;
  }

  token = token.replace("Bearer ", "");
  await verifyToken(token, (err: VerifyErrors | null, decoded: any) => {
    const currentDate = new Date().getTime();
    const expiredDate = new Date(decoded.exp).getTime();

    if (err || (decoded && currentDate > expiredDate)) {
      res.status(401).json({
        message: "unauthorized",
      });
      next({
        message: "invalid token",
        name: "invalid token",
      });
      return;
    } else {
      req.user = decoded.data;
      next();
    }
  });
};
