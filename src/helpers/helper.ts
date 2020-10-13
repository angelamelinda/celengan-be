import hash from 'object-hash';
import { v4 as uuidv4 } from 'uuid';
import { writeFileSync, readFileSync, existsSync, exists } from 'fs';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { IUser, IUserJWT } from '../interfaces';

export const generateId = () => {
    return uuidv4();
}

export const hashPassword = (str: string) => {
    return hash({ password: str })
}

export const writeJSONFile = (filename: string, content: any) => {
    try {
        writeFileSync(filename, JSON.stringify(content))
    } catch (err) {
        console.log('err', err)
    }
}

export const getDateNow = () => {
    return new Date().toISOString();
}

export const getToken = (data: IUserJWT) => {
    const expiredDate = new Date().getTime() + (24 * 60 * 60 * 1000);
    console.log(expiredDate)
    return jwt.sign({
        exp: expiredDate,
        data,
    }, process.env.SECRET_TOKEN as string);

}

export const verifyToken = (token: string, callback: (err: VerifyErrors | null, decoded: any) => void) => {
    return jwt.verify(token, process.env.SECRET_TOKEN as string, callback);
}