import { VerifyErrors } from "jsonwebtoken";
import { verifyToken } from "./helper"

export const authenticate = async (req: any, res: any, next: any) => {
    const token = (req.headers["x-access-token"] || req.headers["authorization"]).replace('Bearer ', '');
    const callback = (err: VerifyErrors | null, decoded: any) => {
        const currentDate = new Date().getTime();
        const expiredDate = new Date(decoded.exp).getTime();

        console.log(new Date(currentDate), new Date(expiredDate), new Date(decoded.exp));
        if (err || decoded && currentDate > expiredDate) {
            res.status(401).json({
                message: 'unauthorized',
            })
        } else {
            req.user = decoded.data
            next();
        }
    }

    await verifyToken(token, callback)
}
