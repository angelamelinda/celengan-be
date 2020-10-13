import { hashPassword, generateId, writeJSONFile, getDateNow, getToken } from "../helpers/helper";
const fileUser = __dirname + '/../data/user.json';
const fileSession = __dirname + '/../data/session.json';
const userData = require(fileUser);
const sessionData = require(fileSession);

const getUser = (id: string) => {
    return new Promise((resolve, reject) => {
        if (!userData[id]) {
            reject({
                message: 'user is not found',
                status: 404
            })
        }

        resolve({
            username: userData[id].username,
            email: userData[id].email,
        });
    });
}

const login = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
        const userId = Object.keys(userData).find((userId) => {
            if ((userData[userId].email === email && hashPassword(password) === userData[userId].password)) {
                return userId
            }

            return undefined
        });


        if (userId) {
            const token = getToken(userId);

            writeJSONFile(fileSession, { ...sessionData, [token]: userData[userId] })

            resolve({
                token
            })
        }

        reject({
            message: 'invalid email or password',
            status: 400
        })
    })
}

const register = (username: string, email: string, password: string) => {
    return new Promise((resolve, reject) => {
        let id = generateId();

        while (userData[id]) {
            id = generateId();
        }

        try {
            writeJSONFile(fileUser, {
                ...userData, [id]: {
                    username,
                    email,
                    password: hashPassword(password),
                    created_date: getDateNow(),
                    updated_date: getDateNow()
                }
            })

            resolve()
        } catch (e) {
            reject({
                message: 'failed to register',
                status: 400
            })
        }
    })
}

export default {
    getUser,
    login,
    register
}