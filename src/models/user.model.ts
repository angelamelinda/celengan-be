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

// import mongoose, { Schema, Document } from 'mongoose';
// import { hashPassword } from '../helpers/helper';
// import { IUser } from '../interfaces';

// export interface IUserSchema extends Document, IUser {

// }

// const UserSchema: Schema = new Schema({
//     email: { type: String, required: true, unique: true },
//     username: { type: String, required: true },
//     password: { type: String, required: true }
// }, { timestamps: true }
// );

// UserSchema.pre('save', (next) => {
//     const user = this;

//     if (user) {
//         let { password }: IUserSchema = user;
//         password = hashPassword(password as string);
//         next();
//     }

// });

// UserSchema.method('comparePassword', (candidatePassword: string, callback: (err: any, isMatch: boolean) => void) => {
//     const user = this;
//     if (user && hashPassword(candidatePassword) === (user as IUserSchema).password) {
//         callback(null, true)
//     }
// });

// UserSchema.method('toJSON', () => {
//     const { __v, _id, ...object } = (this as any).toObject();
//     object.id = _id;
//     return object;
// });

// // Export the model and return your IUser interface
// export default mongoose.model<IUserSchema>('User', UserSchema);