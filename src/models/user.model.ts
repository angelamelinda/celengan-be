import { hashPassword, generateId, writeJSONFile, getDateNow, getToken } from "../helpers/helper";
import { IUser } from "../interfaces";
const fileUser = __dirname + '/../data/user.json';
const userData = require(fileUser);

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
            const { username, email, created_date, updated_date }: IUser = userData[userId]
            const user = { username, email, created_date, updated_date, id: userId }
            const token = getToken(user);

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
        if (!(username && email && password)) {
            reject({
                message: 'username or email or password is not complete',
                status: 400
            })
        }

        let id = generateId();

        while (userData[id]) {
            id = generateId();
        }

        const isFound = Object.keys(userData).some((key) => {
            console.log(key, '--', userData[key].email === email, userData[key].email, email);
            console.log(key, '--', userData[key].username === username, userData[key].username, username);
            return userData[key].email === email || userData[key].username === username
        })

        if (isFound) {
            reject({
                message: 'username or email already registered',
                status: 400
            })
        } else {
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
        }


    })
}

export default {
    getUser,
    login,
    register,
}