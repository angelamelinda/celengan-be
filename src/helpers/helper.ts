import hash from 'object-hash';
import { v4 as uuidv4 } from 'uuid';
import { writeFileSync, readFileSync, existsSync, exists } from 'fs';
import jwt from 'jsonwebtoken';

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

export const getToken = (userid: string) => {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: { userid }
    }, 'secret');

}
